// Static delivery-gate server. Serves the built SPA (dist/<proyecto>/browser)
// so Lighthouse measures only local bundle bytes — no CDN, no service worker.
// Usage: node serve-gate.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

function findRoot() {
  const dist = path.join(__dirname, 'dist');
  if (!fs.existsSync(dist)) throw new Error('dist/ missing — run pnpm build first.');
  const dirs = fs.readdirSync(dist).filter((d) => fs.statSync(path.join(dist, d)).isDirectory());
  for (const d of dirs) {
    const browser = path.join(dist, d, 'browser');
    if (fs.existsSync(path.join(browser, 'index.html'))) return browser;
  }
  throw new Error('No dist/<proj>/browser/index.html found — run pnpm build first.');
}

const root = findRoot();
const port = Number(process.argv[2] || 4173);

const server = http
  .createServer((req, res) => {
    const reqPath = req.url.split('?')[0];
    let fp = path.join(root, reqPath === '/' ? 'index.html' : reqPath);
    if (!fs.existsSync(fp) || !fp.startsWith(root)) fp = path.join(root, 'index.html');
    const ext = path.extname(fp).toLowerCase();
    res.setHeader('Content-Type', TYPES[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    fs.createReadStream(fp).pipe(res);
  })
  .listen(port, '127.0.0.1', () => {
    console.log('GATE_READY:' + port);
    console.log('ROOT:' + root);
  });
