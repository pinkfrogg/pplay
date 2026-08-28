import { describe, expect, it } from "vitest";
import { searchSuggestionReserveHeight } from "./searchLayout";

describe("listener search reflow", () => {
  it("releases all reserved space when the query is cleared", () => {
    expect(searchSuggestionReserveHeight("", 6)).toBe(0);
    expect(searchSuggestionReserveHeight("   ", 6)).toBe(0);
  });

  it("reserves space for visible results while capping very long suggestion menus", () => {
    expect(searchSuggestionReserveHeight("barbie", 1)).toBe(61);
    expect(searchSuggestionReserveHeight("barbie", 20)).toBe(330);
  });
});
