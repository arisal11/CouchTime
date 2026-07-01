// Parse a YouTube URL and fetch its title/thumbnail via the public oEmbed
// endpoint (no API key required).

function parseVideoId(input) {
  if (!input) return null;
  const raw = input.toString().trim();

  // Bare 11-char video id.
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    const m = url.pathname.match(/^\/(?:shorts|embed|v)\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }

  return null;
}

async function fetchVideoMeta(input) {
  const videoId = parseVideoId(input);
  if (!videoId) return null;

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  let title = "YouTube video";
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) title = data.title;
    }
  } catch {
    // Fall back to the default title if oEmbed is unreachable.
  }

  return {
    videoId,
    title,
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}

module.exports = { parseVideoId, fetchVideoMeta };
