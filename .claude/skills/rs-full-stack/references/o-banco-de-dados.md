---
name: rs-full-stack-o-banco-de-dados
description: "Guides PostgreSQL setup with Docker for ORM-based development. Use when user asks to 'setup postgres', 'run postgres docker', 'switch from sqlite to postgres', 'configure database for ORM', or 'connect to postgres'. Ensures Docker container is running and connection is verified via Beekeeper or ORM tooling. Make sure to use this skill whenever setting up a PostgreSQL development environment with Docker. Not for production database deployment, database optimization, or SQL query writing."
---

# Setup PostgreSQL com Docker para ORM

> Antes de trabalhar com ORM e PostgreSQL, garanta que o container Docker esteja rodando e acessivel.

## Prerequisites

- Docker instalado e rodando na maquina
- Conhecimento basico de containers Docker
- Se nao tiver Docker: instalar via [docs.docker.com](https://docs.docker.com)

## Steps

### Step 1: Rodar o container PostgreSQL

```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### Step 2: Verificar que o container esta rodando

```bash
docker ps
```

Confirmar que a imagem `postgres` aparece na lista com status `Up`.

### Step 3: Testar a conexao

Conectar usando qualquer cliente PostgreSQL (Beekeeper, psql, ou ferramenta do ORM):

| Parametro | Valor |
|-----------|-------|
| Host | `localhost` |
| Porta | `5432` |
| Usuario | `postgres` |
| Senha | `postgres` |

### Step 4: Confirmar banco vazio

O banco tera apenas schemas internos do PostgreSQL (`pg_catalog`, `information_schema`). Isso e esperado — o ORM criara as tabelas.

## Output format

Container Docker rodando com PostgreSQL acessivel em `localhost:5432`, pronto para uso com ORM.

## Error handling

- Se `docker ps` nao mostra o container: rodar `docker start postgres`
- Se porta 5432 em uso: verificar com `lsof -i :5432` ou mudar a porta no comando docker (`-p 5433:5432`)
- Se conexao recusada: verificar se Docker Desktop esta rodando

## Verification

```bash
docker exec -it postgres psql -U postgres -c "SELECT 1;"
```

Deve retornar `1` sem erros.

## Heuristics

| Situacao | Acao |
|----------|------|
| Ja tem PostgreSQL nativo instalado | Pode usar o nativo, mas Docker isola melhor o ambiente |
| Precisa de versao especifica | Usar tag na imagem: `postgres:15` |
| Beekeeper instalado | Pode usar para verificar, mas ORM tera ferramenta propria |
| Migrando de SQLite para Postgres | Nao migrar dados — comecar banco limpo para aprendizado |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Instalar Postgres direto no OS para dev | Usar Docker container (isolamento, facilidade de reset) |
| Usar senha em branco em dev | Definir senha mesmo em local: `-e POSTGRES_PASSWORD=postgres` |
| Pular verificacao de conexao | Sempre testar conexao antes de comecar com ORM |
| Usar Beekeeper quando ORM tem ferramenta | Preferir a ferramenta do ORM para visualizar dados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a transicao SQLite → PostgreSQL
- [code-examples.md](references/code-examples.md) — Comandos Docker e conexao expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-o-banco-de-dados/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-o-banco-de-dados/references/code-examples.md)
