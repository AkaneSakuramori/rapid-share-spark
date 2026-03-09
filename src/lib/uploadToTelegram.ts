const BOT_TOKEN = "8697907922:AAE9fC3OWHMKRawp7tPjncXrKLgXt9n12SE";
const CHANNEL_ID = "-1003892549696";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
const GENERATE_LINK_API = "https://animeshrinedl-3c904eef1780.herokuapp.com/api/generate_link";

export interface UploadResult {
  downloadLink: string;
}

export async function uploadToTelegram(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  if (file.size > 3 * 1024 * 1024) {
    throw new Error("File size exceeds 3MB limit");
  }

  // Upload to Telegram
  onProgress?.(10);
  const formData = new FormData();
  formData.append("chat_id", CHANNEL_ID);
  formData.append("document", file);

  const telegramRes = await fetch(TELEGRAM_API, {
    method: "POST",
    body: formData,
  });

  onProgress?.(50);

  if (!telegramRes.ok) {
    const err = await telegramRes.text();
    throw new Error(`Telegram upload failed: ${err}`);
  }

  const telegramData = await telegramRes.json();
  if (!telegramData.ok || !telegramData.result?.message_id) {
    throw new Error("Invalid Telegram response");
  }

  const messageId = telegramData.result.message_id;
  onProgress?.(70);

  // Generate download link
  const linkRes = await fetch(GENERATE_LINK_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      channel_id: Number(CHANNEL_ID),
      message_id: messageId,
    }),
  });

  onProgress?.(90);

  if (!linkRes.ok) {
    const err = await linkRes.text();
    throw new Error(`Link generation failed: ${err}`);
  }

  const linkData = await linkRes.json();
  if (!linkData.download_link) {
    throw new Error("No download link in response");
  }

  onProgress?.(100);
  return { downloadLink: linkData.download_link };
}
