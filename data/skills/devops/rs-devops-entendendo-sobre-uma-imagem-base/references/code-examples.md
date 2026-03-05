# Code Examples: Imagem Base Docker

## Exemplo 1: Aplicacao NestJS (da aula)

A aplicacao usada na aula e um boilerplate NestJS gerado com:

```bash
npx @nestjs/cli@latest new api
```

Estrutura basica — um controller que referencia um service retornando "Hello World".

### Rodando localmente (sem container)

```bash
yarn run start
# ou
npm run start
```

### Pre-requisitos mapeados para o Dockerfile

```
1. Runtime: Node.js instalado no SO
2. Dependencias: yarn install (ou npm install)
3. Build: yarn run build (TypeScript → JavaScript)
4. Start: yarn run start (ou node dist/main.js)
```

## Exemplo 2: FROM com diferentes tags

### Imagem padrao (NAO recomendado)

```dockerfile
FROM node:18
# Resultado:
# - Tamanho: ~400MB
# - Vulnerabilidades: 92
# - Pacotes: ~800
# - Base images: 5 (incluindo Debian full + buildpack-deps)
```

### Imagem slim (RECOMENDADO para maioria dos casos)

```dockerfile
FROM node:18-slim
# Resultado:
# - Tamanho: ~70MB
# - Vulnerabilidades: 19
# - Pacotes: 344
# - Base images: 2 (Debian minimal + Node)
```

### Imagem alpine (menor possivel)

```dockerfile
FROM node:18-alpine
# Resultado:
# - Tamanho: ~50MB
# - Usa musl libc em vez de glibc
# - Atencao: algumas dependencias nativas podem nao funcionar
```

## Exemplo 3: Pesquisando imagens no Docker Hub

```
1. Acesse hub.docker.com
2. Pesquise pela tecnologia (ex: "node", "php", "python")
3. Procure pelo selo "Docker Official Image"
4. Clique na imagem e va em "Tags"
5. Compare tags:
   - node:18      → grande, muitos pacotes
   - node:18-slim  → medio, pacotes essenciais
   - node:18-alpine → pequeno, minimalista
6. Verifique: tamanho, numero de vulnerabilidades, base images
```

## Exemplo 4: Dockerfile basico para Node.js

```dockerfile
# Imagem base otimizada
FROM node:18-slim

# Copiar arquivos de dependencias primeiro (cache de camadas)
COPY package.json yarn.lock ./

# Instalar dependencias
RUN yarn install

# Copiar codigo fonte
COPY . .

# Buildar aplicacao TypeScript
RUN yarn run build

# Comando de inicializacao
CMD ["yarn", "run", "start"]
```

## Exemplo 5: Mapeamento para outras tecnologias

### Java (Spring Boot)

```dockerfile
# Runtime: JRE (nao precisa JDK em producao)
FROM eclipse-temurin:17-jre-alpine

COPY target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]
```

### Python (FastAPI)

```dockerfile
# Runtime: Python slim
FROM python:3.11-slim

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

### Go

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
COPY . .
RUN go build -o app .

# Runtime stage (imagem minima)
FROM alpine:3.18
COPY --from=builder /app .
CMD ["./app"]
```

## Exemplo 6: Nomeacao alternativa do Dockerfile

```bash
# Nome padrao (encontrado automaticamente)
Dockerfile

# Como extensao (precisa referenciar no build)
api.dockerfile

# Build com nome padrao
docker build .

# Build com nome customizado
docker build -f api.dockerfile .
```