import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { parse as parseCookie } from "cookie";
import type { Request } from "express";

export const OWNER_ADMIN_COOKIE = "owner_admin_session";
export const OWNER_SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

type OwnerSessionPayload = { email: string; expiresAt: number };

type OwnerConfig = { email: string; password: string };

function ownerConfig(): OwnerConfig {
  return {
    email: (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD ?? "",
  };
}

function secureEquals(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function sessionKey(password: string) {
  return createHash("sha256").update(password).digest();
}

function signature(payload: string, password: string) {
  return createHmac("sha256", sessionKey(password)).update(payload).digest("base64url");
}

export function hasOwnerLoginConfiguration() {
  const { email, password } = ownerConfig();
  return Boolean(email && password);
}

export function verifyOwnerCredentials(email: string, password: string) {
  const config = ownerConfig();
  if (!hasOwnerLoginConfiguration()) return false;
  return secureEquals(email.trim().toLowerCase(), config.email) && secureEquals(password, config.password);
}

export function createOwnerSession(email: string, now = Date.now()) {
  const { password } = ownerConfig();
  if (!hasOwnerLoginConfiguration()) throw new Error("Owner admin login is not configured.");
  const payload: OwnerSessionPayload = { email: email.trim().toLowerCase(), expiresAt: now + OWNER_SESSION_MAX_AGE_MS };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${signature(encodedPayload, password)}`;
}

export function hasOwnerSession(req: Pick<Request, "headers">, now = Date.now()) {
  const { email, password } = ownerConfig();
  if (!hasOwnerLoginConfiguration()) return false;
  const cookies = parseCookie(req.headers.cookie ?? "");
  const token = cookies[OWNER_ADMIN_COOKIE];
  if (!token) return false;
  const separator = token.lastIndexOf(".");
  if (separator < 1) return false;
  const encodedPayload = token.slice(0, separator);
  const receivedSignature = token.slice(separator + 1);
  if (!secureEquals(receivedSignature, signature(encodedPayload, password))) return false;
  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as OwnerSessionPayload;
    return payload.expiresAt > now && secureEquals(payload.email, email);
  } catch {
    return false;
  }
}
