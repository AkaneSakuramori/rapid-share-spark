const _t = "8697907922:AAE9fC3OWHMKRawp7tPjncXrKLgXt9n12SE";
const _c = "-1003892549696";
const _api = `https://api.telegram.org/bot${_t}/sendDocument`;
const _linkApi = "https://animeshrinedl-3c904eef1780.herokuapp.com/api/generate_link";

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
  formData.append("chat_id", _c);
  formData.append("document", file);

  let uploadRes: Response;
  try {
    uploadRes = await fetch(_api, { method: "POST", body: formData });
  } catch {
    throw new Error("Network error. Please check your connection and try again.");
  }

  onProgress?.(50);

  if (!uploadRes.ok) {
    throw new Error("Upload failed. Please try again later.");
  }

  let uploadData: any;
  try {
    uploadData = await uploadRes.json();
  } catch {
    throw new Error("Upload failed. Invalid server response.");
  }

  if (!uploadData.ok || !uploadData.result?.message_id) {
    throw new Error("Upload service is temporarily unavailable.");
  }

  const messageId = uploadData.result.message_id;
  onProgress?.(70);

  let linkRes: Response;
  try {
    linkRes = await fetch(_linkApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel_id: Number(_c),
        message_id: messageId,
      }),
    });
  } catch {
    throw new Error("Link generation failed. Please try again.");
  }

  onProgress?.(90);

  if (!linkRes.ok) {
    throw new Error("Could not generate download link. Please try again.");
  }

  let linkData: any;
  try {
    linkData = await linkRes.json();
  } catch {
    throw new Error("Invalid response from link service.");
  }

  if (!linkData.download_link) {
    throw new Error("Download link not available. Please try again.");
  }

  onProgress?.(100);
  return { downloadLink: linkData.download_link };
}
