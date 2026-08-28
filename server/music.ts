export const MAX_AUDIO_UPLOAD_BYTES = 18 * 1024 * 1024;

export function isSupportedMp3(fileName: string, mimeType: string) {
  return fileName.toLowerCase().endsWith(".mp3") && (mimeType === "audio/mpeg" || mimeType === "audio/mp3" || mimeType === "application/octet-stream");
}

export function makeAudioStorageName(fileName: string) {
  const basename = fileName.replace(/\.mp3$/i, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "track";
  return `${basename}.mp3`;
}
