export function marqueeScrollDistance(contentWidth: number, viewportWidth: number): number {
  return Math.max(0, Math.ceil(contentWidth - viewportWidth));
}
