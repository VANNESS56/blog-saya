import crypto from "crypto";
import { supabaseAdmin } from "./supabaseAdmin";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Rate limiting (in-memory)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now > attempt.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (attempt.count >= MAX_ATTEMPTS) return false;
  attempt.count++;
  return true;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPasswordHash(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, key] = storedHash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("key, value")
    .in("key", ["admin_username", "admin_password_hash"]);

  if (error || !data) return false;

  const userSetting = data.find((d) => d.key === "admin_username");
  const passSetting = data.find((d) => d.key === "admin_password_hash");

  if (!userSetting || !passSetting) return false;

  // Verify username (timing safe not strictly required for username but good practice)
  const expectedUser = userSetting.value;
  if (expectedUser !== username) return false;

  return verifyPasswordHash(password, passSetting.value);
}

export function createSessionToken(): string {
  const payload = `admin:${Date.now()}:${crypto.randomBytes(16).toString("hex")}`;
  const hmac = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${hmac}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const dotIndex = token.indexOf(".");
    if (dotIndex === -1) return false;

    const payloadB64 = token.substring(0, dotIndex);
    const hmac = token.substring(dotIndex + 1);
    if (!payloadB64 || !hmac || hmac.length !== 64) return false;

    const payload = Buffer.from(payloadB64, "base64url").toString();
    const expected = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payload)
      .digest("hex");

    const signatureValid = crypto.timingSafeEqual(
      Buffer.from(hmac, "hex"),
      Buffer.from(expected, "hex")
    );

    if (!signatureValid) return false;

    const parts = payload.split(":");
    if (parts.length < 3) return false;
    const timestamp = parseInt(parts[1], 10);
    if (isNaN(timestamp)) return false;

    const age = Date.now() - timestamp;
    if (age > SESSION_MAX_AGE_MS || age < 0) {
      return false; // Token expired
    }

    // Now verify against the database
    const { data: session, error } = await supabaseAdmin
      .from("admin_sessions")
      .select("id")
      .eq("token_hash", hmac)
      .single();

    if (error || !session) return false; // Not found or revoked

    return true;
  } catch {
    return false;
  }
}
