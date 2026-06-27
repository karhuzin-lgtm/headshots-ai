/**
 * Fire-and-forget Telegram alerts to the operator on key business events
 * (order, payment, result, error). Designed for serverless:
 *  - synchronous signature (returns void) so callers never await it,
 *  - no-op when env is missing,
 *  - never throws — failures are logged, never surfaced to the request flow,
 *  - hard ~4s timeout so a slow Telegram never holds a serverless function open.
 */

const TELEGRAM_TIMEOUT_MS = 4000;

/** Escape the HTML special chars Telegram's parse_mode=HTML cares about. */
export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function notifyOperator(text: string): void {
  const token = process.env.HEADSHOTS_ALERT_BOT_TOKEN;
  const chatId = process.env.HEADSHOTS_ALERT_CHAT_ID;
  // No-op without config — keeps local/dev/test flows clean and silent.
  if (!token || !chatId) return;

  // Launch async send without blocking the caller. Any rejection is contained.
  void (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      });
    } catch (e) {
      console.error("notifyOperator failed:", e);
    } finally {
      clearTimeout(timeout);
    }
  })();
}
