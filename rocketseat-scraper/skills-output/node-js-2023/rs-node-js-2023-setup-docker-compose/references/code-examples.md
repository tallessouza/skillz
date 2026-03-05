# Code Examples: Setup Docker Compose

## Exemplo completo da aula

O arquivo `docker-compose.yml` criado na aula:

```yaml
version: "3.8"

services:
  postgres:
    container_name: nest-clean-pg
    image: postgres
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: nest-clean
      PGDATA: /data/postgres
    volumes:
      - ./.data/pg:/data/postgres
```

## Variacao: sem volume (mais simples)

Se persistencia nao importa:

```yaml
version: "3.8"

services:
  postgres:
    container_name: nest-clean-pg
    image: postgres
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: nest-clean
```

## Variacao: multiplos servicos

Quando o projeto cresce e precisa de Redis e outros:

```yaml
version: "3.8"

services:
  postgres:
    container_name: nest-clean-pg
    image: postgres
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: nest-clean
      PGDATA: /data/postgres
    volumes:
      - ./.data/pg:/data/postgres

  redis:
    container_name: nest-clean-redis
    image: redis:alpine
    ports:
      - 6379:6379
```

## Variacao: producao com Bitnami

```yaml
version: "3.8"

services:
  postgres:
    container_name: app-pg
    image: bitnami/postgresql:latest
    ports:
      - 5432:5432
    environment:
      POSTGRESQL_USERNAME: app_user
      POSTGRESQL_PASSWORD: secure_password
      POSTGRESQL_DATABASE: app_db
    volumes:
      - postgres_data:/bitnami/postgresql

volumes:
  postgres_data:
    driver: local
```

Nota: Bitnami usa nomes de variaveis diferentes (`POSTGRESQL_*` em vez de `POSTGRES_*`).

## Comandos de terminal

```bash
# Subir containers em background
docker compose up -d

# Verificar containers rodando
docker ps

# Ver logs do container
docker compose logs postgres

# Parar e remover containers
docker compose down

# Parar, remover containers E volumes
docker compose down -v

# Reconstruir sem cache
docker compose up -d --build --force-recreate
```

## .gitignore — adicionar pasta de dados

```gitignore
# Docker volumes
.data/
```

## Conexao via linha de comando

```bash
# Conectar ao Postgres dentro do container
docker exec -it nest-clean-pg psql -U postgres -d nest-clean

# Listar bancos
\l

# Listar tabelas
\dt

# Sair
\q
```