import { Resend } from "resend";

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://headshots.alekseimedia.com").replace(/\/$/, "");
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

  await resend.emails.send({
    from: "Headshots <noreply@alekseimedia.com>",
    to: email,
    subject: "🎉 Ваши хедшоты готовы!",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <h1>Ваши AI-хедшоты готовы к скачиванию.</h1>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px;">
          ${previewImages
            .map(
              (url) =>
                `<img src="${url}" alt="Сгенерированный хедшот" style="width: 180px; max-width: 100%; border-radius: 16px;" />`
            )
            .join("")}
        </div>
        <p style="margin-top: 28px;">
          <a href="${absoluteResultUrl}" style="display: inline-block; background: #111; color: #fff; padding: 14px 22px; border-radius: 12px; text-decoration: none; font-weight: 700;">
            Посмотреть и скачать хедшоты
          </a>
        </p>
        <p><a href="${absoluteResultUrl}">${absoluteResultUrl}</a></p>
      </div>
    `,
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

  await resend.emails.send({
    from: "Headshots <noreply@alekseimedia.com>",
    to: email,
    subject: "✨ Создаём ваши AI-хедшоты",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <h1>Создаём ваши AI-хедшоты</h1>
        <p>Мы получили ваши фотографии и начали обучение персональной AI-модели.</p>
        <p>Хедшоты будут готовы примерно через 20 минут.</p>
        <p>Мы пришлём письмо, как только всё будет готово — можно закрыть эту вкладку.</p>
        <p style="margin-top: 28px;">
          <a href="${absoluteResultUrl}" style="display: inline-block; background: #111; color: #fff; padding: 14px 22px; border-radius: 12px; text-decoration: none; font-weight: 700;">
            Посмотреть статус генерации
          </a>
        </p>
        <p><a href="${absoluteResultUrl}">${absoluteResultUrl}</a></p>
      </div>
    `,
  });
}
