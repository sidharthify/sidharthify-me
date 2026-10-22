import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets/images/og");
const BROWSER = process.env.CHROMIUM || "chromium";
const only = process.argv.slice(2);

const content = JSON.parse(readFileSync(join(ROOT, "content.json"), "utf8"));
const wallpaper = pathToFileURL(join(ROOT, "assets/images/cat-vibin.png")).href;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function page({ path, cwd, cmd, title, sub, meta, tags }) {
  const size = title.length > 60 ? 54 : title.length > 40 ? 62 : 72;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&family=JetBrains+Mono:wght@500;700;800&display=block">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:#11111b url("${wallpaper}") center/cover;font-family:'JetBrains Mono',monospace;color:#cdd6f4;display:flex;align-items:center;justify-content:center}
body::before{content:"";position:fixed;inset:0;background:linear-gradient(rgba(17,17,27,.78),rgba(17,17,27,.9))}
.win{position:relative;width:1080px;height:520px;background:rgba(30,30,46,.95);border:2px solid rgba(205,214,244,.14);border-radius:22px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.8);display:flex;flex-direction:column}
.bar{position:relative;display:flex;align-items:center;gap:14px;padding:20px 28px;background:#181825;border-bottom:2px solid #313244}
.bar i{width:18px;height:18px;border-radius:50%;display:block}
.bar span{position:absolute;left:0;right:0;text-align:center;color:#6c7086;font-size:20px;pointer-events:none}
.bar em{margin-left:auto;font-style:normal;color:#cba6f7;font-weight:700;font-size:20px}
.bar b{color:#bac2de;font-weight:500}
.body{flex:1;padding:40px 52px 36px;display:flex;flex-direction:column}
.prompt{font-size:24px;font-weight:700}
.prompt .l{color:#a6e3a1}.prompt .p{color:#89b4fa}.prompt .s{color:#cba6f7}.prompt .c{color:#cdd6f4;font-weight:500}.prompt .a{color:#89dceb;font-weight:500}
h1{margin-top:34px;font-size:${size}px;line-height:1.15;font-weight:800;color:#b4befe;letter-spacing:-1px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.sub{margin-top:18px;font:500 28px/1.4 Inter,sans-serif;color:#bac2de;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.foot{margin-top:auto;display:flex;align-items:center;gap:22px;font-size:22px;color:#6c7086;white-space:nowrap}
.tags{display:flex;gap:10px}
.tags span{color:#cba6f7;background:rgba(203,166,247,.1);border:2px solid rgba(203,166,247,.2);border-radius:999px;padding:4px 16px;font:600 19px Inter,sans-serif}
</style></head><body><div class="win">
<div class="bar"><i style="background:#f38ba8"></i><i style="background:#f9e2af"></i><i style="background:#a6e3a1"></i><span><b>sidharthify@nixos</b>: ${esc(path)}</span><em>sidharthify.tech</em></div>
<div class="body">
<div class="prompt"><span class="l">sidharthify@nixos</span> <span class="p">${esc(cwd || path)}</span> <span class="s">$</span> <span class="c">${cmd}</span></div>
<h1>${esc(title)}</h1>
${sub ? `<div class="sub">${esc(sub)}</div>` : ""}
<div class="foot">${meta ? `<span>${esc(meta)}</span>` : ""}${tags && tags.length ? `<div class="tags">${tags.slice(0, 4).map((t) => `<span>#${esc(t)}</span>`).join("")}</div>` : ""}</div>
</div></div></body></html>`;
}

function fmtDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

const cards = [
  {
    name: "default",
    path: "~",
    cmd: "whoami",
    title: "sidharth",
    sub: "full-stack systems & android developer. AOSP, linux kernels, native apps and the breatheOSS air quality network.",
    meta: "",
    tags: ["AOSP", "Kernel", "NixOS", "breatheOSS"],
  },
  ...content.posts.map((p) => ({
    name: p.dir,
    path: "~/blog/" + p.slug,
    cwd: "~/blog",
    cmd: `nvim <span class="a">${esc(p.slug)}.md</span>`,
    title: p.title,
    sub: "",
    meta: `${fmtDate(p.date)} · ${p.read} min read`,
    tags: p.tags,
  })),
];

mkdirSync(OUT, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "og-"));
try {
  for (const c of cards) {
    if (only.length && !only.includes(c.name)) continue;
    const html = join(tmp, c.name + ".html");
    writeFileSync(html, page(c));
    const png = join(OUT, c.name + ".png");
    execFileSync(BROWSER, [
      "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1",
      "--window-size=1200,630", "--virtual-time-budget=8000", "--allow-file-access-from-files",
      `--screenshot=${png}`, pathToFileURL(html).href,
    ], { stdio: "ignore" });
    console.log("og " + c.name);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
