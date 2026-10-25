// Разбирает исходный go-v-primerah.html в content/examples.json.
// Запуск: node scripts/extract.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const html = readFileSync(new URL("../go-v-primerah.html", import.meta.url), "utf8");

// Английские названия берём из оглавления
const en = {};
for (const m of html.matchAll(/<a href="#([^"]+)"><span class="n">\d+<\/span><span class="t">[^<]*<\/span><span class="en">([^<]*)<\/span><\/a>/g)) {
  en[m[1]] = decode(m[2]);
}

const examples = [];
const re = /<article class="ex" id="([^"]+)">\s*<div class="group-label">([^<]*)<\/div>\s*<h1>([^<]*)<\/h1>\s*<div class="sub">([^<]*)<\/div>([\s\S]*?)<nav class="pager">[\s\S]*?<\/article>/g;
for (const m of html.matchAll(re)) {
  const [, slug, group, title, sub, body] = m;
  const src = body.match(/<div class="block src">[\s\S]*?<\/div><\/div><\/div>(?=\s*<div class="block">|\s*$)/);
  if (!src) throw new Error("нет блока с исходником: " + slug);
  examples.push({
    slug,
    group: decode(group),
    title: decode(title),
    en: en[slug] ?? decode(title),
    file: decode(sub).split(" · ")[0],
    srcHtml: src[0],
    restHtml: body.slice(src.index + src[0].length).trim(),
    code: [...src[0].matchAll(/<pre>([\s\S]*?)<\/pre>/g)]
      .map((p) => decode(p[1].replace(/<[^>]+>/g, "")))
      .filter(Boolean)
      .join("\n"),
  });
}
if (examples.length !== 85) throw new Error("ожидалось 85 примеров, найдено " + examples.length);

mkdirSync(new URL("../content/", import.meta.url), { recursive: true });
writeFileSync(new URL("../content/examples.json", import.meta.url), JSON.stringify(examples, null, 1));
console.log("Готово:", examples.length, "примеров");

function decode(s) {
  return s
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
}
