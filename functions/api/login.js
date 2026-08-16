import { createSessionCookie } from "../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }

  const { username: rawUsername, password: rawPassword } = body || {};
  const username = typeof rawUsername === 'string' ? rawUsername.trim() : rawUsername;
  const password = typeof rawPassword === 'string' ? rawPassword.trim() : rawPassword;

  const adminUser = typeof env.ADMIN_USERNAME === 'string' ? env.ADMIN_USERNAME.trim() : env.ADMIN_USERNAME;
  const adminPass = typeof env.ADMIN_PASSWORD === 'string' ? env.ADMIN_PASSWORD.trim() : env.ADMIN_PASSWORD;

  if (
    typeof username === "string" &&
    typeof password === "string" &&
    username === adminUser &&
    password === adminPass
  ) {
    const cookie = await createSessionCookie(env.SESSION_SECRET);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
    });
  }

  return new Response(JSON.stringify({ error: "Invalid username or password" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
