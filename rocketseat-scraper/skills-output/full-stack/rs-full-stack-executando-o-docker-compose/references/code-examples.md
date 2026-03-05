# Code Examples: Executando o Docker Compose

## Comando principal

```bash
# Subir todos os servicos em background
docker compose up -d
```

## Verificacao completa

```bash
# Listar containers rodando
docker ps

# Saida esperada:
# CONTAINER ID   IMAGE        STATUS         PORTS                    NAMES
# abc123         node:20      Up 2 min       0.0.0.0:3333->3333/tcp   api
# def456         postgres     Up 2 min       0.0.0.0:5432->5432/tcp   postgres
```

## Listar imagens baixadas

```bash
docker images

# Saida esperada:
# REPOSITORY   TAG       IMAGE ID       SIZE
# node         20        xxx            1.1GB
# postgres     latest    yyy            412MB
```

## Testar API

```bash
# Via curl
curl http://localhost:3333

# Ou abrir no navegador: http://localhost:3333
```

## Testar banco de dados

```bash
# Via psql
psql -h localhost -p 5432 -U postgres

# Via Beekeeper Studio:
# Host: localhost
# Port: 5432
# User: postgres
# Password: postgres (mesma definida no docker-compose.yaml)
```

## Variacoes uteis

### Subir com logs visiveis (debug)

```bash
# Foreground — logs aparecem no terminal, Ctrl+C para containers
docker compose up
```

### Subir forcando rebuild

```bash
# Util quando mudou o Dockerfile ou codigo fonte
docker compose up -d --build
```

### Ver logs de containers em background

```bash
# Todos os servicos
docker compose logs -f

# Apenas um servico
docker compose logs -f api
docker compose logs -f postgres
```

### Derrubar todos os containers

```bash
# Para e remove containers
docker compose down

# Para, remove containers E volumes (cuidado: perde dados do banco)
docker compose down -v
```

### Reiniciar um servico especifico

```bash
docker compose restart api
```

### Ver status dos servicos

```bash
docker compose ps
```

## Exemplo de docker-compose.yaml referenciado na aula

```yaml
services:
  api:
    container_name: api
    build: .
    ports:
      - "3333:3333"
    depends_on:
      - postgres

  postgres:
    container_name: postgres
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
```

## Checklist pos-execucao

```bash
# 1. Containers rodando?
docker ps

# 2. API responde?
curl -s -o /dev/null -w "%{http_code}" http://localhost:3333

# 3. Banco aceita conexao?
pg_isready -h localhost -p 5432 -U postgres
```