import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

type WaitlistEntry = {
  email: string;
  date: string;
};

const WAITLIST_PATH = path.join("/tmp", "waitlist.json");
const INITIAL_REMAINING_SPOTS = 87;

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
