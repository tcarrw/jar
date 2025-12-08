#!/usr/bin/env node
/*!
 * sitemap-generator.js — MIT
 * Drop this file in any plnt.earth repo and run: node sitemap-generator.js
 * Automatically detects domain from directory name (e.g., map.plnt.earth)
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUTFILE = path.join(ROOT, "sitemap.xml");

// Auto-detect domain from directory name
function detectDomain() {
  const dirName = path.basename(ROOT);
  
  // Check if directory name matches *.plnt.earth pattern
  if (dirName.match(/\.plnt\.earth$/i)) {
    return `https://${dirName}`;
  }
  
  // Fallback: ask user
  console.error("❌ Could not detect domain from directory name.");
  console.error(`   Current directory: ${dirName}`);
  console.error(`   Expected format: subdomain.plnt.earth`);
  console.error("\nPlease rename your directory to match the domain.");
  console.error("Example: map.plnt.earth, froot.plnt.earth, etc.");
  process.exit(1);
}

const BASE_URL = detectDomain();
const EXCLUDE_DIRS = new Set([".git", "node_modules", ".dist", "dist", "build", ".github"]);
const INCLUDE_EXT = new Set([".html"]);

function walk(dir) {
  let files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") && e.name !== ".well-known") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (EXCLUDE_DIRS.has(e.name)) continue;
      files = files.concat(walk(full));
    } else if (e.isFile() && INCLUDE_EXT.has(path.extname(e.name).toLowerCase())) {
      files.push(path.relative(ROOT, full));
    }
  }
  return files;
}

function toUrl(relPath) {
  const webPath = relPath.split(path.sep).join("/");
  if (webPath.toLowerCase() === "index.html") return `${BASE_URL}/`;
  return `${BASE_URL}/${encodeURI(webPath)}`;
}

function priorityFor(url) {
  if (url === `${BASE_URL}/`) return "1.0";
  // Any subdirectory index page gets higher priority
  if (url.endsWith("/")) return "0.8";
  return "0.7";
}

function changefreqFor(url) {
  if (url === `${BASE_URL}/`) return "daily";
  // Active/dynamic sections get daily updates
  if (url.match(/\/(calendar|day|notes|timeline|victory)\//i)) return "daily";
  return "weekly";
}

function sitemap(urls) {
  const rows = urls.map(u => `  <url>
    <loc>${u}</loc>
    <changefreq>${changefreqFor(u)}</changefreq>
    <priority>${priorityFor(u)}</priority>
  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`;
}

(function main(){
  console.log(`🗺️  Generating sitemap for: ${BASE_URL}`);
  
  const urls = new Set();
  for (const rel of walk(ROOT)) {
    const url = toUrl(rel);
    urls.add(url);
    if (rel.toLowerCase().endsWith("/index.html")) {
      const folderUrl = url.replace(/index\.html$/i, "");
      urls.add(folderUrl.endsWith("/") ? folderUrl : folderUrl + "/");
    }
  }
  
  fs.writeFileSync(OUTFILE, sitemap(Array.from(urls).sort()), "utf8");
  console.log(`✅ Generated ${OUTFILE} with ${urls.size} URLs`);
})();
