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
    '<meta property="og:image" content="' + SITE + "/assets/images/og/" + p.dir + '.png" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="' + esc(p.title) + '" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:title" content="' + esc(p.title) + '" />',
    '<meta name="twitter:description" content="' + esc(desc) + '" />',
    '<meta name="twitter:image" content="' + SITE + "/assets/images/og/" + p.dir + '.png" />',
    ldScript({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.title,
      description: desc,
      datePublished: p.date,
      url: postUrl(p),
      image: SITE + "/assets/images/og/" + p.dir + ".png",
      keywords: p.tags,
      author: PERSON,
      isPartOf: { "@id": SITE + "/blogs/#blog" },
    }),
  ].join("\n");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function lsRow(p) {
  const [, m, d] = p.date.split("-").map(Number);
  return [
    '<a href="' + p.dir + '/" class="ls-row" title="' + esc(p.desc) + '">',
    '  <span class="ls-main">',
    '    <span class="ls-title">' + esc(p.title) + "</span>",
    '    <span class="ls-meta">' + p.read + " min read</span>",
    "  </span>",
    '  <time class="ls-date" datetime="' + p.date + '">' + MONTHS[m - 1] + " " + d + "</time>",
    "</a>",
  ].join("\n");
}

function lsYears(list) {
  const years = [];
  for (const p of list) {
    const y = p.date.slice(0, 4);
    if (!years.length || years[years.length - 1].year !== y) years.push({ year: y, posts: [] });
    years[years.length - 1].posts.push(p);
  }
  return years
    .map((g) =>
      [
        '<section class="ls-year" aria-labelledby="y' + g.year + '">',
        '  <h2 class="ls-year-label" id="y' + g.year + '">' + g.year + "</h2>",
        '  <div class="ls-year-posts">',
        g.posts.map((p) => lsRow(p).replace(/^/gm, "    ")).join("\n"),
        "  </div>",
        "</section>",
      ].join("\n")
    )
    .join("\n\n");
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
fill("blogs/index.html", "ls", ['<div class="ls-total">total ' + posts.length + "</div>", lsYears(posts)].join("\n\n"));

fill("index.html", "projects", rows(content.projects));
fill("index.html", "skills", rows(content.skills));
fill(
  "index.html",
  "socials",
  content.socials
    .map(
      (s) =>
        '<a class="icon" href="' + esc(s.href) + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + s.icon + '"/></svg></a>'
    )
    .join("\n")
);

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
