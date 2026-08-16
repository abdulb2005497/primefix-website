// Shared helper: signs and verifies the admin session cookie using HMAC-SHA256.
// Nothing here is a route itself (folder starts with "_"), just shared logic.

const encoder = new TextEncoder();

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const SESSION_LIFETIME_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function createSessionCookie(secret) {
  const expiry = Date.now() + SESSION_LIFETIME_MS;
  const payload = `admin.${expiry}`;
  const sig = await hmac(secret, payload);
  const value = `${payload}.${sig}`;
  return `session=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_LIFETIME_MS / 1000}`;
}

export function clearSessionCookie() {
  return `session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export async function verifySession(request, secret) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  if (!match) return false;

  const value = decodeURIComponent(match[1]);
  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const [role, expiry, sig] = parts;
  const payload = `${role}.${expiry}`;
  const expectedSig = await hmac(secret, payload);

  if (sig !== expectedSig) return false;
  if (Date.now() > Number(expiry)) return false;
  return true;
}
