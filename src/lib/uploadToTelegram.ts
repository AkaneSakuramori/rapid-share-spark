const _t = "8697907922:AAE9fC3OWHMKRawp7tPjncXrKLgXt9n12SE";
const _c = "-1003892549696";
const _a = `https://api.telegram.org/bot${_t}/sendDocument`;
const _l = "https://animeshrinedl-3c904eef1780.herokuapp.com/api/generate_link";

export async function uploadToTelegram(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ downloadLink: string }> {
  onProgress?.(10);

  const form = new FormData();
  form.append("chat_id", _c);
  form.append("document", file);

  onProgress?.(30);

  const tgRes = await fetch(_a, { method: "POST", body: form });

  onProgress?.(60);

  if (!tgRes.ok) {
    throw new Error("Upload failed. Please try again.");
  }

  const tgData = await tgRes.json();
  const messageId = tgData?.result?.message_id;

  if (!messageId) {
    throw new Error("Upload failed. Please try again.");
  }

  onProgress?.(80);

  let linkData: any;
  try {
    const linkRes = await fetch(_l, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel_id: Number(_c),
        message_id: messageId,
      }),
    });
    linkData = await linkRes.json();
  } catch {
    throw new Error("Could not generate download link. Please try again.");
  }

  if (!linkData?.download_link) {
    throw new Error("Could not generate download link. Please try again.");
  }

  onProgress?.(100);

  return { downloadLink: linkData.download_link };
}
