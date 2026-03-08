---
name: rs-node-js-2023-setup-docker-compose
description: "Generates Docker Compose configurations for NestJS/Node.js projects with PostgreSQL. Use when user asks to 'setup docker', 'add postgres', 'create docker-compose', 'configure database with docker', or 'add a database container'. Applies correct volume mapping, environment variables, container naming, and port forwarding. Make sure to use this skill whenever setting up local development databases for Node.js projects. Not for Kubernetes, production deployment, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [docker, docker-compose, postgres, database, infrastructure, development]
---

# Setup Docker Compose para Desenvolvimento

> Configure servicos de infraestrutura local com Docker Compose para que todo o time compartilhe o mesmo ambiente de desenvolvimento.

## Rules

1. **Sempre use Docker Compose para dependencias de infraestrutura** — Postgres, Redis, Kafka, etc., porque facilita onboarding do time e garante ambiente identico para todos
2. **Defina container_name explicitamente** — nunca deixe o Docker gerar nome automatico, porque nomes gerados sao IDs ilegiveis que dificultam debug
3. **Mapeie volumes para persistir dados** — vincule a pasta de dados do container a uma pasta local, porque containers sao efemeros e dados se perdem ao deletar
4. **Use imagem oficial para desenvolvimento** — `postgres` (oficial) para dev, `bitnami/postgres` para producao, porque Bitnami tem camada extra de seguranca
5. **Redirecione portas explicitamente** — `5432:5432` mapeia porta do container para localhost, porque permite acesso direto ao banco via ferramentas locais
6. **Adicione `.data/` ao .gitignore** — pasta de volume local nao deve ir para o repositorio, porque contem dados do banco

## How to write

### docker-compose.yml completo

```yaml
version: "3.8"

services:
  postgres:
    container_name: {project-name}-pg
    image: postgres
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: {database-name}
      PGDATA: /data/postgres
    volumes:
      - ./.data/pg:/data/postgres
```

### Comandos de execucao

```bash
# Subir em background (modo detached)
docker compose up -d

# Verificar container rodando
docker ps

# Parar containers
docker compose down
```

## Example

**Before (sem Docker Compose):**
```bash
# Cada dev instala Postgres manualmente
# Configuracoes diferentes em cada maquina
# Onboarding lento e propenso a erros
```

**After (com Docker Compose):**
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

```bash
docker compose up -d
# Pronto — banco rodando em localhost:5432
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo com banco de dados | Crie docker-compose.yml antes de qualquer codigo |
| Multiplos servicos (Postgres + Redis) | Adicione cada um como service separado no mesmo arquivo |
| Producao | Use imagens Bitnami em vez das oficiais |
| Dados de dev nao importam | Volume e opcional, pode omitir |
| Time compartilha projeto | Volume recomendado para nao perder dados entre restarts |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar Postgres direto na maquina para dev | Use Docker Compose |
| Deixar container_name automatico | Defina `container_name: {projeto}-pg` |
| Commitar pasta `.data/` no git | Adicione `.data/` ao `.gitignore` |
| Usar mesma imagem em dev e prod | Dev: `postgres`, Prod: `bitnami/postgres` |
| Rodar sem flag `-d` | Use `docker compose up -d` para modo detached |

## Troubleshooting

### Container Postgres nao persiste dados apos docker compose down
**Symptom:** Dados do banco desaparecem ao recriar o container
**Cause:** Volume nao configurado ou mapeado para diretorio local
**Fix:** Adicione `volumes: ['./.data/pg:/data/postgres']` no service e defina `PGDATA: /data/postgres` no environment

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
