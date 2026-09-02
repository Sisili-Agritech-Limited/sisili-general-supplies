/**
 * Static site generator for Sisili General Supplies.
 *
 * Zero dependencies — plain Node. Renders every route in src/pages into dist/
 * as static HTML, copies assets/, and emits sitemap.xml + robots.txt.
 *
 *   node build.mjs            self-contained flat files — open dist/index.html
 *   node build.mjs --linked   hosted layout: clean URLs + shared css/js, into dist/
 *   node build.mjs --root     hosted layout written straight into the repo root —
 *                             for hosts (e.g. cPanel Git Version Control pointed
 *                             directly at a doc root) that git-pull the repo with
 *                             no build step of their own, so index.html has to
 *                             already be sitting at the top of the repo
 *   node build.mjs --serve    build, then serve dist/ on http://localhost:4173
 *   node build.mjs --serve --watch   rebuild on file changes
 */

import { createServer } from 'node:http';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const ASSETS = join(SRC, 'assets');

const args = new Set(process.argv.slice(2));
const SERVE = args.has('--serve');
const WATCH = args.has('--watch');
const ROOT_MODE = args.has('--root');

const DIST = ROOT_MODE ? ROOT : join(ROOT, 'dist');

/**
 * The top-level dist/ entries build.mjs owns in --root mode. Cleaning before
 * a rebuild must delete exactly these and nothing else — the repo root also
 * holds source (src/, build.mjs, package.json, ...) and tooling (.git,
 * .github, node_modules) that a blind recursive wipe would destroy.
 */
const ROOT_MANAGED_ENTRIES = [
  'index.html',
  '404.html',
  'sitemap.xml',
  'robots.txt',
  'assets',
  'about',
  'contact',
  'how-it-works',
  'quote',
  'supplies',
];

/**
 * Default output is self-contained: flat .html files with the CSS and JS
 * inlined, so double-clicking dist/index.html browses the whole site offline.
 * Pass --linked (or --root) for the hosted layout instead — directory-per-page
 * clean URLs (/supplies/) with a shared, cacheable stylesheet and script.
 */
const STANDALONE = !args.has('--linked') && !ROOT_MODE;

/* ------------------------------------------------------------------ *
 * Routes
 * ------------------------------------------------------------------ */

/**
 * Every route the site publishes. `url` is the canonical path; the file is
 * written as `<url>index.html` so hosts serve it without a .html extension.
 *
 * `priority` / `changefreq` feed sitemap.xml.
 */
