FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_IEUM_API_BASE_URL
ARG VITE_SOCKET_URL

ENV VITE_IEUM_API_BASE_URL=$VITE_IEUM_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
RUN cat > server.mjs <<'EOF'
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { createServer } from 'node:http';

const root = join(process.cwd(), 'dist');
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const resolveFile = async (url) => {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  const normalized = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const candidate = join(root, normalized === '/' ? 'index.html' : normalized);
  try {
    const file = await stat(candidate);
    return file.isFile() ? candidate : join(root, 'index.html');
  } catch {
    return join(root, 'index.html');
  }
};

createServer(async (request, response) => {
  const filePath = await resolveFile(request.url ?? '/');
  response.setHeader('Content-Type', types[extname(filePath)] ?? 'application/octet-stream');
  createReadStream(filePath).pipe(response);
}).listen(3000, '0.0.0.0');
EOF

EXPOSE 3000
CMD ["node", "server.mjs"]
