// Public: returns every photo/video currently stored, newest first.
// Used both by the live Projects section and by the admin dashboard.

export async function onRequestGet({ env }) {
  const items = [];
  let cursor;

  do {
    const listed = await env.MEDIA_BUCKET.list({
      prefix: "projects/",
      cursor,
    });

    for (const obj of listed.objects) {
      const contentType = obj.httpMetadata?.contentType || "";
      const type = contentType.startsWith("video") ? "video" : "image";
      const encodedKey = obj.key.split("/").map(encodeURIComponent).join("/");
      items.push({
        key: obj.key,
        url: `/media/${encodedKey}`,
        type,
        uploaded: obj.uploaded,
      });
    }

    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  items.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));

  return new Response(JSON.stringify({ items }), {
    headers: { "Content-Type": "application/json" },
  });
}
