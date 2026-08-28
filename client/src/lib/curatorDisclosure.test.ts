import { describe, expect, it } from "vitest";
import { nextCuratorSleeveId, visibleCuratorSleeves } from "./curatorDisclosure";

const sleeves = [
  { id: 1, title: "Barbie in the Nutcracker", tracks: [{ title: "Overture", albumArtists: "Arnie Roth" }] },
  { id: 2, title: "Barbie of Swan Lake", tracks: [{ title: "Waltz of the Swans", albumArtists: "Arnie Roth" }] },
];

describe("compact curator sleeve disclosures", () => {
  it("starts collapsed and keeps only one selected sleeve open at a time", () => {
    expect(nextCuratorSleeveId(null, 1)).toBe(1);
    expect(nextCuratorSleeveId(1, 2)).toBe(2);
    expect(nextCuratorSleeveId(2, 2)).toBeNull();
  });

  it("keeps matching sleeve titles available for track-text searches", () => {
    expect(visibleCuratorSleeves(sleeves, "swans", "all").map(sleeve => sleeve.id)).toEqual([2]);
  });

  it("applies the explicit sleeve filter independently of the search text", () => {
    expect(visibleCuratorSleeves(sleeves, "", "1").map(sleeve => sleeve.id)).toEqual([1]);
  });
});
