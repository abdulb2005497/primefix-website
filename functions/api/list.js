// Public: returns every photo/video currently stored in storage order (append-only).
// New uploads are appended to the end so the admin UI can display newest items
// at the bottom. Used by both the live Projects section and the admin dashboard.

function inferMediaType(name, contentType = "") {
  const lowerName = (name || "").toLowerCase();
  const extensionMatch = /\.(mp4|mov|webm|m4v|avi|mkv|wmv|flv|m3u8)$/i.test(lowerName);

  if (contentType.startsWith("video/") || extensionMatch) return "video";
  return "image";
}

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
      const customType = obj.customMetadata?.type;
      const type = customType === "video" || customType === "image"
        ? customType
        : inferMediaType(obj.key, contentType);
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

  // Preserve storage order (do not sort). R2 object listing returns keys
  // in lexicographical order which, with our timestamp-prefixed keys,
  // results in older items first and new uploads appended to the end.

  return new Response(JSON.stringify({ items }), {
    headers: { "Content-Type": "application/json" },
  });
}
