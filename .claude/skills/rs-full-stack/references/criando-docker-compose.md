---
name: rs-full-stack-criando-docker-compose
description: "Generates Docker Compose files with PostgreSQL configuration when setting up database infrastructure for Node.js projects. Use when user asks to 'create docker compose', 'setup postgres', 'configure database container', 'add docker to project', or 'initialize dev environment'. Applies Bitnami PostgreSQL image, port mapping, and environment variables. Make sure to use this skill whenever bootstrapping a new API project that needs a database. Not for Kubernetes deployments, multi-service orchestration, or production Docker configurations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: docker-tooling
  tags: [docker, docker-compose, postgresql, database, infrastructure]
---

# Criando Docker Compose para PostgreSQL

> Configure um banco de dados PostgreSQL via Docker Compose com imagem Bitnami, mapeamento de portas e variáveis de ambiente em um único arquivo YAML.

## Prerequisites

- Docker e Docker Compose instalados
- Se Docker não encontrado: instalar via `apt-get install docker.io docker-compose` ou Docker Desktop

## Steps

### Step 1: Criar o arquivo na raiz do projeto

Criar `docker-compose.yml` na raiz do projeto (mesmo nível do `package.json`).

### Step 2: Definir a estrutura do serviço PostgreSQL

```yaml
services:
  postgres:
    image: bitnami/postgresql:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: nome-da-aplicacao
```

### Step 3: Configurar as variáveis de ambiente

| Variável | Valor | Propósito |
|----------|-------|-----------|
| `POSTGRES_USER` | `postgres` | Usuário do banco |
| `POSTGRES_PASSWORD` | `postgres` | Senha do banco (apenas dev) |
| `POSTGRES_DB` | Nome da aplicação | Nome do banco de dados |

Nomear o banco com o nome da aplicação (ex: `rocket-log`, não `api` ou `db`), porque facilita identificação quando há múltiplos containers.

### Step 4: Mapear portas

```yaml
ports:
  - "5432:5432"
```

A porta à esquerda é do host (computador), a da direita é do container. Manter `5432:5432` para desenvolvimento local.

## Output format

Arquivo `docker-compose.yml` na raiz do projeto com serviço PostgreSQL usando imagem Bitnami.

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto novo sem banco | Criar `docker-compose.yml` com PostgreSQL |
| Nome do banco | Usar o nome da aplicação, não nomes genéricos |
| Imagem PostgreSQL | Usar `bitnami/postgresql:latest` |
| Porta já em uso (5432) | Mapear porta diferente no host: `"5433:5432"` |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `POSTGRES_DB: api` | `POSTGRES_DB: nome-da-aplicacao` |
| Indentação inconsistente no YAML | Usar 2 espaços, alinhar `image`, `ports`, `environment` no mesmo nível |
| Esquecer aspas no mapeamento de portas | `"5432:5432"` entre aspas |
| Usar imagem `postgres:latest` sem contexto | Usar `bitnami/postgresql:latest` (pré-configurada) |

## Error handling

- Se container não sobe: verificar se porta 5432 já está em uso com `lsof -i :5432`
- Se erro de indentação: alinhar `image`, `ports` e `environment` no mesmo nível sob o nome do serviço

## Verification

```bash
docker-compose up -d
docker-compose ps  # deve mostrar o container rodando
docker-compose logs postgres  # verificar se iniciou sem erros
```

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Container nao sobe com erro de porta | Porta 5432 ja em uso por outro processo | Verifique com `lsof -i :5432` e mate o processo ou mapeie outra porta (`"5433:5432"`) |
| Erro de indentacao no YAML | Tabs em vez de espacos ou alinhamento incorreto | Use 2 espacos, alinhe `image`, `ports`, `environment` no mesmo nivel |
| Container sobe mas conexao recusada | Banco ainda inicializando | Aguarde alguns segundos e verifique logs com `docker-compose logs postgres` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha da imagem Bitnami, indentacao YAML e boas praticas
- [code-examples.md](references/code-examples.md) — Exemplos completos com variacoes e cenarios adicionais