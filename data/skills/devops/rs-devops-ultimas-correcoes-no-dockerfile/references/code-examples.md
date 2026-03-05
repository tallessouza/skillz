# Code Examples: Correções de Dockerfile para Produção

## Exemplo 1: Dockerfile completo para NestJS

```dockerfile
# Imagem base leve
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os manifestos de dependência primeiro (cache de layers)
COPY package.json .
COPY package-lock.json .

# Instala apenas dependências de produção
RUN npm install --production

# Copia o código compilado
COPY dist/ ./dist/

# Expõe a porta da aplicação
EXPOSE 3000

# Usa start:prod que roda "node dist/main" diretamente
CMD ["npm", "run", "start:prod"]
```

## Exemplo 2: package.json — diferença entre scripts

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main"
  }
}
```

- `start` → usa `nest` CLI (devDependency) — NÃO funciona em produção
- `start:dev` → usa `nest` com watch — apenas desenvolvimento
- `start:prod` → usa `node` diretamente — funciona em produção

## Exemplo 3: Build e execução do container

```bash
# Build da imagem com tag versionada
docker build -t minha-app:v8 .

# Execução SEM volume (produção)
docker run -d --name minha-app --network minha-rede minha-app:v8

# Verificar se está rodando
docker ps
docker logs minha-app
```

## Exemplo 4: Comparação — com e sem volume

```bash
# DESENVOLVIMENTO: com volume (código local reflete no container)
docker run -d -v $(pwd):/app --name app-dev minha-app:dev

# PRODUÇÃO: sem volume (código está na imagem)
docker run -d --name app-prod --network minha-rede minha-app:v8
```

## Exemplo 5: Multi-stage build (extensão do conceito)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Produção
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
CMD ["npm", "run", "start:prod"]
```

Este padrão multi-stage garante que ferramentas de build (TypeScript compiler, NestJS CLI) existam apenas no stage de build, nunca na imagem final de produção.