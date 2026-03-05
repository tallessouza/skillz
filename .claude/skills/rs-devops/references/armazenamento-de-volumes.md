---
name: rs-devops-armazenamento-de-volumes
description: "Applies Docker volume configuration patterns when writing Docker Compose files or managing container storage. Use when user asks to 'create a docker compose', 'persist database data', 'add volumes to container', 'configure MySQL with Docker', or any container storage task. Ensures data persistence for stateful services like databases. Make sure to use this skill whenever configuring stateful containers in Docker Compose. Not for Kubernetes persistent volumes, host bind mounts for development, or application code changes."
---

# Armazenamento de Volumes no Docker

> Servicos stateful (bancos de dados) sempre precisam de volumes declarados no Docker Compose para persistir dados alem do ciclo de vida do container.

## Rules

1. **Sempre declare volumes para bancos de dados** — MySQL, PostgreSQL, MongoDB etc. perdem todos os dados quando o container para, porque o filesystem do container e efemero
2. **Declare volumes no nivel top-level do Compose** — volumes nomeados ficam gerenciados pelo Docker e persistem independentemente do container
3. **Use nomes descritivos para volumes** — `db` para database, nao nomes genericos, porque facilita identificacao com `docker volume ls`
4. **Aponte o volume para o diretorio de dados do servico** — cada banco tem seu path: MySQL usa `/var/lib/mysql`, PostgreSQL usa `/var/lib/postgresql/data`
5. **Nao associe volumes a servicos stateless** — APIs e aplicacoes sem estado nao precisam de volumes, porque nao ha dados para persistir

## How to write

### Volume para MySQL no Docker Compose

```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db:/var/lib/mysql
    networks:
      - app-network

volumes:
  db:
```

### Verificacao do volume

```bash
# Ver containers rodando
docker ps

# Inspecionar container e verificar montagem do volume
docker container inspect <container_id>

# Listar volumes
docker volume ls
```

## Example

**Before (sem volume — dados perdidos ao parar):**
```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
```

**After (com volume — dados persistidos):**
```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db:/var/lib/mysql

volumes:
  db:
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Servico e banco de dados | Sempre adicionar volume |
| Servico e API/app stateless | Nao adicionar volume |
| Precisa verificar se volume esta montado | `docker container inspect` e procurar secao "Mounts" |
| Nome do volume no inspect aparece com prefixo | Docker Compose prefixa com nome do projeto (ex: `api_db`) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Rodar MySQL sem volume | Declarar volume apontando para `/var/lib/mysql` |
| Usar path absoluto do host sem necessidade | Usar volume nomeado gerenciado pelo Docker |
| Declarar volume inline sem top-level | Declarar na secao `volumes:` top-level do Compose |
| Associar volume a container stateless | Reservar volumes para servicos com dados persistentes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-armazenamento-de-volumes/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-armazenamento-de-volumes/references/code-examples.md)
