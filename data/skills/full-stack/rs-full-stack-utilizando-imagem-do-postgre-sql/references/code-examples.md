# Code Examples: Criando Containers Direto do Docker Hub

## Exemplo 1: Comando completo do PostgreSQL (da aula)

```bash
docker run \
  --name db-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d \
  postgres
```

## Exemplo 2: Verificacao de containers em execucao

```bash
# Listar containers rodando
docker ps

# Saida esperada (duas colunas relevantes):
# CONTAINER ID   IMAGE              ... PORTS                    NAMES
# abc123         postgres           ... 0.0.0.0:5432->5432/tcp   db-postgres
# def456         api-image          ... 0.0.0.0:3000->3000/tcp   api-container
```

## Exemplo 3: Verificacao de imagens baixadas

```bash
docker image ls

# Saida esperada:
# REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
# postgres     latest    abc123def456   2 hours ago    420MB
# api-image    latest    789ghi012jkl   3 days ago     180MB
```

## Variacoes

### Com porta diferente no host

```bash
docker run \
  --name db-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5433:5432 \
  -d \
  postgres
```

### Com banco de dados especifico

```bash
docker run \
  --name db-postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  -d \
  postgres
```

### Com versao especifica da imagem

```bash
docker run \
  --name db-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d \
  postgres:16
```

### Usando imagem Bitnami (alternativa mencionada na aula)

```bash
docker run \
  --name db-postgres \
  -e POSTGRESQL_USERNAME=postgres \
  -e POSTGRESQL_PASSWORD=postgres \
  -p 5432:5432 \
  -d \
  bitnami/postgresql
```

> Nota: Bitnami usa nomes de variavel diferentes (`POSTGRESQL_` em vez de `POSTGRES_`).

### Com volume para persistencia de dados

```bash
docker run \
  --name db-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d \
  postgres
```

## Comandos de gerenciamento pos-criacao

```bash
# Parar o container
docker stop db-postgres

# Iniciar novamente
docker start db-postgres

# Ver logs do container
docker logs db-postgres

# Remover o container (precisa estar parado)
docker rm db-postgres

# Acessar o shell do container
docker exec -it db-postgres bash

# Conectar ao PostgreSQL dentro do container
docker exec -it db-postgres psql -U postgres
```

## Pesquisando imagens no Docker Hub via CLI

```bash
# Buscar imagens de postgres
docker search postgres

# Buscar com limite de resultados
docker search --limit 5 postgres
```