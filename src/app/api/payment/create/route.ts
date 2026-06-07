import { NextResponse } from "next/server";

import {
  attachPaymentInfo,
  createGeneration,
  findRateLimitedGeneration,
} from "@/lib/generations-db";
import { createPaymentInvoice, PENDING_GENERATION_COOKIE } from "@/lib/lavatop";

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
    };
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const photoUrls = Array.isArray(body.photoUrls)
      ? body.photoUrls.filter((url): url is string => typeof url === "string")
      : [];

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

    if (!photoUrls.every(isValidPhotoUrl)) {
      return NextResponse.json({ error: "Некорректные ссылки на фото." }, { status: 400 });
    }

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

    // Store the upload + email first so the payment webhook can find it later.
    const generation = await createGeneration({ email, inputUrls: photoUrls });

    let paymentUrl: string;
    try {
      const invoice = await createPaymentInvoice({ email });
      paymentUrl = invoice.paymentUrl;
      await attachPaymentInfo({
        id: generation.id,
        paymentId: invoice.invoiceId,
        paymentUrl,
      });
    } catch (error) {
      console.error("LavaTop createInvoice failed:", error);
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
