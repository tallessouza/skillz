# Code Examples: Criando Docker Compose

## Exemplo completo da aula

```yaml
version: "3.9"

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    image: node-js
    container_name: api
    ports:
      - "3333:3333"
    depends_on:
      - postgres

  postgres:
    image: bitnami/postgresql:latest
    container_name: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRESQL_USER: postgres
      POSTGRESQL_PASSWORD: postgres
      POSTGRESQL_DB: api
    volumes:
      - database:/var/lib/postgresql/data

volumes:
  database:
```

## .dockerignore atualizado

```
node_modules
docker-compose.yml
```

## Variacao: com imagem oficial do PostgreSQL

A aula usa `bitnami/postgresql`, mas a imagem oficial `postgres` usa nomes de variaveis diferentes:

```yaml
postgres:
  image: postgres:16-alpine
  container_name: postgres
  ports:
    - "5432:5432"
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: api
  volumes:
    - database:/var/lib/postgresql/data
```

## Variacao: com .env file

Em vez de hardcodar variaveis no docker-compose:

```yaml
postgres:
  image: bitnami/postgresql:latest
  container_name: postgres
  ports:
    - "5432:5432"
  env_file:
    - .env
  volumes:
    - database:/var/lib/postgresql/data
```

## Variacao: API com hot-reload (desenvolvimento)

```yaml
api:
  build:
    context: .
    dockerfile: Dockerfile
  container_name: api
  ports:
    - "3333:3333"
  depends_on:
    - postgres
  volumes:
    - .:/app
    - /app/node_modules
```

O volume `.:/app` sincroniza o codigo local com o container. O `/app/node_modules` evita sobrescrever as dependencias instaladas no container.

## Comandos para executar

```bash
# Subir todos os containers
docker compose up

# Subir em background (detached)
docker compose up -d

# Parar todos os containers
docker compose down

# Reconstruir imagens antes de subir
docker compose up --build

# Ver logs
docker compose logs -f

# Ver status dos containers
docker compose ps
```

## Equivalencia: manual vs docker-compose

O que antes era feito manualmente:
```bash
# Criar volume
docker volume create database

# Subir PostgreSQL
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRESQL_USER=postgres \
  -e POSTGRESQL_PASSWORD=postgres \
  -e POSTGRESQL_DB=api \
  -v database:/var/lib/postgresql/data \
  bitnami/postgresql:latest

# Build da API
docker build -t node-js .

# Subir API
docker run -d \
  --name api \
  -p 3333:3333 \
  node-js
```

Agora e apenas:
```bash
docker compose up
```