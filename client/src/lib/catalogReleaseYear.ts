/** Converts a curator sleeve release-year field into an allowed album-level value. */
export function albumReleaseYearFromInput(value: FormDataEntryValue | string | number | null | undefined): number | undefined {
  const year = Number(value);
  return Number.isInteger(year) && year >= 1000 && year <= 9999 ? year : undefined;
}
