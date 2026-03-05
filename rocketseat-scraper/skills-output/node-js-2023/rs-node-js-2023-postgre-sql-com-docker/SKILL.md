---
name: rs-node-js-2023-postgre-sql-com-docker
description: "Applies PostgreSQL Docker container setup and Prisma migration workflow when user asks to 'setup database', 'run postgres', 'docker postgres', 'create container', 'prisma migrate', or 'configure database for Node.js project'. Covers Bitnami image security, port mapping, container lifecycle, and Prisma migration flow. Make sure to use this skill whenever setting up PostgreSQL with Docker for Node.js APIs. Not for production deployment, Docker Compose orchestration, or cloud-managed databases."
---

# PostgreSQL com Docker

> Rode PostgreSQL em containers Docker isolados usando imagens Bitnami (seguranca por padrao) e gerencie o schema com Prisma migrations.

## Rules

1. **Use imagem Bitnami, nao a oficial** — `bitnamilegacy/postgresql` em vez de `postgres`, porque Bitnami forca boas praticas de seguranca (proibe senha padrao, exige usuario nao-root)
2. **Sempre mapeie a porta explicitamente** — `-p 5432:5432`, porque containers sao isolados e sem port mapping o host nao consegue acessar o banco
3. **Nomeie containers pelo projeto** — `--name {app}-pg`, porque permite `docker start/stop` sem digitar o comando completo novamente
4. **Configure usuario e banco via variaveis ambiente** — `-e POSTGRESQL_USERNAME`, `-e POSTGRESQL_PASSWORD`, `-e POSTGRESQL_DATABASE` na criacao do container
5. **Use `docker start/stop` apos criacao** — nunca re-execute `docker run` para container existente, porque o Docker mantém containers em cache
6. **Rode `npx prisma migrate dev` para sincronizar schema** — porque o Prisma detecta diferencas entre o schema.prisma e o banco real, gerando migrations automaticamente

## How to write

### Comando Docker para criar container PostgreSQL

```bash
docker run --name {app}-pg \
  -e POSTGRESQL_USERNAME=docker \
  -e POSTGRESQL_PASSWORD=docker \
  -e POSTGRESQL_DATABASE={dbname} \
  -p 5432:5432 \
  bitnamilegacy/postgresql
```

### DATABASE_URL no .env

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/{dbname}?schema=public"
```

### Gerenciamento do container

```bash
# Listar containers rodando
docker ps

# Listar todos (incluindo parados)
docker ps -a

# Parar container
docker stop {app}-pg

# Iniciar container existente
docker start {app}-pg

# Ver logs
docker logs {app}-pg

# Seguir logs em tempo real
docker logs -f {app}-pg

# Remover container
docker rm {app}-pg
```

### Prisma migration

```bash
# Gerar e aplicar migration
npx prisma migrate dev

# Abrir interface visual do banco
npx prisma studio
```

## Example

**Antes (tentativa errada — re-executar docker run):**
```bash
# Container ja existe, vai dar erro de nome duplicado
docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker ...
```

**Depois (correto — usar start para container existente):**
```bash
docker start api-solid-pg
# Banco no ar em segundos
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeira vez configurando o banco | `docker run` com todas as variaveis ambiente |
| Iniciando trabalho no projeto | `docker start {app}-pg` |
| Verificar se container esta rodando | `docker ps` |
| Alterar schema.prisma | `npx prisma migrate dev` com nome descritivo |
| Visualizar dados no banco | `npx prisma studio` |
| Nao precisa mais do container | `docker rm {app}-pg` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `docker run` para container que ja existe | `docker start {nome}` |
| Usar imagem `postgres` oficial sem necessidade | Usar `bitnamilegacy/postgresql` |
| Esquecer `-p 5432:5432` | Sempre mapear porta explicitamente |
| Criar SQL manual para tabelas | `npx prisma migrate dev` gera automaticamente |
| Instalar PostgreSQL direto na maquina | Usar Docker para isolamento por projeto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
