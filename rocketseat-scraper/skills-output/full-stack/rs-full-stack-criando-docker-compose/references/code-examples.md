# Code Examples: Criando Docker Compose para PostgreSQL

## Exemplo base da aula

O arquivo exato criado pelo instrutor:

```yaml
services:
  postgres:
    image: bitnami/postgresql:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: rocket-log
```

## Variação: Com volume persistente

Para manter dados entre reinicializações do container:

```yaml
services:
  postgres:
    image: bitnami/postgresql:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: rocket-log
    volumes:
      - postgres_data:/bitnami/postgresql

volumes:
  postgres_data:
```

## Variação: Porta alternativa (quando 5432 está em uso)

```yaml
services:
  postgres:
    image: bitnami/postgresql:latest
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: rocket-log
```

Neste caso, conectar via `localhost:5433` no host, mas o container internamente ainda usa `5432`.

## Variação: Com healthcheck

```yaml
services:
  postgres:
    image: bitnami/postgresql:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: rocket-log
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
```

## Variação: Usando imagem oficial do PostgreSQL

```yaml
services:
  postgres:
    image: postgres:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: rocket-log
```

A diferença principal: a imagem oficial usa `/var/lib/postgresql/data` para volumes, enquanto a Bitnami usa `/bitnami/postgresql`.

## Comandos de operação

```bash
# Subir o container em background
docker-compose up -d

# Ver logs do PostgreSQL
docker-compose logs -f postgres

# Parar o container
docker-compose down

# Parar e remover volumes (apaga dados)
docker-compose down -v

# Verificar status
docker-compose ps

# Conectar ao banco via psql
docker-compose exec postgres psql -U postgres -d rocket-log
```