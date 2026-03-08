# Code Examples: Docker Containers — Resumo do Módulo

> Este módulo de encerramento não contém código no transcript. Os exemplos abaixo ilustram os três pilares mencionados pelo instrutor como referência rápida.

## 1. Container simples

```bash
# Rodar um container PostgreSQL
docker run --name my-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  -d postgres:16

# Verificar containers rodando
docker ps

# Parar e remover
docker stop my-postgres
docker rm my-postgres
```

## 2. Volumes para persistência

```bash
# Criar volume nomeado
docker volume create pgdata

# Rodar container com volume
docker run --name my-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  -v pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d postgres:16

# Dados persistem mesmo após remover o container
docker rm -f my-postgres
# Volume 'pgdata' ainda existe com os dados
docker volume ls
```

## 3. Docker Compose para múltiplos containers

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3333:3333"
    environment:
      - DATABASE_URL=postgresql://admin:secret@db:5432/myapp
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata:
```

```bash
# Subir todos os containers
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar tudo
docker-compose down

# Parar e remover volumes (CUIDADO: perde dados)
docker-compose down -v
```

## Variações comuns

### Adicionando Redis como cache

```yaml
services:
  api:
    build: .
    ports:
      - "3333:3333"
    depends_on:
      - db
      - cache

  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

### Dockerfile básico para API Node.js

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3333

CMD ["node", "src/server.js"]
```