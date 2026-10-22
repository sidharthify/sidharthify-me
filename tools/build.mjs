import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://sidharthify.tech";
const PERSON = { "@id": SITE + "/#person" };

const read = (p) => readFileSync(join(ROOT, p), "utf8");
const write = (p, s) => writeFileSync(join(ROOT, p), s);

const content = JSON.parse(read("content.json"));
const posts = [...content.posts].sort((a, b) => b.date.localeCompare(a.date));

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const postUrl = (p) => SITE + "/blogs/" + p.dir + "/";

function fill(file, name, body) {
  const src = read(file);
  const re = new RegExp("([ \\t]*)<!-- gen:" + name + " -->[\\s\\S]*?<!-- /gen:" + name + " -->");
  const m = src.match(re);
  if (!m) throw new Error(file + ": missing gen:" + name + " markers");
  const ind = m[1];
  const lines = body.split("\n").map((l) => (l ? ind + l : l));
  const out = src.replace(re, () => [ind + "<!-- gen:" + name + " -->", ...lines, ind + "<!-- /gen:" + name + " -->"].join("\n"));
  if (out !== src) write(file, out);
}

function ldScript(obj) {
  return '<script type="application/ld+json">\n' + JSON.stringify(obj, null, 2) + "\n</script>";
}

function postMeta(p) {
  const desc = p.summary || p.desc;
  return [
    "<title>" + esc(p.title) + " • sidharthify</title>",
    '<meta name="description" content="' + esc(desc) + '" />',
    '<link rel="canonical" href="' + postUrl(p) + '" />',
    '<meta property="og:type" content="article" />',
    '<meta property="og:title" content="' + esc(p.title) + '" />',
    '<meta property="og:description" content="' + esc(desc) + '" />',
    '<meta property="og:url" content="' + postUrl(p) + '" />',
    '<meta property="og:site_name" content="sidharthify" />',
    '<meta property="article:published_time" content="' + p.date + '" />',
    '<meta name="twitter:card" content="summary" />',
    '<meta name="twitter:title" content="' + esc(p.title) + '" />',
    '<meta name="twitter:description" content="' + esc(desc) + '" />',
    ldScript({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.title,
      description: desc,
      datePublished: p.date,
      url: postUrl(p),
      keywords: p.tags,
      author: PERSON,
      isPartOf: { "@id": SITE + "/blogs/#blog" },
    }),
  ].join("\n");
}

function lsRow(p) {
  return [
    '<a href="' + p.dir + '/" class="ls-row">',
    '  <span class="ls-perms">drwxr-xr-x</span>',
    '  <span class="ls-size">' + esc(p.size) + "</span>",
    '  <span class="ls-date">' + p.date + "</span>",
    '  <span class="ls-name">',
    '    <span class="ls-dir">' + esc(p.slug) + "</span>",
    '    <span class="ls-title">' + esc(p.title) + "</span>",
    '    <span class="ls-desc">' + esc(p.desc) + "</span>",
    '    <span class="ls-tags">' + p.tags.map((t) => '<span class="t">#' + esc(t) + "</span>").join(" ") + "</span>",
    "  </span>",
    '  <span class="ls-meta">' + p.read + " min read</span>",
    "</a>",
  ].join("\n");
}

function rows(items) {
  return items
    .map(
      (x) =>
        '<li class="row"><span class="dot" aria-hidden="true"></span><div><div class="row-title">' +
        esc(x.title) + '</div><div class="row-sub">' + esc(x.desc) + "</div></div></li>"
    )
    .join("\n");
}

for (const p of posts) fill("blogs/" + p.dir + "/index.html", "meta", postMeta(p));

fill(
  "blogs/index.html",
  "ld",
  ldScript({
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": SITE + "/blogs/#blog",
    url: SITE + "/blogs/",
    name: "sidharthify's blog",
    author: PERSON,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.date,
      url: postUrl(p),
      author: PERSON,
    })),
  })
);
fill("blogs/index.html", "ls", ['<div class="ls-total">total ' + posts.length + "</div>", ...posts.map(lsRow)].join("\n\n"));

fill("index.html", "projects", rows(content.projects));
fill("index.html", "skills", rows(content.skills));

write(
  "sitemap.xml",
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    "  <url><loc>" + SITE + "/</loc></url>",
    "  <url><loc>" + SITE + "/about/</loc></url>",
    "  <url><loc>" + SITE + "/blogs/</loc><lastmod>" + posts[0].date + "</lastmod></url>",
    ...posts.map((p) => "  <url><loc>" + postUrl(p) + "</loc><lastmod>" + p.date + "</lastmod></url>"),
    "</urlset>",
    "",
  ].join("\n")
);

const llms = read("llms.txt");
const section = ["## Blog posts", "", ...posts.map((p) => "- [" + p.title + "](" + postUrl(p) + ") (" + p.date + "): " + (p.summary || p.desc)), "", ""].join("\n");
write("llms.txt", llms.replace(/## Blog posts\n[\s\S]*?(?=## )/, section));

write(
  "assets/js/content.js",
  "window.SITE = " +
    JSON.stringify({
      posts: posts.map((p) => ({ slug: p.slug, dir: p.dir, title: p.title, date: p.date })),
      projects: content.projects.map((x) => [x.title, x.desc]),
      skills: content.skills.map((x) => [x.title, x.desc]),
      socials: content.socials.map((x) => [x.label, x.href, x.icon]),
    }) +
    ";\n"
);

console.log("built " + posts.length + " posts");
