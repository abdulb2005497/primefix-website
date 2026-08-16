// Serves the actual file bytes from R2 for any /media/<key> request.

export async function onRequestGet({ params, env }) {
  const key = Array.isArray(params.path) ? params.path.join("/") : params.path;
  if (!key) return new Response("Not found", { status: 404 });

  const object = await env.MEDIA_BUCKET.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);

  const lowerKey = (key || "").toLowerCase();
  const hasVideoExtension = /\.(mp4|mov|webm|m4v|avi|mkv|wmv|flv)$/i.test(lowerKey);
  if (!headers.get("content-type") && hasVideoExtension) {
    headers.set("content-type", "video/mp4");
  }

  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
}
