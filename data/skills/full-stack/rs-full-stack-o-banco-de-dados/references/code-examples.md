# Code Examples: Setup PostgreSQL com Docker para ORM

## Comando basico para rodar PostgreSQL no Docker

```bash
# Criar e rodar container PostgreSQL
docker run --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres
```

### Variacoes

```bash
# Com versao especifica
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Com volume persistente (dados sobrevivem ao container)
docker run --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  -d postgres

# Com porta diferente (se 5432 esta em uso)
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d postgres
```

## Verificar container rodando

```bash
# Listar containers ativos
docker ps

# Saida esperada (simplificada):
# CONTAINER ID   IMAGE      STATUS          PORTS                    NAMES
# abc123         postgres   Up 2 hours      0.0.0.0:5432->5432/tcp   postgres
```

## Gerenciar o container

```bash
# Parar o container
docker stop postgres

# Iniciar novamente
docker start postgres

# Remover completamente (perde dados se nao tem volume)
docker rm -f postgres

# Ver logs do container
docker logs postgres
```

## Testar conexao via linha de comando

```bash
# Usando psql dentro do container
docker exec -it postgres psql -U postgres

# Comando unico para verificar
docker exec -it postgres psql -U postgres -c "SELECT version();"
```

## Parametros de conexao para Beekeeper ou qualquer cliente

| Parametro | Valor padrao |
|-----------|-------------|
| Connection type | PostgreSQL |
| Host | `localhost` |
| Port | `5432` |
| User | `postgres` |
| Password | `postgres` |
| Default database | `postgres` |

## Docker Compose (alternativa mais organizada)

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres
    environment:
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
# Subir com compose
docker compose up -d

# Derrubar
docker compose down
```