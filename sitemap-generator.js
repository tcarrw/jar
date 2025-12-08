/*!
 * sitemap-generator.js — MIT
 * Generates sitemap.xml for a static site by scanning .html files.
 * Automatically detects the plnt.earth domain from package.json or directory context.
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUTFILE = path.join(ROOT, "sitemap.xml");

// Detect domain from multiple sources
function detectDomain() {
  // 1. Check environment variable first
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/+$/, "");
  }
  
  // 2. Check package.json for domain hint
  const pkgPath = path.join(ROOT, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      if (pkg.domain) return pkg.domain.replace(/\/+$/, "");
      if (pkg.homepage) return pkg.homepage.replace(/\/+$/, "");
    } catch(e) {
      // ignore parse errors
    }
  }
  
  // 3. Check .domain file
  const domainPath = path.join(ROOT, ".domain");
  if (fs.existsSync(domainPath)) {
    const domain = fs.readFileSync(domainPath, "utf8").trim();
    if (domain) return domain.replace(/\/+$/, "");
  }
  
  // 4. Detect from directory name (assuming structure like /sites/map.plnt.earth/)
  const dirName = path.basename(ROOT);
  const plntDomainMatch = dirName.match(/^([a-z0-9-]+)\.plnt\.earth$/i);
  if (plntDomainMatch) {
    return `https://${dirName}`;
  }
  
  // 5. Check CNAME file (GitHub Pages style)
  const cnamePath = path.join(ROOT, "CNAME");
  if (fs.existsSync(cnamePath)) {
    const cname = fs.readFileSync(cnamePath, "utf8").trim();
    if (cname) return `https://${cname}`.replace(/\/+$/, "");
  }
  
  // 6. Fallback - ask user to configure
  console.error("⚠️  Could not detect domain. Please set one of:");
  console.error("   - BASE_URL environment variable");
  console.error("   - 'domain' field in package.json");
  console.error("   - Create .domain file with domain");
  console.error("   - Create CNAME file with domain");
  console.error("\nExample: echo 'https://map.plnt.earth' > .domain");
  process.exit(1);
}

const BASE_URL = detectDomain();
const EXCLUDE_DIRS = new Set([
  ".git", 
  "node_modules", 
  ".dist", 
  "dist", 
  "build", 
  ".github",
  ".vscode",
  ".idea",
  "temp",
  "tmp"
]);

const INCLUDE_EXT = new Set([".html"]);

// Optional: Exclude specific patterns
const EXCLUDE_PATTERNS = [
  /^404\.html$/i,
  /^5\d\d\.html$/i,
  /\/test\//i,
  /\/draft\//i,
  /\/wip\//i
];

function shouldExclude(relPath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(relPath));
}

function walk(dir) {
  let files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") && e.name !== ".well-known") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (EXCLUDE_DIRS.has(e.name)) continue;
      files = files.concat(walk(full));
    } else if (e.isFile() && INCLUDE_EXT.has(path.extname(e.name).toLowerCase())) {
      const relPath = path.relative(ROOT, full);
      if (!shouldExclude(relPath)) {
        files.push(relPath);
      }
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
  // Root gets highest priority
  if (url === `${BASE_URL}/`) return "1.0";
  
  // Important pages get higher priority
  if (url.match(/\/(about|froot|map|four|time|jar)\//i)) return "0.9";
  
  // Index pages in subdirectories
  if (url.endsWith("/")) return "0.8";
  
  // Default
  return "0.7";
}

function changefreqFor(url) {
  // Homepage changes more frequently
  if (url === `${BASE_URL}/`) return "daily";
  
  // Active sections
  if (url.match(/\/(froot|jar|calendar|day)\//i)) return "daily";
  
  // Regular pages
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
  console.log(`📂 Scanning directory: ${ROOT}`);
  
  const urls = new Set();
  const files = walk(ROOT);
  
  console.log(`📄 Found ${files.length} HTML files`);
  
  for (const rel of files) {
    const url = toUrl(rel);
    urls.add(url);
    
    // Also add directory URL for index.html files
    if (rel.toLowerCase().endsWith("/index.html")) {
      const folderUrl = url.replace(/index\.html$/i, "");
      urls.add(folderUrl.endsWith("/") ? folderUrl : folderUrl + "/");
    }
  }
  
  const sortedUrls = Array.from(urls).sort();
  const xml = sitemap(sortedUrls);
  
  fs.writeFileSync(OUTFILE, xml, "utf8");
  
  console.log(`✅ Sitemap generated: ${OUTFILE}`);
  console.log(`🔗 Total URLs: ${sortedUrls.length}`);
  console.log(`\nFirst 5 URLs:`);
  sortedUrls.slice(0, 5).forEach(u => console.log(`   ${u}`));
  if (sortedUrls.length > 5) {
    console.log(`   ... and ${sortedUrls.length - 5} more`);
  }
})();
