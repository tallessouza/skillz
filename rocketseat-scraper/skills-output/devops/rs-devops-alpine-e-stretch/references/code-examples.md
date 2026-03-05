# Code Examples: Alpine e Stretch

## Comparacao de Dockerfiles por base image

### Dockerfile com node:18 (NAO recomendado)

```dockerfile
# ~1GB, ~800 pacotes, ~100 vulnerabilidades
FROM node:18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
```

**Problemas:**
- Imagem enorme (~1GB)
- Copia tudo (sem .dockerignore)
- `npm install` inclui devDependencies
- Centenas de pacotes desnecessarios e vulnerabilidades

### Dockerfile com node:18-slim (intermediario)

```dockerfile
# ~130MB, ~400 pacotes, vulnerabilidades apenas low
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

**Melhoria:** Debian minimal, metade dos pacotes, sem vulnerabilidades criticas.

### Dockerfile com node:18-alpine (recomendado)

```dockerfile
# ~43MB, ~240 pacotes, zero vulnerabilidades
FROM node:18-alpine3.19

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

**Melhor opcao:** Menor tamanho, menos pacotes, zero vulnerabilidades.

## Quando Alpine precisa de dependencias nativas

Algumas bibliotecas Node (como `bcrypt`, `sharp`) precisam de compilacao nativa. No Alpine, `glibc` nao esta disponivel (usa `musl`), entao pode ser necessario:

```dockerfile
FROM node:18-alpine3.19

# Instalar apenas o necessario para compilacao
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Remover dependencias de build apos instalacao
RUN apk del python3 make g++

COPY . .

CMD ["node", "dist/main.js"]
```

## Multi-stage build com Alpine (padrao avancado)

```dockerfile
# Stage 1: Build
FROM node:18-alpine3.19 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine3.19

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**Vantagem:** O stage de build pode ter devDependencies (TypeScript, etc), mas a imagem final so tem o necessario para rodar.

## .dockerignore (mencionado como prerequisito)

```dockerignore
node_modules
.git
.gitignore
*.md
.env
.env.*
dist
coverage
.vscode
```

## Verificando tamanho da imagem

```bash
# Listar imagens com tamanho
docker images

# Comparar tags
docker images | grep node

# Inspecionar camadas
docker history node:18-alpine3.19
```

## Checando vulnerabilidades (Docker Scout)

```bash
# Scan basico
docker scout cves node:18
docker scout cves node:18-slim
docker scout cves node:18-alpine3.19
```