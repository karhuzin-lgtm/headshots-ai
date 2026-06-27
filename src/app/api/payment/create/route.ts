import { NextResponse } from "next/server";

import {
  attachPaymentInfo,
  countRecentUnpaidGenerations,
  createGeneration,
  findRateLimitedGeneration,
  markGenerationPaidTestMode,
} from "@/lib/generations-db";
import { createPaymentInvoice, PENDING_GENERATION_COOKIE } from "@/lib/lavatop";
import { esc, notifyOperator } from "@/lib/notify";
import { startAstriaGeneration } from "@/lib/start-generation";
import { DEFAULT_TIER, getTier, purchasableTiers } from "@/lib/tiers";

const MAX_URL_LENGTH = 2048;

export const runtime = "nodejs";
export const maxDuration = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhotoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return (
      parsed.hostname.endsWith(".public.blob.vercel-storage.com") ||
      parsed.hostname.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: unknown;
      photoUrls?: unknown;
      tier?: unknown;
      testKey?: unknown;
    };
    // Owner test mode: skip LavaTop payment entirely (so test runs cost only
    // Astria, not 400₽). Gated by a secret env — never works in prod without it.
    const testKey = typeof body.testKey === "string" ? body.testKey : "";
    const isTest = !!process.env.TEST_GENERATE_SECRET && testKey === process.env.TEST_GENERATE_SECRET;
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const photoUrls = Array.isArray(body.photoUrls)
      ? body.photoUrls.filter((url): url is string => typeof url === "string")
      : [];
    // Tier comes from the client — never trust it for pricing. Only honor a tier
    // that is actually sellable (has its own LavaTop offer). In single-offer test
    // mode (no per-tier offers) force the default tier so the snapshot always
    // matches the one charged offer; no over-spec'd generation for the test price.
    const requestedTier = typeof body.tier === "string" ? body.tier : null;
    const allowedTiers = purchasableTiers();
    const tier =
      allowedTiers.length === 0
        ? getTier(DEFAULT_TIER)
        : allowedTiers.find((t) => t.id === requestedTier) ?? null;

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Введите корректный email." },
        { status: 400 }
      );
    }

    if (photoUrls.length < 8 || photoUrls.length > 20) {
      return NextResponse.json(
        { error: "Загрузите хотя бы 8 селфи." },
        { status: 400 }
      );
    }

    if (!photoUrls.every((url) => url.length <= MAX_URL_LENGTH && isValidPhotoUrl(url))) {
      return NextResponse.json({ error: "Некорректные ссылки на фото." }, { status: 400 });
    }

    // Rate-limits don't apply to owner test runs.
    if (!isTest) {
      const existingGeneration = await findRateLimitedGeneration(email);
      if (existingGeneration) {
        return NextResponse.json(
          {
            error:
              "У вас уже есть генерация в работе. Проверьте почту — результат придёт туда.",
          },
          { status: 429 }
        );
      }

      // Throttle create-spam (each call makes a LavaTop invoice + a DB row).
      const recentUnpaid = await countRecentUnpaidGenerations(email, 15);
      if (recentUnpaid >= 5) {
        return NextResponse.json(
          { error: "Слишком много попыток. Попробуйте через несколько минут." },
          { status: 429 }
        );
      }
    }

    if (!tier) {
      return NextResponse.json({ error: "Выбранный тариф недоступен." }, { status: 400 });
    }

    // Store the upload + email + tier first so the payment webhook can find it later.
    const generation = await createGeneration({
      email,
      inputUrls: photoUrls,
      tier: tier.id,
      expectedCount: tier.expectedCount,
      styleKeys: tier.styleKeys,
      superResolution: tier.superResolution,
      inferenceSteps: tier.inferenceSteps,
      trainingSteps: tier.trainingSteps,
    });

    // Notify operator of every new order (test + real), fire-and-forget.
    notifyOperator(
      `🆕 Новый заказ\nEmail: ${esc(email)}\nТариф: ${tier.name} (${tier.priceLabel})\nФото: ${tier.expectedCount}` +
        (isTest ? "\n(тест-режим, без оплаты)" : "")
    );

    // TEST MODE: mark paid + start generation immediately, no LavaTop charge.
    if (isTest) {
      const paid = await markGenerationPaidTestMode(generation.id);
      try {
        await startAstriaGeneration(paid ?? generation);
      } catch (error) {
        console.error("test generation start failed:", error);
      }
      const response = NextResponse.json({
        url: `/try/result/${generation.id}`,
        id: generation.id,
        test: true,
      });
      response.cookies.set(PENDING_GENERATION_COOKIE, generation.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 6,
      });
      return response;
    }

    let paymentUrl: string;
    let invoiceId: string;
    try {
      const invoice = await createPaymentInvoice({ email, tier });
      paymentUrl = invoice.paymentUrl;
      invoiceId = invoice.invoiceId;
    } catch (error) {
      console.error("LavaTop createInvoice failed:", error);
      notifyOperator(
        `⚠️ Сбой оплаты у клиента\nEmail: ${esc(email)}\nТариф: ${tier.name}\nне удалось создать инвойс`
      );
      return NextResponse.json(
        { error: "Не удалось перейти к оплате. Попробуйте ещё раз." },
        { status: 502 }
      );
    }

    let attached = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await attachPaymentInfo({
          id: generation.id,
          paymentId: invoiceId,
          paymentUrl,
        });
        attached = true;
        break;
      } catch (error) {
        console.error(
          `attachPaymentInfo failed (attempt ${attempt + 1}/3):`,
          error
        );
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 100 * 2 ** attempt));
        }
      }
    }

    if (!attached) {
      console.error(
        `CRITICAL: invoice created but not attached. Manual reconciliation needed. invoiceId=${invoiceId} generationId=${generation.id}`
      );
      notifyOperator(
        `⚠️ Сбой оплаты у клиента\nEmail: ${esc(email)}\nТариф: ${tier.name}\nне удалось привязать инвойс`
      );
      return NextResponse.json(
        { error: "Не удалось перейти к оплате. Попробуйте ещё раз." },
        { status: 502 }
      );
    }

    const response = NextResponse.json({ url: paymentUrl, id: generation.id });
    // Read back on the success-redirect page to route the user to their result.
    response.cookies.set(PENDING_GENERATION_COOKIE, generation.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 6,
    });
    return response;
  } catch (err) {
    console.error("payment/create error:", err);
    return NextResponse.json(
      { error: "Что-то пошло не так. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
