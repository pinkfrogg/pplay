/** Matches the rail dropdown height closely enough for the adjacent stage to reflow in sync. */
export function searchSuggestionReserveHeight(query: string, suggestionCount: number) {
  if (!query.trim()) return 0;
  return Math.min(330, Math.max(52, suggestionCount * 55 + 6));
}
