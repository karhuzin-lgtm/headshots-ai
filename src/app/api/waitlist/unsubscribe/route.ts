import { NextResponse } from "next/server";

import { unsubscribeWaitlistEmail } from "@/lib/waitlist-db";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get("email") ?? "").trim().toLowerCase();

  if (!isValidEmail(email)) {
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:20px;color:#111">
        <h1>Invalid email</h1><p>Please use the unsubscribe link from your email or contact aleksei@alekseimedia.com</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 400 }
    );
  }

  try {
    const ok = await unsubscribeWaitlistEmail(email);
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:20px;color:#111">
        <h1>${ok ? "You're unsubscribed" : "Email not found"}</h1>
        <p>${ok ? "You will no longer receive waitlist marketing emails from Headshots." : "We couldn't find this email on our waitlist."}</p>
        <p style="color:#666;font-size:14px;margin-top:24px"><a href="/">Return to Headshots</a></p>
      </body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
