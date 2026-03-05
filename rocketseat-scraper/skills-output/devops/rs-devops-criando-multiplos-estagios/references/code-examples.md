# Code Examples: Multi-Stage Build

## Exemplo 1: Dockerfile original (single-stage)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

Problema: `yarn install` traz TODAS as dependencias (incluindo devDependencies como `@nestjs/cli`). Elas permanecem na imagem final.

## Exemplo 2: Conversao para multi-stage

```dockerfile
# Estagio 1: Build (tudo necessario para compilar)
FROM node:18 AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Estagio 2: Runtime (apenas artefatos de execucao)
FROM node:18
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### O que mudou:
1. Adicionou `AS build` no primeiro FROM
2. Criou segundo FROM para runtime
3. Usou `COPY --from=build` para trazer apenas dist/ e node_modules/
4. EXPOSE e CMD ficam apenas no estagio final

## Exemplo 3: Multi-stage otimizado com Alpine

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

Resultado: ~90MB (vs ~1GB no single-stage com node:18 full)

## Exemplo 4: WORKDIR diferente entre estagios

```dockerfile
FROM node:18-alpine AS build
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:18-alpine
WORKDIR /app
# ATENCAO: path de origem e /build (WORKDIR do estagio build), nao /app
COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Exemplo 5: Tres estagios (build + test + runtime)

```dockerfile
# Estagio 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Estagio 2: Test (nao vai para producao)
FROM build AS test
RUN yarn test

# Estagio 3: Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Exemplo 6: Producao com apenas production dependencies

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Instalar apenas producao dependencies em estagio separado
FROM node:18-alpine AS production-deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

# Runtime: dist do build + node_modules so de producao
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=production-deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

Este pattern e a evolucao natural: ao inves de copiar ALL node_modules do build (que inclui devDependencies), cria um estagio intermediario que instala apenas producao.

## Comandos Docker usados na aula

```bash
# Rebuildar a imagem apos alterar o Dockerfile
docker build -t api-rocket:v6 .

# Verificar tamanho das imagens
docker image ls api-rocket
```