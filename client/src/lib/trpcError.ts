export function isBenignAbortedRequest(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.name === "AbortError" || /^this operation was aborted$/i.test(error.message.trim());
}
