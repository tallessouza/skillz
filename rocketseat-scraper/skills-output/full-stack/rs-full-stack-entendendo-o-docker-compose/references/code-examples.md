# Code Examples: Docker Compose

## Exemplo 1: API Node + Postgres (cenario basico)

```yaml
version: '3'

services:
  api:
    build: .
    ports:
      - "3333:3333"
    depends_on:
      - database
    environment:
      DATABASE_URL: postgresql://docker:docker@database:5432/myapp

  database:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: myapp
```

**Pontos importantes:**
- `api` usa `build: .` porque tem Dockerfile no diretorio
- `database` usa `image: postgres` direto, sem Dockerfile
- `depends_on` garante que o Postgres inicia antes da API
- Na `DATABASE_URL`, o host e `database` (nome do servico), nao `localhost`

## Exemplo 2: API + Postgres + Redis (3 containers)

```yaml
version: '3'

services:
  api:
    build: .
    ports:
      - "3333:3333"
    depends_on:
      - database
      - cache
    environment:
      DATABASE_URL: postgresql://docker:docker@database:5432/myapp
      REDIS_URL: redis://cache:6379

  database:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: myapp

  cache:
    image: redis
    ports:
      - "6379:6379"
```

## Exemplo 3: Com volumes persistentes

```yaml
version: '3'

services:
  database:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

**Por que volumes:** Sem volume, os dados do banco sao perdidos quando o container e removido. O volume persiste os dados entre recriações de container.

## Comandos essenciais

```bash
# Iniciar todos os containers
docker compose up

# Iniciar em background (detached)
docker compose up -d

# Parar todos os containers
docker compose down

# Ver logs de todos os servicos
docker compose logs

# Ver logs de um servico especifico
docker compose logs api

# Rebuild apos mudancas no Dockerfile
docker compose up --build
```

## Comparacao: Sem vs Com Docker Compose

### Sem Docker Compose (manual)

```bash
# Criar network para comunicacao
docker network create myapp-network

# Iniciar Postgres
docker run -d \
  --name database \
  --network myapp-network \
  -p 5432:5432 \
  -e POSTGRES_USER=docker \
  -e POSTGRES_PASSWORD=docker \
  -e POSTGRES_DB=myapp \
  postgres

# Build da API
docker build -t myapi .

# Iniciar API
docker run -d \
  --name api \
  --network myapp-network \
  -p 3333:3333 \
  -e DATABASE_URL=postgresql://docker:docker@database:5432/myapp \
  myapi
```

### Com Docker Compose (declarativo)

```yaml
# docker-compose.yml — tudo em um arquivo
version: '3'
services:
  api:
    build: .
    ports: ["3333:3333"]
    depends_on: [database]
    environment:
      DATABASE_URL: postgresql://docker:docker@database:5432/myapp
  database:
    image: postgres
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: myapp
```

```bash
# Um comando
docker compose up
```

A diferenca e clara: o Docker Compose transforma comandos imperativos em configuracao declarativa, reduzindo erro humano e simplificando o gerenciamento.