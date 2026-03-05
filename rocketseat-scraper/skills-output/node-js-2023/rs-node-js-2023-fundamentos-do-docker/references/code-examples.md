# Code Examples: Fundamentos do Docker

## Nota sobre esta aula

Esta aula e conceitual/introdutoria — o instrutor nao mostra comandos Docker neste video especifico (ele menciona "vou te mostrar daqui a pouquinho" referindo-se a proxima aula). Os exemplos abaixo sao os comandos fundamentais que correspondem aos conceitos ensinados.

## Subindo servicos com Docker

### Postgres para desenvolvimento

```bash
# Criar e rodar um container Postgres
docker run --name my-app-postgres \
  -e POSTGRES_USER=docker \
  -e POSTGRES_PASSWORD=docker \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  -d postgres

# Verificar que esta rodando
docker ps

# Parar o container
docker stop my-app-postgres

# Remover completamente (dados e tudo)
docker rm my-app-postgres
```

### Redis para cache

```bash
docker run --name my-app-redis \
  -p 6379:6379 \
  -d redis
```

### MongoDB

```bash
docker run --name my-app-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=docker \
  -e MONGO_INITDB_ROOT_PASSWORD=docker \
  -p 27017:27017 \
  -d mongo
```

## Um container por projeto (conceito do instrutor)

```bash
# Projeto A — Postgres na porta 5432
docker run --name projeto-a-postgres \
  -e POSTGRES_PASSWORD=docker \
  -p 5432:5432 \
  -d postgres:15

# Projeto B — Postgres na porta 5433 (diferente!)
docker run --name projeto-b-postgres \
  -e POSTGRES_PASSWORD=docker \
  -p 5433:5432 \
  -d postgres:14

# Rodar simultaneamente ou separadamente
docker stop projeto-a-postgres
docker start projeto-b-postgres
```

## Ciclo de vida descartavel (conceito central da aula)

```bash
# 1. Criar e usar
docker run --name temp-postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

# 2. Trabalhar com o banco normalmente...
# Conectar via: postgresql://docker:docker@localhost:5432/postgres

# 3. Quando terminar, matar tudo — limpo, sem resquicios
docker stop temp-postgres
docker rm temp-postgres
# Pronto. Nenhum arquivo, config ou "lixo" ficou na maquina.
```

## Docker Compose (forma mais pratica para projetos)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: my-app-postgres
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: myapp
    ports:
      - '5432:5432'

  redis:
    image: redis:7
    container_name: my-app-redis
    ports:
      - '6379:6379'
```

```bash
# Subir todos os servicos
docker compose up -d

# Derrubar todos
docker compose down

# Derrubar e apagar volumes (dados)
docker compose down -v
```

## Comandos uteis do dia a dia

```bash
# Ver containers rodando
docker ps

# Ver todos (incluindo parados)
docker ps -a

# Ver logs de um container
docker logs my-app-postgres

# Entrar dentro do container
docker exec -it my-app-postgres bash

# Remover todos os containers parados
docker container prune
```