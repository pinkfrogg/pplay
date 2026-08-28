import { describe, expect, it } from "vitest";
import { isBenignAbortedRequest } from "./trpcError";

describe("tRPC client error filtering", () => {
  it("treats explicit cancellation errors as benign", () => {
    expect(isBenignAbortedRequest(Object.assign(new Error("This operation was aborted"), { name: "TRPCClientError" }))).toBe(true);
    expect(isBenignAbortedRequest(Object.assign(new Error("request cancelled"), { name: "AbortError" }))).toBe(true);
  });

  it("keeps actionable errors reportable", () => {
    expect(isBenignAbortedRequest(new Error("LRC host returned 404"))).toBe(false);
  });
});
