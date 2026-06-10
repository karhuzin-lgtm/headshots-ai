import { Resend } from "resend";

import type { GenerationRow } from "@/lib/generations-db";

const OWNER_EMAIL = "aleksei@alekseimedia.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Internal alert to the operator when a PAID order fails — so it never goes unnoticed. */
export async function sendOwnerAlert(generation: GenerationRow, errorMessage: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping owner alert.");
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Headshots <noreply@alekseimedia.com>",
    to: OWNER_EMAIL,
    subject: `[ALERT] Сбой оплаченного заказа ${generation.id}`,
    html: `<div style="font-family: monospace; font-size: 14px; line-height: 1.6;">
      <p><b>Заказ:</b> ${escapeHtml(generation.id)}</p>
      <p><b>Тариф:</b> ${escapeHtml(generation.tier)} (${generation.expected_count} фото)</p>
      <p><b>Покупатель:</b> ${escapeHtml(generation.email)}</p>
      <p><b>Оплачено:</b> ${generation.paid ? "да" : "нет"} · <b>payment_id:</b> ${escapeHtml(generation.payment_id ?? "—")}</p>
      <p><b>Ошибка:</b> ${escapeHtml(errorMessage)}</p>
      <p>LavaTop повторит вебхук автоматически. Если заказ застрял в failed — перезапусти вручную.</p>
    </div>`,
  });
}

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://headshots.alekseimedia.com").replace(/\/$/, "");
}

// Брендовая палитра (см. CLAUDE.md): фон cream, акцент gold, тёмный текст.
const COLORS = {
  cream: "#faf8f5",
  card: "#ffffff",
  gold: "#c9a96e",
  goldDark: "#b8965a",
  text: "#111827",
  muted: "#6b7280",
  border: "#ece7df",
};

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

type LayoutOptions = {
  preheader: string;
  heading: string;
  bodyHtml: string;
  ctaText: string;
  ctaUrl: string;
  showLink?: boolean;
};

// Общий брендовый каркас письма. Таблицы + inline-стили — для совместимости
// с почтовыми клиентами; верстка адаптивна на мобильных.
function renderEmail({
  preheader,
  heading,
  bodyHtml,
  ctaText,
  ctaUrl,
  showLink = true,
}: LayoutOptions) {
  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${heading}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: ${COLORS.cream}; -webkit-font-smoothing: antialiased;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.cream};">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; margin: 0 auto;">
            <tr>
              <td style="padding: 0 8px 24px; text-align: center;">
                <span style="font-family: ${FONT_STACK}; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; color: ${COLORS.text};">Headshots</span>
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${COLORS.gold}; margin: 0 0 2px 6px; vertical-align: middle;"></span>
              </td>
            </tr>
            <tr>
              <td style="background-color: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 20px; padding: 40px 36px; box-shadow: 0 8px 30px rgba(17, 24, 39, 0.06);">
                <h1 style="margin: 0 0 20px; font-family: ${FONT_STACK}; font-size: 24px; line-height: 1.3; font-weight: 700; letter-spacing: -0.01em; color: ${COLORS.text};">${heading}</h1>
                ${bodyHtml}
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0 4px;">
                  <tr>
                    <td style="border-radius: 12px; background-color: ${COLORS.gold};">
                      <a href="${ctaUrl}" style="display: inline-block; padding: 15px 28px; font-family: ${FONT_STACK}; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px;">${ctaText}</a>
                    </td>
                  </tr>
                </table>
                ${
                  showLink
                    ? `<p style="margin: 16px 0 0; font-family: ${FONT_STACK}; font-size: 13px; line-height: 1.5; color: ${COLORS.muted};">Если кнопка не открывается, скопируйте ссылку:<br /><a href="${ctaUrl}" style="color: ${COLORS.goldDark}; word-break: break-all;">${ctaUrl}</a></p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 8px 0; text-align: center;">
                <p style="margin: 0; font-family: ${FONT_STACK}; font-size: 12px; line-height: 1.6; color: ${COLORS.muted};">
                  Headshots — студийные AI-портреты по вашим фотографиям.<br />
                  Остались вопросы? Просто ответьте на это письмо — мы поможем.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendHeadshotsReady(
  email: string,
  resultUrl: string,
  imageUrls: string[]
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping headshots-ready email.");
    return;
  }

  const resend = new Resend(apiKey);
  const absoluteResultUrl = resultUrl.startsWith("http") ? resultUrl : `${appUrl()}${resultUrl}`;
  const previewImages = imageUrls.slice(0, 3);

  const previewHtml = previewImages.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0 4px;">
         <tr>
           ${previewImages
             .map(
               (url) =>
                 `<td style="padding: 4px; vertical-align: top;"><img src="${url}" alt="Ваш AI-портрет" width="168" style="display: block; width: 100%; max-width: 168px; height: auto; border-radius: 14px; border: 1px solid ${COLORS.border};" /></td>`
             )
             .join("")}
         </tr>
       </table>`
    : "";

  const bodyHtml = `
    <p style="margin: 0 0 16px; font-family: ${FONT_STACK}; font-size: 16px; line-height: 1.6; color: ${COLORS.text};">
      Готово — ваши портреты ждут вас. Мы обучили персональную модель на ваших фотографиях и собрали галерею студийных снимков в разных образах.
    </p>
    ${previewHtml}
    <p style="margin: 16px 0 0; font-family: ${FONT_STACK}; font-size: 15px; line-height: 1.6; color: ${COLORS.muted};">
      Загляните в галерею, выберите любимые кадры и скачивайте в полном разрешении — они отлично смотрятся в профиле, резюме и на визитке.
    </p>
  `;

  await resend.emails.send({
    from: "Headshots <noreply@alekseimedia.com>",
    to: email,
    subject: "Ваши портреты готовы",
    html: renderEmail({
      preheader: "Галерея студийных AI-портретов готова — посмотрите и скачайте любимые кадры.",
      heading: "Ваши портреты готовы",
      bodyHtml,
      ctaText: "Посмотреть и скачать",
      ctaUrl: absoluteResultUrl,
    }),
  });
}

