import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { root, readData } from './build.mjs';

const { config } = await readData();
const output = resolve(root, 'dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png' };
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path === '/') { res.writeHead(302, { Location: config.basePath }); return res.end(); }
    if (!path.startsWith(config.basePath)) throw new Error('Not found');
    let file = resolve(output, path.slice(config.basePath.length));
    if (file !== output && !file.startsWith(output + sep)) throw new Error('Not found');
    if ((await stat(file)).isDirectory()) {
      if (!path.endsWith('/')) { res.writeHead(302, { Location: path + '/' }); return res.end(); }
      file = resolve(file, 'index.html');
    }
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    res.end(bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:4173${config.basePath}`));