async function collectRoutes(content, pages) {
  const routes = [
    { url: '/', render: pages.home, priority: '1.0', changefreq: 'monthly' },
    { url: '/supplies/', render: pages.supplies, priority: '0.9', changefreq: 'monthly' },
    { url: '/quote/', render: pages.quote, priority: '0.9', changefreq: 'yearly' },
    { url: '/how-it-works/', render: pages.howItWorks, priority: '0.7', changefreq: 'yearly' },
    { url: '/about/', render: pages.about, priority: '0.6', changefreq: 'yearly' },
    { url: '/contact/', render: pages.contact, priority: '0.8', changefreq: 'yearly' },
  ];

  // One long-tail SEO page per supply line.
  for (const category of content.categories) {
    routes.push({
      url: `/supplies/${category.slug}/`,
      render: (ctx) => pages.category({ ...ctx, category }),
      priority: '0.8',
      changefreq: 'monthly',
    });
  }

  return routes;
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

async function build() {
  const started = Date.now();

  // Cache-bust module imports so --watch picks up edits.
  const stamp = Date.now();
  const load = (rel) => import(`${pathToFileURL(join(SRC, rel)).href}?v=${stamp}`);

  const content = (await load('content.js')).default;
  const layout = await load('layout.js');
  const pages = {
    home: (await load('pages/home.js')).default,
    supplies: (await load('pages/supplies.js')).default,
    category: (await load('pages/category.js')).default,
    howItWorks: (await load('pages/how-it-works.js')).default,
    about: (await load('pages/about.js')).default,
    contact: (await load('pages/contact.js')).default,
    quote: (await load('pages/quote.js')).default,
  };

  if (ROOT_MODE) {
    for (const name of ROOT_MANAGED_ENTRIES) {
      await rm(join(DIST, name), { recursive: true, force: true });
    }
  } else {
    await rm(DIST, { recursive: true, force: true });
  }
  await mkdir(DIST, { recursive: true });

  const routes = await collectRoutes(content, pages);
  routes.push({ url: '/404.html', render: () => null, priority: '0.1', changefreq: 'yearly' });

  // In standalone mode the stylesheet, script and icon are folded into each
  // file, so dist/ ends up as flat .html files with no assets/ folder at all.
  const css = STANDALONE ? await readFile(join(ASSETS, 'styles.css'), 'utf8') : '';
  const js = STANDALONE ? await readFile(join(ASSETS, 'app.js'), 'utf8') : '';
  const faviconDataUri = STANDALONE
    ? `data:image/svg+xml,${encodeURIComponent(await readFile(join(ASSETS, 'favicon.svg'), 'utf8'))}`
    : '';

  for (const route of routes) {
    const page = route.render({ content, url: route.url });
    const html =
      page === null
        ? layout.renderNotFound({ content })
        : layout.renderDocument({ ...page, content, url: route.url });

    const outPath = STANDALONE
      ? join(DIST, fileFor(route.url))
      : join(DIST, route.url.replace(/^\//, ''), route.url.endsWith('.html') ? '' : 'index.html');

    await mkdir(dirname(outPath), { recursive: true });
    const origin = /^\[.*\]$/.test(content.site.origin) ? null : content.site.origin;
    await writeFile(
      outPath,
      STANDALONE ? inlineAssets(html, css, js, faviconDataUri, origin) : html,
      'utf8',
    );
  }

  // The hosted layout needs real files to link to for its CSS/JS/favicon too;
  // the standalone build has inlined those already, so only real photography
  // — which can't be inlined without bloating every page — needs copying.
  // It lands at dist/images/ (standalone) or dist/assets/images/ (hosted),
  // matching the path rewriting above and the untouched root-absolute hrefs
  // hosted pages keep.
  if (STANDALONE) await copyDir(join(ASSETS, 'images'), join(DIST, 'images'));
  else await copyDir(ASSETS, join(DIST, 'assets'));

  await writeFile(join(DIST, 'sitemap.xml'), renderSitemap(routes, content.site), 'utf8');
  await writeFile(join(DIST, 'robots.txt'), renderRobots(content.site), 'utf8');

  const distLabel = ROOT_MODE ? './' : `${relative(ROOT, DIST)}/`;
  console.log(
    `built ${routes.length} pages in ${Date.now() - started}ms → ${distLabel}` +
      (STANDALONE
        ? ' (flat .html files only — open dist/index.html directly)'
        : ROOT_MODE
          ? ' (linked assets, written to repo root)'
          : ' (linked assets)'),
  );
  return routes;
}

/* ------------------------------------------------------------------ *
 * Standalone output
 *
 * Turns the canonical routes (/supplies/timber-building-supplies/) into flat
 * sibling files (supplies-timber-building-supplies.html) and folds the CSS and
 * JS into every document, so the whole site browses from a local folder with
 * no web server and no absolute paths to resolve.
 * ------------------------------------------------------------------ */

/** Canonical route URL → flat filename. */
function fileFor(url) {
  if (url === '/') return 'index.html';
  if (url.endsWith('.html')) return url.slice(1);
  return `${url.replace(/^\/|\/$/g, '').replace(/\//g, '-')}.html`;
}

function inlineAssets(html, css, js, faviconDataUri, origin) {
  // Keep canonical and og:url pointing at the file that actually exists.
  if (origin) {
    const pattern = origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(
      new RegExp(`(href|content)="${pattern}(/[^"]*)"`, 'g'),
      (_m, attr, path) => `${attr}="${origin}/${fileFor(path)}"`,
    );
  }

  return (
    html
      // The favicon becomes a data: URI, so no assets/ folder is needed at all.
      .replace('href="/assets/favicon.svg"', () => `href="${faviconDataUri}"`)
      // Root-absolute paths break under file://, so make every link relative.
      // Photos land at dist/images/ (flat, alongside the pages) rather than
      // dist/assets/images/ — the standalone build has no assets/ folder at
      // all. styles.css and app.js still route through "assets/..." here:
      // the specific replacements just below match that exact relative form
      // and swap it for the inlined <style>/<script> block.
      .replace(/\b(href|src)="\/([^"]*)"/g, (_m, attr, rest) => {
        const [path, query] = `/${rest}`.split('?');
        const target = path.startsWith('/assets/images/')
          ? path.replace('/assets/', '')
          : path.startsWith('/assets/')
            ? path.slice(1)
            : fileFor(path);
        return `${attr}="${target}${query ? `?${query}` : ''}"`;
      })
      // Replacer functions, not strings: String.replace() treats "$$" in a
      // string replacement as a literal "$", which silently corrupts app.js
      // (its $$ = querySelectorAll helper) into a syntax error.
      .replace('<link rel="stylesheet" href="assets/styles.css">', () => `<style>\n${css}\n  </style>`)
      .replace(
        '<script src="assets/app.js" defer></script>',
        // A literal </script> inside the code would close the tag early.
        () => `<script>\n${js.replace(/<\/script/gi, '<\\/script')}\n  </script>`,
      )
  );
}

