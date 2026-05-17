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
    from: "Headshots <onboarding@resend.dev>",
    to: email,
    subject: "Your headshots are ready!",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <h1>Your headshots are ready!</h1>
        <p>You can view and download your results here:</p>
        <p><a href="${absoluteResultUrl}">${absoluteResultUrl}</a></p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px;">
          ${previewImages
            .map(
              (url) =>
                `<img src="${url}" alt="Generated headshot" style="width: 180px; max-width: 100%; border-radius: 16px;" />`
            )
            .join("")}
        </div>
      </div>
    `,
  });
}
