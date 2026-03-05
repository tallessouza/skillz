# Code Examples: Conteinerizando Aplicacoes para Kubernetes

## Exemplo 1: Estrutura da aplicacao NestJS

A aplicacao usada e um boilerplate padrao do NestJS:

```bash
# Gerar scaffold
npx @nestjs/cli new nome-da-aplicacao
```

Estrutura resultante:
```
src/
  app.controller.ts   # Rota raiz retornando "Hello World"
  app.service.ts      # Service retornando string
  app.module.ts       # Modulo principal
  main.ts             # Entrypoint (porta 3000)
package.json
yarn.lock
.yarnrc.yml           # Configuracao yarn v3
.yarn/                # Release e plugins do yarn
```

## Exemplo 2: Rodando localmente (sem container)

```bash
yarn run start:dev
# Aplicacao sobe na porta 3000
# http://localhost:3000 -> "Hello World"
```

## Exemplo 3: Dockerfile completo da aula

```dockerfile
# Estagio de build - imagem completa (Debian)
FROM node:20.17.0 AS build
WORKDIR /usr/src/app

# Arquivos de dependencia primeiro (cache optimization)
COPY package.json yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn .yarn

# Instalar todas as dependencias (incluindo devDeps para build)
RUN yarn

# Copiar todo o codigo fonte
COPY . .

# Compilar TypeScript -> JavaScript
RUN yarn run build

# Remover devDependencies e limpar cache
RUN yarn workspaces focus --production
RUN yarn cache clean

# Estagio de execucao - imagem Alpine (minima)
FROM node:20.17.0-alpine3.20
WORKDIR /usr/src/app

# Copiar artefatos do estagio build
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/yarn.lock ./yarn.lock
COPY --from=build /usr/src/app/.yarnrc.yml ./.yarnrc.yml
COPY --from=build /usr/src/app/.yarn ./.yarn
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 3000
CMD ["yarn", "run", "start:prod"]
```

## Exemplo 4: .dockerignore

```
node_modules
test
.prettierrc
.eslintrc*
Dockerfile
```

Motivo de cada exclusao:
- `node_modules` — sera reinstalado dentro do container
- `test` — nao necessario em producao
- `.prettierrc` / `.eslintrc*` — ferramentas de dev apenas
- `Dockerfile` — meta-arquivo, nao faz sentido dentro do container

## Exemplo 5: Build e execucao do container

```bash
# Build da imagem com tag
docker build -t app-ts:v1 .

# Executar container mapeando porta
docker run -p 3001:3000 --detach app-ts:v1

# Verificar container rodando
docker ps
# CONTAINER ID  IMAGE      PORTS                   STATUS
# abc123        app-ts:v1  0.0.0.0:3001->3000/tcp  Up 5s

# Testar no navegador
# http://localhost:3001 -> "Hello World"
```

## Exemplo 6: package.json scripts relevantes

```json
{
  "scripts": {
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main"
  }
}
```

- `start:dev` — usa NestJS CLI com watch (hot-reload)
- `start:prod` — executa diretamente com Node o JS compilado

## Exemplo 7: Variacoes para npm (ao inves de yarn)

```dockerfile
FROM node:20.17.0 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:20.17.0-alpine3.20
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]
```

## Exemplo 8: Variacoes para pnpm

```dockerfile
FROM node:20.17.0 AS build
WORKDIR /usr/src/app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
RUN pnpm prune --prod

FROM node:20.17.0-alpine3.20
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]
```