import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getWaitlistCount, insertWaitlistEmail } from "@/lib/waitlist-db";

export const runtime = "nodejs";

const INITIAL_REMAINING_SPOTS = 1000;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendTelegramNotification(email: string, count: number) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `🎯 New waitlist signup: ${email}\nTotal: ${count} people`,
    }),
  });
}

export async function GET() {
  try {
    const count = await getWaitlistCount();
    return NextResponse.json({
      count,
      remaining: Math.max(0, INITIAL_REMAINING_SPOTS - count),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email" },
        { status: 400 }
      );
    }

    const insertResult = await insertWaitlistEmail(email);
    if (insertResult === "duplicate") {
      return NextResponse.json({
        success: false,
        message: "Already on the list",
      });
    }

    const totalCount = await getWaitlistCount();

    try {
      await sendTelegramNotification(email, totalCount);
    } catch {
      // A Telegram outage should not block the signup.
    }

    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "Headshots AI <hello@alekseimedia.com>",
          to: email,
          subject: "You're on the list — founding member access secured",
          html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:560px;margin:40px auto;padding:0 20px;">
  <p style="font-size:22px;font-weight:600;color:#111827;margin:0 0 32px;">Headshots</p>
  <h1 style="font-size:28px;font-weight:600;color:#111827;line-height:1.3;margin:0 0 16px;">You're in. Founding member access secured.</h1>
  <p style="font-size:16px;color:#6b7280;line-height:1.7;margin:0 0 24px;">We're opening generation in waves. As a founding member, you'll be among the first to get access — and you've locked in <strong style="color:#111827;">40% off</strong> when paid plans go live.</p>
  <div style="background:#f9fafb;border-radius:16px;padding:24px;margin:0 0 24px;">
    <p style="font-size:14px;font-weight:600;color:#111827;margin:0 0 12px;">What to expect:</p>
    <p style="font-size:14px;color:#6b7280;margin:0 0 8px;">✓ Upload 8–20 casual selfies from your phone</p>
    <p style="font-size:14px;color:#6b7280;margin:0 0 8px;">✓ AI trains a model specifically on your face</p>
    <p style="font-size:14px;color:#6b7280;margin:0 0 8px;">✓ Get studio-quality headshots in ~15 minutes</p>
    <p style="font-size:14px;color:#6b7280;margin:0;">✓ 6 styles: LinkedIn, Corporate, Executive, Tech, Creative, Startup</p>
  </div>
  <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 32px;">We'll email you the moment your spot opens. No spam, ever.</p>
  <div style="border-top:1px solid #e5e7eb;padding-top:24px;">
    <p style="font-size:13px;color:#9ca3af;margin:0;">headshots.alekseimedia.com · <a href="mailto:aleksei@alekseimedia.com" style="color:#9ca3af;">Contact us</a></p>
  </div>
</div>
</body>
</html>`,
        });
      }
    } catch {
      // Email failure should not block the signup.
    }

    return NextResponse.json({
      success: true,
      count: totalCount,
      remaining: Math.max(0, INITIAL_REMAINING_SPOTS - totalCount),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
