# Code Examples: Otimizacao de Imagens Docker

## Exemplo 1: Dockerfile antes das otimizacoes

```dockerfile
FROM node:18

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

**Problemas:**
- Nao copia `yarn.lock` — dependencias podem variar entre builds
- Nao copia `yarnrc.yml` nem `.yarn/` — yarn berry pode falhar
- Sem `.dockerignore` — `node_modules` e `dist` sao copiados desnecessariamente
- Sem tag no build — usa `latest` por padrao

**Resultado:** ~1GB de imagem

## Exemplo 2: Dockerfile com lock files e configs do yarn berry

```dockerfile
FROM node:18

WORKDIR /app

# Copiar arquivos de dependencia (cache-friendly)
COPY package.json yarn.lock ./
COPY yarnrc.yml ./

# Copiar pasta do yarn berry (COPY separado para pastas)
COPY .yarn ./.yarn

RUN yarn install

# Copiar codigo fonte (apos install para aproveitar cache)
COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

**Resultado:** ~805MB (reducao de ~200MB, build mais rapido)

## Exemplo 3: .dockerignore

```
node_modules
dist
.git
Dockerfile
.dockerignore
```

**Nota do instrutor:** `.yarn` foi inicialmente adicionado ao .dockerignore mas causou erro de build ("not found") porque o yarn berry precisa da pasta `.yarn/releases/` para executar. Foi removido do ignore.

## Exemplo 4: Build com tag versionada

```bash
# Errado — usa latest implicitamente
docker build -t api-rocket .

# Correto — versao explicita
docker build -t api-rocket:v1 .
```

## Exemplo 5: Verificando resultados

```bash
# Ver tamanho das imagens
docker image ls

# Saida esperada:
# REPOSITORY    TAG      SIZE
# api-rocket    latest   805MB
# api-rocket    v1       500MB

# Ver historico de layers
docker image history api-rocket:v1
```

## Exemplo 6: COPY com npm vs yarn

```dockerfile
# npm — asterisco pega package.json E package-lock.json
COPY package*.json ./
RUN npm install

# yarn classic — precisa copiar yarn.lock explicitamente
COPY package.json yarn.lock ./
RUN yarn install

# yarn berry (v3) — precisa de configs adicionais
COPY package.json yarn.lock yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install
```

## Exemplo 7: Erro ao ignorar .yarn indevidamente

```
# .dockerignore (ERRADO para yarn berry)
node_modules
dist
.git
.yarn          # <-- causa erro!
Dockerfile
.dockerignore
```

```
# Erro no build:
# => ERROR: not found .yarn
# O .dockerignore funcionou (removeu .yarn do contexto),
# mas o Dockerfile precisa do .yarn para o yarn install
```

**Correcao:** remover `.yarn` do .dockerignore quando o projeto usa yarn berry.