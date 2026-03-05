# Code Examples: Otimizacao de Imagens Docker

## Exemplo 1: Dockerfile com erro (proposital da aula)

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package.json yarn.lock ./
# ERRO: instala apenas producao ANTES do build
RUN yarn workspaces focus --production
COPY . .
# FALHA: NestJS CLI nao esta disponivel (e devDependency)
RUN yarn run build

FROM node:18-alpine3.19
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
```

**Resultado:** Erro no `yarn run build` porque a CLI do Nest nao foi instalada.

## Exemplo 2: Dockerfile corrigido (solucao da aula)

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package.json yarn.lock ./
# Instala TODAS as dependencias (incluindo dev)
RUN yarn install
COPY . .
# Build funciona porque NestJS CLI esta disponivel
RUN yarn run build
# Agora sim, sobrescreve com apenas producao e limpa cache
RUN yarn workspaces focus --production && yarn cache clean

FROM node:18-alpine3.19
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Exemplo 3: Alternativa com 3 estagios (mencionada pelo instrutor)

```dockerfile
# Estagio 1: Instalar dependencias
FROM node:18 AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

# Estagio 2: Build
FROM deps AS build
COPY . .
RUN yarn run build
RUN yarn workspaces focus --production && yarn cache clean

# Estagio 3: Producao
FROM node:18-alpine3.19
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Comandos de verificacao usados na aula

```bash
# Ver tamanho das imagens
docker image ls api-skillz

# Buildar com tag
docker build -t api-skillz:v7 .

# Rodar container
docker run -d api-skillz:v7

# Verificar container rodando
docker ps

# Ver logs
docker logs <container_id>

# Testar aplicacao
curl http://localhost:3000

# Inspecionar arquivos dentro do container Alpine
docker exec -it <container_id> sh
ls -la

# ERRADO para Alpine (nao tem bash):
docker exec -it <container_id> bash  # FALHA
```

## Equivalencias NPM vs Yarn

| Yarn | NPM |
|------|-----|
| `yarn install` | `npm ci` |
| `yarn workspaces focus --production` | `npm ci --omit=dev` |
| `yarn cache clean` | `npm cache clean --force` |
| `yarn run build` | `npm run build` |