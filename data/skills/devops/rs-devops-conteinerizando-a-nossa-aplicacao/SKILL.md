---
name: rs-devops-conteinerizando-aplicacao
description: "Applies multi-stage Docker build patterns when containerizing Node.js/NestJS applications for Kubernetes deployment. Use when user asks to 'dockerize', 'containerize', 'create Dockerfile', 'build Docker image', 'prepare app for Kubernetes', or 'optimize Docker image size'. Enforces Alpine final stage, production-only dependencies, proper COPY ordering, and .dockerignore hygiene. Make sure to use this skill whenever creating Dockerfiles for Node/NestJS apps targeting K8s clusters. Not for docker-compose setup, CI/CD pipelines, or Kubernetes manifest writing."
---

# Conteinerizando Aplicacoes Node.js para Kubernetes

> Utilize multi-stage build para separar construcao de execucao, resultando em imagens minimas que aceleram deploys no cluster.

## Rules

1. **Use multi-stage build** — estagio `build` com imagem completa (Debian), estagio final com Alpine, porque imagens menores = pulls mais rapidos no cluster K8s
2. **Copie arquivos de dependencia antes do codigo** — `package.json` e lockfile primeiro, depois `COPY .`, porque isso maximiza cache de layers do Docker
3. **Remova devDependencies antes do estagio final** — `yarn workspaces focus --production` + `yarn cache clean`, porque dependencias de desenvolvimento nao devem existir em producao
4. **Use Alpine no estagio final** — a diferenca de tamanho comprimido e consideravel, porque o cluster precisa fazer pull da imagem para cada node
5. **Defina WORKDIR em ambos os estagios** — contextos sao independentes, um nao herda do outro
6. **EXPOSE a porta da aplicacao** — documente a porta que o container escuta, porque o Service do K8s precisa saber para onde apontar
7. **Use start:prod no CMD** — nunca use o comando dev (watch/auto-reload) em producao, porque a aplicacao ja esta buildada

## How to write

### Dockerfile multi-stage para NestJS

```dockerfile
# Estagio 1: Build (imagem completa para compilacao)
FROM node:20.17.0 AS build
WORKDIR /usr/src/app

# Copiar arquivos de dependencia primeiro (cache optimization)
COPY package.json yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn .yarn

# Instalar dependencias
RUN yarn

# Copiar codigo fonte e buildar
COPY . .
RUN yarn run build

# Remover devDependencies
RUN yarn workspaces focus --production && yarn cache clean

# Estagio 2: Execucao (imagem Alpine minima)
FROM node:20.17.0-alpine3.20
WORKDIR /usr/src/app

# Copiar apenas o necessario do estagio build
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/yarn.lock ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.yarn ./.yarn
COPY --from=build /usr/src/app/.yarnrc.yml ./

EXPOSE 3000
CMD ["yarn", "run", "start:prod"]
```

### .dockerignore essencial

```
node_modules
test
.prettierrc
.eslintrc*
Dockerfile
.git
```

## Example

**Before (Dockerfile sem multi-stage):**
```dockerfile
FROM node:20.17.0
WORKDIR /usr/src/app
COPY . .
RUN yarn && yarn build
EXPOSE 3000
CMD ["yarn", "run", "start:dev"]
```

**After (com multi-stage e Alpine):**
```dockerfile
FROM node:20.17.0 AS build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn run build
RUN yarn workspaces focus --production && yarn cache clean

FROM node:20.17.0-alpine3.20
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD ["yarn", "run", "start:prod"]
```

## Heuristics

| Situacao | Acao |
|----------|------|
| App usa TypeScript (NestJS, etc) | Obrigatorio build stage — precisa compilar para JS |
| App usa yarn v3+ | Copiar `.yarnrc.yml` e `.yarn/` no build stage |
| App usa npm | Copiar `package-lock.json`, usar `npm ci --omit=dev` no final |
| Imagem sera usada em K8s | Sempre Alpine no estagio final — cluster faz pull por node |
| Testar localmente antes de push | `docker run -p 3001:3000 <image>` para validar |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `FROM node:20` sem multi-stage | Multi-stage com Alpine final |
| `COPY . .` antes de instalar deps | `COPY package.json` primeiro, `RUN yarn`, depois `COPY .` |
| `CMD ["yarn", "start:dev"]` em prod | `CMD ["yarn", "run", "start:prod"]` |
| Manter devDependencies na imagem final | `yarn workspaces focus --production` |
| Esquecer `.dockerignore` | Excluir `node_modules`, `test`, config files |
| Mesmo `FROM` para build e execucao | Debian para build, Alpine para execucao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
