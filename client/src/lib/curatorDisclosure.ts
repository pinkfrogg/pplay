export type CuratorSleeveSearch = {
  id: number;
  title: string;
  tracks: Array<{ title: string; albumArtists?: string | null }>;
};

/** Keeps only the sleeve titles relevant to the desk's current search and filter controls. */
export function visibleCuratorSleeves<T extends CuratorSleeveSearch>(albums: T[], query: string, albumFilter: string): T[] {
  const needle = query.trim().toLowerCase();
  return albums.filter(album => {
    if (albumFilter !== "all" && album.id !== Number(albumFilter)) return false;
    const searchable = `${album.title} ${album.tracks.map(track => `${track.title} ${track.albumArtists ?? ""}`).join(" ")}`.toLowerCase();
    return !needle || searchable.includes(needle);
  });
}

/** Opens one sleeve at a time, and closes the active sleeve when it is selected again. */
export function nextCuratorSleeveId(currentAlbumId: number | null, requestedAlbumId: number): number | null {
  return currentAlbumId === requestedAlbumId ? null : requestedAlbumId;
}
