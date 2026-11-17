import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function resolvePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const normalized = normalize(clean).replace(/^(\.\.[/\\])+/, '');
  const target = join(ROOT, normalized);
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return null;
  return target;
}

async function sendFile(res, filePath, statusCode = 200, method = 'GET') {
  const info = await stat(filePath);
  if (!info.isFile()) throw new Error('not a file');
  const ext = extname(filePath).toLowerCase();
  const immutable = filePath.includes(`${sep}assets${sep}`);
  res.writeHead(statusCode, {
    'Content-Type': MIME[ext] ?? 'application/octet-stream',
    'Content-Length': info.size,
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  if (method === 'HEAD') {
    res.end();
    return;
  }
  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  const method = req.method === 'HEAD' ? 'HEAD' : 'GET';
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end('Method Not Allowed');
    return;
  }

  const target = resolvePath(req.url || '/');
  if (!target) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  try {
    if (target !== ROOT) {
      const info = await stat(target).catch(() => null);
      if (info?.isFile()) {
        await sendFile(res, target, 200, method);
        return;
      }
    }
    // Single-page app: everything else falls back to index.html.
    await sendFile(res, join(ROOT, 'index.html'), 200, method);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Free Panel listening on http://${HOST}:${PORT}`);
});
