---
name: rs-devops-comparando-imagens
description: "Applies Docker image optimization techniques to reduce image size using multi-stage builds, production-only dependencies, and cache cleaning. Use when user asks to 'optimize Docker image', 'reduce image size', 'slim down container', 'multi-stage build', or 'production Dockerfile'. Covers yarn workspaces focus --production, npm ci --omit=dev, cache cleaning, and Alpine-based images. Make sure to use this skill whenever writing or reviewing Dockerfiles for Node.js applications. Not for Docker Compose, orchestration, networking, or runtime configuration."
---

# Otimizacao de Imagens Docker

> Reduza imagens Docker eliminando dependencias de desenvolvimento, limpando cache e usando multi-stage builds com Alpine.

## Rules

1. **Use multi-stage builds** — separe build e producao em estagios distintos, porque o estagio de build precisa de devDependencies mas producao nao
2. **Instale apenas dependencias de producao no estagio final** — `yarn workspaces focus --production` ou `npm ci --omit=dev`, porque devDependencies inflam a imagem sem necessidade
3. **Limpe o cache do gerenciador de pacotes** — `yarn cache clean` apos instalar, porque o cache ocupa espaco sem utilidade em producao
4. **Use Alpine como imagem base de producao** — `node:18-alpine3.19` em vez de `node:18`, porque Alpine reduz a imagem base de ~1GB para ~100MB
5. **Instale todas as dependencias ANTES do build** — rode `yarn` (completo) antes de `yarn run build`, depois sobrescreva com production-only, porque o build precisa de devDependencies como CLIs (ex: NestJS CLI)
6. **Alpine usa `sh`, nao `bash`** — ao debugar com `docker exec -it`, use `sh` porque Alpine nao inclui bash

## How to write

### Multi-stage Dockerfile para Node.js

```dockerfile
# Estagio 1: Build (imagem completa com devDependencies)
FROM node:18 AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build

# Reinstalar apenas producao e limpar cache
RUN yarn workspaces focus --production && yarn cache clean

# Estagio 2: Producao (Alpine leve)
FROM node:18-alpine3.19
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Equivalente com NPM

```dockerfile
# No estagio de build:
RUN npm ci
RUN npm run build
RUN npm ci --omit=dev && npm cache clean --force
```

## Example

**Before (~1GB):**
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build
EXPOSE 3000
CMD ["yarn", "start:prod"]
```

**After (~210MB):**
```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build
RUN yarn workspaces focus --production && yarn cache clean

FROM node:18-alpine3.19
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**Reducao: 1GB → 383MB (Alpine) → 210MB (production deps + cache clean)**

## Heuristics

| Situacao | Acao |
|----------|------|
| Build falha com CLI not found apos production install | Mova o build para ANTES do `workspaces focus --production` |
| Imagem ainda grande apos Alpine | Verifique se `yarn cache clean` esta sendo executado |
| Precisa debugar dentro do container Alpine | Use `docker exec -it <id> sh` (nao bash) |
| Projeto com multiplos estagios de build | Considere 3 estagios: deps, build, producao |
| Usando npm em vez de yarn | Substitua por `npm ci --omit=dev` e `npm cache clean --force` |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `yarn install` no estagio final | `COPY --from=build` apenas o necessario |
| `FROM node:18` como imagem final | `FROM node:18-alpine3.19` para producao |
| `yarn workspaces focus --production` antes do build | `yarn install` → build → `yarn workspaces focus --production` |
| Esquecer `yarn cache clean` | Sempre limpar cache apos instalar deps de producao |
| `docker exec -it <id> bash` em Alpine | `docker exec -it <id> sh` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-comparando-imagens/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-comparando-imagens/references/code-examples.md)
