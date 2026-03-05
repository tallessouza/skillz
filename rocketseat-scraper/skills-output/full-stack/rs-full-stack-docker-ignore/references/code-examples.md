# Code Examples: Docker Ignore

## Exemplo basico da aula (Node.js)

```dockerignore
node_modules
dist
Dockerfile
.git
.dockerignore
.gitignore
```

## Variacao: Projeto Node.js com TypeScript completo

```dockerignore
node_modules
dist
build
Dockerfile
Dockerfile.dev
docker-compose.yml
docker-compose.dev.yml
.git
.gitignore
.dockerignore
.env
.env.local
.env.*.local
*.md
LICENSE
.vscode
.idea
coverage
.nyc_output
```

## Variacao: Projeto com monorepo

```dockerignore
**/node_modules
**/dist
**/build
.git
.gitignore
.dockerignore
Dockerfile*
docker-compose*
*.md
LICENSE
.vscode
.idea
**/coverage
**/.env.local
```

## Variacao: Frontend React/Next.js

```dockerignore
node_modules
.next
out
build
Dockerfile
.git
.gitignore
.dockerignore
.env.local
.env.*.local
coverage
.vscode
*.md
```

## Contexto: Dockerfile que justifica ignorar dist/

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build  # Gera a pasta dist/ dentro do container

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Neste `Dockerfile`, a linha `RUN npm run build` recria a pasta `dist/` dentro do container. Por isso, enviar a `dist/` local seria redundante — o `.dockerignore` evita essa copia desnecessaria.

## Comparacao lado a lado

| Arquivo | `.gitignore` | `.dockerignore` |
|---------|-------------|-----------------|
| `node_modules` | Sim | Sim |
| `dist` | Sim | Sim |
| `.git` | N/A | Sim |
| `Dockerfile` | Depende | Sim |
| `.env` | Sim | Sim |
| `src/` | Nao | Nao |
| `package.json` | Nao | Nao |