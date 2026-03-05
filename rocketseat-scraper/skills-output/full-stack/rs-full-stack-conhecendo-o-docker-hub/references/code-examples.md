# Code Examples: Docker Hub — Selecao de Imagens

## Exemplo 1: Aplicacao Node.js

Cenario do instrutor: "Quero criar um container pra rodar uma aplicacao Node"

### Busca no Docker Hub
1. Pesquisar: `node`
2. Filtrar: Docker Official Image
3. Tag escolhida: `18-alpine`

### Uso no Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

## Exemplo 2: Banco de dados PostgreSQL

```dockerfile
FROM postgres:16-alpine

ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydb
```

## Exemplo 3: Banco de dados MySQL

```dockerfile
FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=mydb
```

## Exemplo 4: Machine Learning com TensorFlow

```dockerfile
FROM tensorflow/tensorflow:2.15.0-gpu

WORKDIR /workspace
COPY requirements.txt .
RUN pip install -r requirements.txt
```

## Exemplo 5: Python API

```dockerfile
# Alpine para APIs simples
FROM python:3.12-alpine

# Slim quando precisa de compilacao nativa
FROM python:3.12-slim
```

## Comparacao de variantes (tamanho)

| Imagem | Tamanho aprox. | Quando usar |
|--------|---------------|-------------|
| `node:18` | ~350MB | Desenvolvimento, precisa de ferramentas completas |
| `node:18-slim` | ~180MB | Producao com dependencias nativas |
| `node:18-alpine` | ~120MB | Producao sem dependencias nativas |

## Docker Compose com imagens oficiais

```yaml
services:
  api:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    command: npm run dev

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## Verificando imagem antes de usar (CLI)

```bash
# Buscar imagens no Docker Hub via CLI
docker search node --filter is-official=true

# Ver tags disponiveis (requer jq)
curl -s "https://hub.docker.com/v2/repositories/library/node/tags?page_size=10" | jq '.results[].name'

# Inspecionar imagem antes de baixar
docker manifest inspect node:18-alpine
```