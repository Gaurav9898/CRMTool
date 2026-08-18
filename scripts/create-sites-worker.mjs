import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const assetsDir = path.join(distDir, 'assets');
const serverDir = path.join(distDir, 'server');
const hostingDir = path.join(distDir, '.openai');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

async function collectFiles() {
  const files = [];
  files.push('/index.html');
  files.push('/strongher-logo.png');

  const assetNames = await readdir(assetsDir);
  for (const assetName of assetNames) {
    files.push(`/assets/${assetName}`);
  }

  return files;
}

function isTextFile(filePath) {
  return ['.html', '.js', '.css', '.json', '.svg'].includes(path.extname(filePath));
}

async function createWorker() {
  const files = {};
  const publicPaths = await collectFiles();

  for (const publicPath of publicPaths) {
    const filePath = path.join(distDir, publicPath);
    const buffer = await readFile(filePath);
    const extension = path.extname(filePath);
    files[publicPath] = {
      type: mimeTypes[extension] || 'application/octet-stream',
      encoding: isTextFile(filePath) ? 'text' : 'base64',
      body: isTextFile(filePath) ? buffer.toString('utf8') : buffer.toString('base64')
    };
  }

  const worker = `const files = ${JSON.stringify(files)};\n\n` +
`function decodeBase64(value) {\n` +
`  const binary = atob(value);\n` +
`  const bytes = new Uint8Array(binary.length);\n` +
`  for (let index = 0; index < binary.length; index += 1) {\n` +
`    bytes[index] = binary.charCodeAt(index);\n` +
`  }\n` +
`  return bytes;\n` +
`}\n\n` +
`export default {\n` +
`  async fetch(request) {\n` +
`    const url = new URL(request.url);\n` +
`    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;\n` +
`    const file = files[pathname] || files['/index.html'];\n` +
`    const isAsset = pathname.startsWith('/assets/') || pathname.endsWith('.png');\n` +
`    return new Response(file.encoding === 'base64' ? decodeBase64(file.body) : file.body, {\n` +
`      headers: {\n` +
`        'content-type': file.type,\n` +
`        'cache-control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache'\n` +
`      }\n` +
`    });\n` +
`  }\n` +
`};\n`;

  await mkdir(serverDir, { recursive: true });
  await writeFile(path.join(serverDir, 'index.js'), worker);

  await mkdir(hostingDir, { recursive: true });
  const hosting = await readFile(path.join(root, '.openai', 'hosting.json'), 'utf8');
  await writeFile(path.join(hostingDir, 'hosting.json'), hosting);
}

await createWorker();
