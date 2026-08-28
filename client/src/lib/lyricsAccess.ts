export type LyricTrackAccess = {
  storageId?: number;
  kind: "upload" | "link";
};

export function lyricGenerationAccess(isAuthenticated: boolean, track?: LyricTrackAccess) {
  if (!isAuthenticated) return "login" as const;
  if (!track?.storageId || track.kind !== "upload") return "unavailable" as const;
  return "ready" as const;
}
