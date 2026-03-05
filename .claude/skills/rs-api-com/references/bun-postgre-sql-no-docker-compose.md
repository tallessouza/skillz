---
name: rs-api-com-bun-postgres-docker-compose
description: "Generates PostgreSQL Docker Compose configuration for Bun/Node.js API projects. Use when user asks to 'setup database', 'add postgres', 'create docker compose', 'configure database with docker', or 'add a database to my project'. Applies Bitnami Postgres image, volume persistence, and environment variable conventions. Make sure to use this skill whenever setting up a PostgreSQL container for local development. Not for production database deployment, managed databases (RDS/Supabase), or non-PostgreSQL databases."
---

# PostgreSQL no Docker Compose

> Configurar PostgreSQL local com Docker Compose usando imagem Bitnami, volumes persistentes e variaveis de ambiente padronizadas.

## Prerequisites

- Docker Desktop instalado (ou Orbstack no macOS, porque inicializa containers mais rapido)
- Nenhum outro container usando porta 5432

## Steps

### Step 1: Criar docker-compose.yml na raiz do projeto

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

### Step 2: Subir o container

```bash
# Verificar se nenhum container conflitante esta rodando
docker ps

# Subir em modo detached
docker compose up -d
```

### Step 3: Verificar que o banco esta pronto

```bash
# Acompanhar logs ate ver "Database System is ready to accept connections"
docker logs $(docker ps -q --filter ancestor=bitnami/postgresql:latest) -f
```

## Output format

Arquivo `docker-compose.yml` na raiz do projeto com:
- Servico `postgres` usando `bitnami/postgresql:latest`
- Porta 5432:5432
- 3 variaveis de ambiente (USERNAME, PASSWORD, DATABASE)
- Volume nomeado para persistencia entre reinicializacoes

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo sem banco | Criar docker-compose.yml com este template |
| Ja existe docker-compose.yml | Adicionar servico postgres ao arquivo existente |
| Porta 5432 ocupada | Mapear para porta alternativa: `5433:5432` |
| macOS | Recomendar Orbstack como alternativa ao Docker Desktop |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar Postgres direto na maquina | Usar Docker para isolar o banco |
| Rodar sem volume | Sempre criar volume nomeado para persistir dados |
| Usar `POSTGRES_*` com imagem Bitnami | Usar `POSTGRESQL_*` (prefixo da Bitnami) |
| Hardcodar credenciais em codigo | Usar variaveis de ambiente no docker-compose |

## Error handling

- Se porta 5432 ocupada: `docker ps` para encontrar container conflitante, `docker stop <id>` antes de subir
- Se imagem nao baixa: verificar conexao com internet e Docker daemon rodando
- Se container reinicia em loop: verificar logs com `docker logs <id>` — geralmente permissao no volume

## Verification

- `docker ps` mostra container rodando
- Logs contem "Database System is ready to accept connections"
- Conexao funciona: `postgresql://docker:docker@localhost:5432/app`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-postgre-sql-no-docker-compose/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-postgre-sql-no-docker-compose/references/code-examples.md)
