import { createSessionCookie } from "../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }

  const { username, password } = body || {};

  if (
    typeof username === "string" &&
    typeof password === "string" &&
    username === env.ADMIN_USERNAME &&
    password === env.ADMIN_PASSWORD
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
