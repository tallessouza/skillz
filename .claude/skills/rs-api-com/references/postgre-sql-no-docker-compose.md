---
name: rs-api-com-bun-postgres-docker-compose
description: "Generates PostgreSQL Docker Compose configuration for Bun API projects. Use when user asks to 'setup database', 'add postgres with docker', 'create docker compose for db', 'configure local database', or 'add postgresql to project'. Applies Bitnami image, named volume, POSTGRESQL_* env vars. Make sure to use this skill whenever setting up PostgreSQL for local dev. Not for production databases, managed DB (RDS/Supabase), or non-PostgreSQL (use rs-devops)."
compatibility: "Requires Docker Desktop or Orbstack."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: setup
  tags: [docker, postgresql, docker-compose, database, local-dev]
---

# PostgreSQL no Docker Compose

> Docker Compose com Bitnami, volumes persistentes e variaveis padronizadas.

## Steps

```yaml
version: "3.7"
services:
  postgres:
    image: bitnami/postgresql:latest
    ports: ["5432:5432"]
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=app
    volumes: [postgres-data:/bitnami/postgresql]
volumes:
  postgres-data:
```

```bash
docker compose up -d
```

## Verification

- `docker ps` mostra container rodando
- Conexao: `postgresql://docker:docker@localhost:5432/app`

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Postgres direto na maquina | Docker |
| Sem volume | Volume nomeado |
| `POSTGRES_*` com Bitnami | `POSTGRESQL_*` |

## Troubleshooting

### Container reinicia em loop
**Fix:** `docker compose down -v && docker compose up -d` para limpar volume.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
