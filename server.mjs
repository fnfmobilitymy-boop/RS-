import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = import.meta.dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.svg':'image/svg+xml'};
http.createServer(async (req,res) => {
  try {
    const name = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (!file.startsWith(root + path.sep) || name.includes('/.')) {res.writeHead(403);res.end();return;}
    res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(Number(process.env.PORT || 3000),'0.0.0.0',()=>console.log('RS Interiors server ready on port ' + (process.env.PORT || 3000)));
