const BOT_TOKEN = "8697907922:AAE9fC3OWHMKRawp7tPjncXrKLgXt9n12SE";
const CHANNEL_ID = "-1003892549696";

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
const LINK_API =
  "https://animeshrinedl-3c904eef1780.herokuapp.com/api/generate_link";

export interface UploadResult {
  downloadLink: string;
}

export async function uploadToTelegram(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {

  if (file.size > 50 * 1024 * 1024) {
    throw new Error("File size exceeds 50MB limit");
  }

  onProgress?.(10);

  const formData = new FormData();
  formData.append("chat_id", CHANNEL_ID);
  formData.append("document", file);

  let uploadData;

  try {
    const uploadRes = await fetch(TELEGRAM_API, {
      method: "POST",
      body: formData,
    });

    uploadData = await uploadRes.json();

  } catch (err) {
    console.error("Telegram upload network error:", err);
    throw new Error("Network error while uploading to Telegram");
  }

  console.log("Telegram response:", uploadData);

  if (!uploadData.ok) {
    throw new Error(uploadData.description || "Telegram upload failed");
  }

  const messageId = uploadData.result?.message_id;

  if (!messageId) {
    throw new Error("Telegram did not return message_id");
  }

  onProgress?.(60);

  let linkData;

  try {
    const linkRes = await fetch(LINK_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel_id: Number(CHANNEL_ID),
        message_id: messageId,
      }),
    });

    linkData = await linkRes.json();

  } catch (err) {
    console.error("Link API error:", err);
    throw new Error("Failed to generate download link");
  }

  console.log("Link API response:", linkData);

  if (!linkData.download_link) {
    throw new Error("Download link not returned by API");
  }

  onProgress?.(100);

  return {
    downloadLink: linkData.download_link,
  };
}
