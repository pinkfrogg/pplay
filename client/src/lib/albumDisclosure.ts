/**
 * Returns the one expanded album ID, or collapses the active sleeve when it is selected again.
 */
export function nextExpandedAlbumId(currentAlbumId: number | null, requestedAlbumId: number): number | null {
  return currentAlbumId === requestedAlbumId ? null : requestedAlbumId;
}
