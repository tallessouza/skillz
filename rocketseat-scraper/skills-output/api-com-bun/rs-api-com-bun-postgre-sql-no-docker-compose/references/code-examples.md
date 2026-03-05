# Code Examples: PostgreSQL no Docker Compose

## Exemplo completo do docker-compose.yml da aula

```yaml
version: "3.7"

services:
  postgres:
    image: bitnami/postgresql:latest
    ports:
      - "5432:5432"
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=app
    volumes:
      - postgres-data:/bitnami/postgresql

volumes:
  postgres-data:
```

## Comandos executados na aula (sequencia exata)

```bash
# 1. Verificar containers rodando
docker ps

# 2. Parar container conflitante (se houver)
docker stop <container-id>

# 3. Subir o container em background
docker compose up -d

# 4. Verificar logs para confirmar que banco esta pronto
docker logs <container-id> -f
# Esperar: "Database System is ready to accept connections"
```

## Variacao: imagem oficial do Postgres (nao Bitnami)

Se preferir a imagem oficial em vez da Bitnami:

```yaml
version: "3.7"

services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=docker
      - POSTGRES_PASSWORD=docker
      - POSTGRES_DB=app
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

**Diferencas:**
- Variaveis: `POSTGRES_*` ao inves de `POSTGRESQL_*`
- Path de dados: `/var/lib/postgresql/data` ao inves de `/bitnami/postgresql`
- Imagem: `postgres:16-alpine` ao inves de `bitnami/postgresql:latest`

## Variacao: com porta alternativa (quando 5432 esta ocupada)

```yaml
services:
  postgres:
    image: bitnami/postgresql:latest
    ports:
      - "5433:5432"  # Host usa 5433, container continua 5432
    # ...
```

Connection string neste caso: `postgresql://docker:docker@localhost:5433/app`

## Variacao: com healthcheck

```yaml
services:
  postgres:
    image: bitnami/postgresql:latest
    ports:
      - "5432:5432"
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=app
    volumes:
      - postgres-data:/bitnami/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U docker -d app"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

Util quando outros servicos dependem do banco estar pronto (ex: `depends_on` com `condition: service_healthy`).

## Connection string resultante

```
postgresql://docker:docker@localhost:5432/app
```

Formato: `postgresql://<user>:<password>@<host>:<port>/<database>`

## Comandos uteis de gerenciamento

```bash
# Parar container sem destruir volume
docker compose down

# Parar e destruir volume (reset completo do banco)
docker compose down -v

# Ver volumes existentes
docker volume ls

# Acessar psql dentro do container
docker compose exec postgres psql -U docker -d app
```