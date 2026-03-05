---
name: rs-node-js-2023-docker-compose
description: "Applies Docker Compose configuration patterns when setting up PostgreSQL or other database containers for Node.js projects. Use when user asks to 'create docker compose', 'setup postgres container', 'configure database with docker', 'add docker to project', or 'setup dev environment'. Generates docker-compose.yml with correct service definitions, ports, and environment variables. Make sure to use this skill whenever creating or modifying Docker Compose files for Node.js applications. Not for Kubernetes, production deployments, or CI/CD pipeline configuration."
---

# Docker Compose para Desenvolvimento

> Traduza comandos `docker run` em arquivos `docker-compose.yml` declarativos que qualquer pessoa do time executa com um unico comando.

## Rules

1. **Crie o arquivo na raiz do projeto** — `docker-compose.yml` na mesma pasta do `package.json`, porque quem clonar o repositorio precisa encontrar imediatamente
2. **Nomeie servicos pelo contexto da aplicacao** — `api-solid-pg` nao `postgres`, porque projetos podem ter multiplos bancos e o nome precisa ser unico e descritivo
3. **Use `docker compose stop` para parar** — nunca `docker compose down` em desenvolvimento, porque `down` deleta o container e todos os dados (tabelas, registros), enquanto `stop` preserva o estado
4. **Sempre rode com flag `-d`** — `docker compose up -d` executa em background sem travar o terminal, porque o desenvolvedor precisa do terminal livre para outros comandos
5. **Apos recriar container, rode migrations** — `npx prisma migrate dev` ou equivalente, porque container novo significa banco vazio sem tabelas

## How to write

### docker-compose.yml basico com PostgreSQL

```yaml
version: '3'

services:
  api-solid-pg:
    image: bitnami/postgresql
    ports:
      - 5432:5432
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=ignitenode03
```

### Traducao de docker run para docker-compose

```bash
# ANTES: comando manual no README
docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=ignitenode03 -p 5432:5432 bitnami/postgresql

# DEPOIS: arquivo declarativo no repositorio
# docker-compose.yml (conteudo acima)
# Subir:  docker compose up -d
# Parar:  docker compose stop
```

## Example

**Before (instrucoes no README):**
```markdown
## Setup
Execute este comando para criar o banco:
docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=ignitenode03 -p 5432:5432 bitnami/postgresql
```

**After (docker-compose.yml no projeto):**
```yaml
version: '3'

services:
  api-solid-pg:
    image: bitnami/postgresql
    ports:
      - 5432:5432
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=ignitenode03
```
```markdown
## Setup
docker compose up -d
npx prisma migrate dev
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo com banco de dados | Crie `docker-compose.yml` junto com o projeto |
| Multiplos servicos (Redis, Postgres, etc) | Adicione todos no mesmo `docker-compose.yml` |
| Container parou e quer reiniciar | `docker compose up -d` (reusa container existente) |
| Container deletado acidentalmente | `docker compose up -d` + rodar migrations novamente |
| Nome do container conflitando | Pare e remova o antigo: `docker stop X && docker rm X` |
| `docker compose` nao encontrado | Tente `docker-compose` (com hifen) como alternativa |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `docker compose down` para parar em dev | `docker compose stop` (preserva dados) |
| `docker run` manual no README | `docker-compose.yml` declarativo no repo |
| `docker compose up` sem `-d` | `docker compose up -d` (background) |
| Esquecer migrations apos recriar container | Sempre `npx prisma migrate dev` apos container novo |
| Nomear servico genericamente como `db` | Nomear com contexto: `api-solid-pg` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-utilizando-o-docker-compose/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-utilizando-o-docker-compose/references/code-examples.md)
