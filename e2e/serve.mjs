/**
 * Serves the production build for the end-to-end tests the way Netlify does:
 * redirects and headers come from netlify.toml, so the tests also check the
 * Content Security Policy and the routing of the prerendered pages.
 *
 * Covers the parts of Netlify's rules this site uses: splats (*, :splat),
 * rewrites (200), redirects (301/302), force, shadowing by existing files,
 * trailing slashes and the 404 page. Netlify functions are not served; the
 * tests answer their requests themselves (e2e/fixtures.ts).
 *
 * Usage: node e2e/serve.mjs [port], default 4300.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'smol-toml';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'dist/schnittstellenpass/browser');
const port = Number(process.argv[2] ?? process.env.PORT ?? 4300);

const config = parse(await readFile(path.join(root, 'netlify.toml'), 'utf8'));
const redirects = config.redirects ?? [];
const headerRules = config.headers ?? [];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json'
};

/** Netlify pattern ("/folgen/*", "/*.js") → regular expression; * matches the rest */
function pattern(from) {
  const source = from.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '(.*)');
  return new RegExp(`^${source}$`);
}

/** Netlify ignores a trailing slash when matching rules */
function withoutSlash(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

/** The file Netlify serves for a path, without rules: the file itself or a folder's index.html */
async function staticFile(pathname) {
  const file = path.join(site, pathname);
  if (!file.startsWith(site)) {
    return null;
  }
  try {
    const info = await stat(file);
    if (info.isFile()) {
      return { file };
    }
    if (info.isDirectory()) {
      const index = path.join(file, 'index.html');
      await stat(index);
      // Pretty URLs: a folder is served with a trailing slash
      return pathname.endsWith('/') ? { file: index } : { redirect: `${pathname}/` };
    }
  } catch {
    // Not there
  }
  return null;
}

async function resolve(pathname) {
  const own = await staticFile(pathname);
  for (const rule of redirects) {
    const match = pattern(rule.from).exec(withoutSlash(pathname)) ?? (rule.from.endsWith('/*') && withoutSlash(pathname) === rule.from.slice(0, -2) ? [pathname, ''] : null);
    if (!match) {
      continue;
    }
    // Without force, an existing file wins over the rule (shadowing)
    if (own && !rule.force) {
      break;
    }
    const target = rule.to.replace(':splat', match[1] ?? '');
    const status = rule.status ?? 301;
    if (status === 301 || status === 302) {
      return { status, location: target };
    }
    const rewritten = await staticFile(target);
    return rewritten?.file ? { status, file: rewritten.file } : notFound();
  }
  if (own?.redirect) {
    return { status: 301, location: own.redirect };
  }
  return own ? { status: 200, file: own.file } : notFound();
}

function notFound() {
  return { status: 404, file: path.join(site, '404.html') };
}

function headersFor(pathname) {
  const headers = {};
  for (const rule of headerRules) {
    if (pattern(rule.for).test(pathname)) {
      Object.assign(headers, rule.values);
    }
  }
  return headers;
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, 'http://localhost');
  const decoded = decodeURIComponent(pathname);

  if (decoded.startsWith('/.netlify/functions/')) {
    response.writeHead(503, { 'Content-Type': 'application/json' });
    response.end('{"error":"Netlify functions are not served in the tests"}');
    return;
  }

  const result = await resolve(decoded);
  const headers = headersFor(decoded);
  if (result.location) {
    response.writeHead(result.status, { ...headers, Location: result.location });
    response.end();
    return;
  }
  try {
    const body = await readFile(result.file);
    response.writeHead(result.status, { ...headers, 'Content-Type': TYPES[path.extname(result.file)] ?? 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found (is the site built? npm run e2e builds it)');
  }
}).listen(port, () => console.log(`Serving ${path.relative(root, site)} with the rules of netlify.toml on http://localhost:${port}`));
