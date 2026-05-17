import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type WaitlistEntry = {
  email: string;
  date: string;
};

const WAITLIST_PATH = path.join("/tmp", "waitlist.json");
const INITIAL_REMAINING_SPOTS = 1000;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const raw = await readFile(WAITLIST_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is WaitlistEntry =>
        typeof entry === "object" &&
        entry !== null &&
        "email" in entry &&
        "date" in entry &&
        typeof entry.email === "string" &&
        typeof entry.date === "string"
    );
  } catch {
    return [];
  }
}

async function saveWaitlist(entries: WaitlistEntry[]) {
  await mkdir(path.dirname(WAITLIST_PATH), { recursive: true });
  await writeFile(WAITLIST_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
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

async function sendWaitlistWelcomeEmail(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "Headshots AI <hello@headshots.alekseimedia.com>",
    to: email,
    subject: "You're on the list — founding member access secured",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;padding:0 20px;">
    
    <div style="margin-bottom:32px;">
      <p style="font-size:22px;font-weight:600;color:#111827;margin:0;">Headshots</p>
    </div>

    <h1 style="font-size:28px;font-weight:600;color:#111827;line-height:1.3;margin:0 0 16px;">
      You're in. Founding member access secured.
    </h1>
    
    <p style="font-size:16px;color:#6b7280;line-height:1.7;margin:0 0 24px;">
      We're opening generation in waves. As a founding member, you'll be among the first to get access — 
      and you've locked in <strong style="color:#111827;">40% off</strong> when paid plans go live.
    </p>

    <div style="background:#f9fafb;border-radius:16px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;font-weight:600;color:#111827;margin:0 0 12px;">What to expect:</p>
      <p style="font-size:14px;color:#6b7280;margin:0 0 8px;">✓ Upload 8-20 casual selfies from your phone</p>
      <p style="font-size:14px;color:#6b7280;margin:0 0 8px;">✓ AI trains a model specifically on your face</p>
      <p style="font-size:14px;color:#6b7280;margin:0 0 8px;">✓ Get studio-quality headshots in ~15 minutes</p>
      <p style="font-size:14px;color:#6b7280;margin:0;">✓ 6 styles: LinkedIn, Corporate, Executive, Tech, Creative, Startup</p>
    </div>

    <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 32px;">
      We'll email you the moment your spot opens. No spam, ever.
    </p>

    <div style="border-top:1px solid #e5e7eb;padding-top:24px;">
      <p style="font-size:13px;color:#9ca3af;margin:0;">
        headshots.alekseimedia.com · 
        <a href="mailto:aleksei@alekseimedia.com" style="color:#9ca3af;">Contact us</a>
      </p>
    </div>

  </div>
</body>
</html>
  `,
  });
}

export async function GET() {
  const entries = await readWaitlist();
  return NextResponse.json({
    count: entries.length,
    remaining: Math.max(0, INITIAL_REMAINING_SPOTS - entries.length),
  });
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

    const entries = await readWaitlist();
    const exists = entries.some((entry) => entry.email.toLowerCase() === email);

    if (exists) {
      return NextResponse.json({
        success: false,
        message: "Already on the list",
      });
    }

    const nextEntries = [...entries, { email, date: new Date().toISOString() }];
    const totalCount = nextEntries.length;

    try {
      await saveWaitlist(nextEntries);
    } catch {
      // Vercel functions only guarantee writable storage under /tmp, and even
      // that is best-effort. Telegram is the source of truth for signups.
    }

    try {
      await sendTelegramNotification(email, totalCount);
    } catch {
      // A Telegram outage should not block the signup.
    }

    try {
      await sendWaitlistWelcomeEmail(email);
    } catch {
      // Email delivery should not block the signup.
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