export async function sendGenerationFailed(email: string, resultUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping generation-failed email.");
    return;
  }

  const resend = new Resend(apiKey);
  const absoluteResultUrl = resultUrl.startsWith("http") ? resultUrl : `${appUrl()}${resultUrl}`;

  const bodyHtml = `
    <p style="margin: 0 0 16px; font-family: ${FONT_STACK}; font-size: 16px; line-height: 1.6; color: ${COLORS.text};">
      При создании ваших портретов произошёл сбой. Так бывает редко, и мы уже об этом знаем — приносим извинения за задержку.
    </p>
    <p style="margin: 0 0 16px; font-family: ${FONT_STACK}; font-size: 16px; line-height: 1.6; color: ${COLORS.text};">
      Мы перезапустим генерацию <strong>без повторной оплаты</strong>. Обычно это занимает ещё немного времени, и готовые портреты придут к вам на почту.
    </p>
    <p style="margin: 0; font-family: ${FONT_STACK}; font-size: 15px; line-height: 1.6; color: ${COLORS.muted};">
      Если результата всё равно не будет — просто ответьте на это письмо, и мы разберёмся вручную. Ваши снимки точно будут.
    </p>
  `;

  await resend.emails.send({
    from: "Headshots <noreply@alekseimedia.com>",
    to: email,
    subject: "Мы перезапускаем создание ваших портретов",
    html: renderEmail({
      preheader: "Произошёл сбой — мы перезапускаем генерацию без повторной оплаты.",
      heading: "Мы уже разбираемся",
      bodyHtml,
      ctaText: "Открыть статус заказа",
      ctaUrl: absoluteResultUrl,
      showLink: false,
    }),
  });
}

export async function sendHeadshotsStarted(email: string, resultUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping headshots-started email.");
    return;
  }

  const resend = new Resend(apiKey);
  const absoluteResultUrl = resultUrl.startsWith("http") ? resultUrl : `${appUrl()}${resultUrl}`;

  const bodyHtml = `
    <p style="margin: 0 0 16px; font-family: ${FONT_STACK}; font-size: 16px; line-height: 1.6; color: ${COLORS.text};">
      Спасибо! Мы получили ваши фотографии и уже обучаем персональную AI-модель — она запоминает ваши черты, чтобы портреты получились похожими и естественными.
    </p>
    <p style="margin: 0 0 16px; font-family: ${FONT_STACK}; font-size: 16px; line-height: 1.6; color: ${COLORS.text};">
      Обычно это занимает около <strong>20 минут</strong>. Как только галерея будет готова, мы пришлём письмо со ссылкой — можно спокойно закрыть вкладку и заняться своими делами.
    </p>
    <p style="margin: 0; font-family: ${FONT_STACK}; font-size: 15px; line-height: 1.6; color: ${COLORS.muted};">
      Хотите следить за процессом? Откройте страницу статуса по кнопке ниже.
    </p>
  `;

  await resend.emails.send({
    from: "Headshots <noreply@alekseimedia.com>",
    to: email,
    subject: "Создаём ваши портреты",
    html: renderEmail({
      preheader: "Мы получили фотографии и начали обучение модели — портреты будут готовы примерно через 20 минут.",
      heading: "Создаём ваши портреты",
      bodyHtml,
      ctaText: "Посмотреть статус",
      ctaUrl: absoluteResultUrl,
    }),
  });
}
