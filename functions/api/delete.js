import { verifySession } from "../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  const authenticated = await verifySession(request, env.SESSION_SECRET);
  if (!authenticated) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }

  const { key } = body || {};

  // Only allow deleting things inside the projects/ prefix - never anything else in the bucket.
  if (typeof key !== "string" || !key.startsWith("projects/")) {
    return new Response(JSON.stringify({ error: "Invalid key" }), { status: 400 });
  }

  await env.MEDIA_BUCKET.delete(key);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
