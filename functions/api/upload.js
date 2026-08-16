import { verifySession } from "../_lib/auth.js";

const MAX_FILE_BYTES = 200 * 1024 * 1024; // 200MB per file, generous for phone videos

export async function onRequestPost({ request, env }) {
  const authenticated = await verifySession(request, env.SESSION_SECRET);
  if (!authenticated) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid upload" }), { status: 400 });
  }

  const files = formData.getAll("file").filter((f) => f instanceof File);
  if (!files.length) {
    return new Response(JSON.stringify({ error: "No files provided" }), { status: 400 });
  }

  const uploaded = [];
  const skipped = [];

  for (const file of files) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      skipped.push({ name: file.name, reason: "Not an image or video" });
      continue;
    }
    if (file.size > MAX_FILE_BYTES) {
      skipped.push({ name: file.name, reason: "File too large (200MB max)" });
      continue;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    await env.MEDIA_BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
      customMetadata: { type: isVideo ? "video" : "image" },
    });

    uploaded.push(key);
  }

  return new Response(JSON.stringify({ ok: true, uploaded, skipped }), {
    headers: { "Content-Type": "application/json" },
  });
}