async function copyDir(from, to) {
  let entries;
  try {
    entries = await readdir(from, { withFileTypes: true });
  } catch {
    return; // no assets directory — nothing to copy
  }
  await mkdir(to, { recursive: true });
  for (const entry of entries) {
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    if (entry.isDirectory()) await copyDir(src, dest);
    else await writeFile(dest, await readFile(src));
  }
}

function renderSitemap(routes, site) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .filter((r) => r.url !== '/404.html')
    .map(
      (r) =>
        `  <url>\n` +
        `    <loc>${site.origin}${STANDALONE ? `/${fileFor(r.url)}` : r.url}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${r.changefreq}</changefreq>\n` +
        `    <priority>${r.priority}</priority>\n` +
        `  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function renderRobots(site) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`;
}

/* ------------------------------------------------------------------ *
 * Dev server
 * ------------------------------------------------------------------ */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function serve(port = 4173) {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      let filePath = resolve(DIST, `.${decodeURIComponent(url.pathname)}`);

      // Never escape dist/.
      if (!filePath.startsWith(DIST)) {
        res.writeHead(403).end('Forbidden');
        return;
      }

      const info = await stat(filePath).catch(() => null);
      if (info?.isDirectory()) filePath = join(filePath, 'index.html');

      const body = await readFile(filePath).catch(() => null);
      if (!body) {
        const notFound = await readFile(join(DIST, '404.html')).catch(() => 'Not found');
        res.writeHead(404, { 'content-type': MIME['.html'] }).end(notFound);
        return;
      }

      res.writeHead(200, {
        'content-type': MIME[extname(filePath)] ?? 'application/octet-stream',
        'cache-control': 'no-cache',
      });
      res.end(body);
    } catch (err) {
      res.writeHead(500).end(String(err));
    }
  });

  await new Promise((ok) => server.listen(port, ok));
  console.log(`serving http://localhost:${port}`);
}

/* ------------------------------------------------------------------ *
 * Entry
 * ------------------------------------------------------------------ */

await build();

if (SERVE) {
  await serve();

  if (WATCH) {
    let pending = null;
    watch(SRC, { recursive: true }, () => {
      clearTimeout(pending);
      pending = setTimeout(() => build().catch((err) => console.error(err)), 80);
    });
    console.log('watching src/ (including src/assets/) for changes');
  }
}
