import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const server = readFileSync(new URL("../../../server/_core/index.ts", import.meta.url), "utf8");
const robots = readFileSync(new URL("../../public/robots.txt", import.meta.url), "utf8");

describe("search visibility and crawler controls", () => {
  it("marks the document as non-indexable for general crawlers and Googlebot", () => {
    expect(html).toContain('name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex"');
    expect(html).toContain('name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex"');
  });

  it("denies all compliant robots.txt crawlers", () => {
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Disallow: /");
  });

  it("adds HTTP noindex and blocks common crawler user agents without blocking app APIs", () => {
    expect(server).toContain('res.setHeader("X-Robots-Tag", NO_INDEX_ROBOTS)');
    expect(server).toContain("CRAWLER_USER_AGENT.test(req.get(\"user-agent\") ?? \"\")");
    expect(server).toContain('req.path.startsWith("/api/")');
    expect(server).toContain('res.status(403).type("text/plain")');
  });

  it("retains a bounded request rate limit for public and API traffic", () => {
    expect(server).toContain("RATE_LIMIT_WINDOW_MS = 60_000");
    expect(server).toContain("RATE_LIMIT_MAX_REQUESTS = 120");
    expect(server).toContain('res.status(429).type("text/plain")');
    expect(server).toContain('res.setHeader("Retry-After"');
  });
});
