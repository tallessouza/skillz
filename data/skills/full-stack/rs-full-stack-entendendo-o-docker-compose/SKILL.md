---
name: rs-full-stack-entendendo-o-docker-compose
description: "Applies Docker Compose best practices when creating multi-container applications. Use when user asks to 'create docker-compose', 'setup containers', 'run multiple services', 'configure docker', or 'add a database container'. Enforces one-responsibility-per-container, proper service dependencies, and YAML configuration patterns. Make sure to use this skill whenever setting up Docker environments with more than one container. Not for single Dockerfile builds, Kubernetes, or cloud deployment."
---

# Docker Compose — Aplicacoes Multi-Container

> Cada container tem uma unica responsabilidade; Docker Compose orquestra todos com um unico comando.

## Rules

1. **Nunca coloque API e banco de dados no mesmo container** — separe responsabilidades, porque cada servico tem ciclo de vida, escala e recursos diferentes
2. **Um arquivo docker-compose.yml define TODOS os containers** — porque gerenciar containers individuais nao escala e gera erros humanos
3. **Declare dependencias entre servicos** — use `depends_on` para garantir ordem de inicializacao, porque o banco precisa estar pronto antes da API
4. **Use Docker Images diretas quando nao precisa de customizacao** — Postgres, Redis, etc. nao precisam de Dockerfile, porque a imagem oficial ja resolve
5. **Use Dockerfile apenas quando precisa customizar o ambiente** — API Node, builds customizados, porque ai voce define especificacoes do seu codigo

## Decision framework

| Cenario | Abordagem |
|---------|-----------|
| Servico com codigo proprio (API Node) | Dockerfile + referencia no docker-compose.yml via `build:` |
| Servico de infraestrutura (Postgres, Redis) | Docker Image direto no docker-compose.yml via `image:` |
| 1 container apenas | `docker run` ou Dockerfile sozinho e suficiente |
| 2+ containers no projeto | Docker Compose obrigatorio |

## How to write

### Estrutura basica do docker-compose.yml

```yaml
version: '3'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - database

  database:
    image: postgres
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
```

### Quando adicionar mais containers

```yaml
services:
  api:
    build: .
    depends_on:
      - database
      - cache

  database:
    image: postgres

  cache:
    image: redis
```

## Example

**Before (gerenciamento manual de containers):**

```bash
# Terminal 1
docker run -p 5432:5432 -e POSTGRES_PASSWORD=docker postgres

# Terminal 2
docker build -t myapi .
docker run -p 3000:3000 myapi

# Precisa lembrar de iniciar cada um, na ordem certa
```

**After (com Docker Compose):**

```bash
# Um unico comando inicia tudo, na ordem correta
docker compose up
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo servico no projeto | Adicione como novo `service` no docker-compose.yml |
| Servico depende de outro | Declare `depends_on` explicitamente |
| Precisa de variavel de ambiente | Use `environment:` no servico correspondente |
| Precisa expor porta | Use `ports:` mapeando host:container |
| Servico usa codigo local | Use `build:` apontando para diretorio com Dockerfile |
| Servico usa imagem pronta | Use `image:` com nome da imagem |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| API + banco no mesmo container | Um container por responsabilidade |
| Rodar containers manualmente quando tem 2+ | Usar docker-compose.yml |
| Criar Dockerfile para Postgres/Redis | Usar `image: postgres` direto |
| Esquecer `depends_on` entre API e banco | Declarar dependencia explicita |
| Varios terminais para varios containers | `docker compose up` em um comando |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e motivacao do Docker Compose
- [code-examples.md](references/code-examples.md) — Exemplos de configuracao expandidos com variacoes