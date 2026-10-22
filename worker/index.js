import content from "../content.json";

const POSTS = new Set(content.posts.map((p) => p.dir));
const BOTS = /bot|crawl|spider|slurp|preview|fetch|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python|httpclient|headless|lighthouse/i;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/views" || url.pathname.startsWith("/api/views/")) {
      return views(request, env, ctx, url);
    }
    return env.ASSETS.fetch(request);
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function views(request, env, ctx, url) {
  if (request.method === "GET") {
    const ids = (url.searchParams.get("posts") || "").split(",").filter((id) => POSTS.has(id)).slice(0, 100);
    const out = Object.fromEntries(ids.map((id) => [id, 0]));
    if (ids.length) {
      const { results } = await env.DB.prepare(
        `SELECT post, count FROM views WHERE post IN (${ids.map(() => "?").join(",")})`
      ).bind(...ids).all();
      for (const r of results) out[r.post] = r.count;
    }
    return json(out);
  }

  if (request.method === "POST") {
    const id = url.pathname.split("/")[3] || "";
    if (!POSTS.has(id)) return json({ error: "unknown post" }, 404);

    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== url.host) return json({ error: "forbidden" }, 403);

    const ua = request.headers.get("user-agent") || "";
    if (ua && !BOTS.test(ua)) {
      const day = new Date().toISOString().slice(0, 10);
      const ip = request.headers.get("cf-connecting-ip") || "";
      const key = await sha256([day, id, ip, ua, env.VIEWS_SALT || ""].join("|"));
      const seen = await env.DB.prepare("INSERT OR IGNORE INTO seen (key, day) VALUES (?, ?)").bind(key, day).run();
      if (seen.meta.changes) {
        await env.DB.prepare(
          "INSERT INTO views (post, count) VALUES (?, 1) ON CONFLICT(post) DO UPDATE SET count = count + 1"
        ).bind(id).run();
      }
      if (Math.random() < 0.05) {
        ctx.waitUntil(env.DB.prepare("DELETE FROM seen WHERE day < ?").bind(day).run());
      }
    }

    const row = await env.DB.prepare("SELECT count FROM views WHERE post = ?").bind(id).first();
    return json({ post: id, count: row ? row.count : 0 });
  }

  return json({ error: "method not allowed" }, 405);
}
