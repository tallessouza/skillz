---
name: rs-next-js-entendendo-docker-compose
description: "Applies Docker Compose best practices when writing or reviewing docker-compose.yml files. Use when user asks to 'create a docker-compose', 'add a database service', 'configure postgres container', 'setup docker for development', or any container orchestration task. Enforces correct structure: version, services, image pinning, restart policies, port mapping, environment variables, and persistent volumes. Make sure to use this skill whenever generating or modifying docker-compose files. Not for Dockerfile creation, Kubernetes configs, or production deployment orchestration."
---

# Docker Compose — Estrutura e Boas Praticas

> Todo docker-compose.yml segue uma receita: version, services, configuracoes de cada servico, e volumes para persistencia.

## Rules

1. **Sempre defina version** — instrui o Docker sobre o formato do arquivo, porque versoes diferentes suportam features diferentes
2. **Nomeie servicos pelo que sao** — `postgres`, `redis`, `app`, nao `db1` ou `service-a`, porque facilita identificacao ao listar containers
3. **Fixe versao da imagem** — `postgres:17` nao `postgres:latest`, porque garante reprodutibilidade e evita quebras silenciosas
4. **Use container_name explicito** — facilita encontrar o container em clientes Docker e comandos CLI
5. **Configure restart: always** — garante que o servico reinicie automaticamente se parar, porque banco de dados precisa estar sempre de pe
6. **Mapeie portas explicitamente** — `5432:5432` (host:container) e como abrir uma janela para acessar o servico de fora do container
7. **Declare volumes para persistencia** — containers sao descartaveis, dados nao. Volumes criam uma "gaveta persistente" que sobrevive a recriacao do container
8. **Variaveis de ambiente configuram o servico** — usuario, senha, nome do banco vao em `environment`, porque sao usadas na primeira execucao

## How to write

### Servico de banco de dados basico

```yaml
version: '3'

services:
  postgres:
    image: postgres:17
    container_name: petshop-pg
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: petshop
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Multiplos servicos

```yaml
version: '3'

services:
  postgres:
    image: postgres:17
    container_name: myapp-pg
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: myapp-redis
    restart: always
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

## Example

**Before (problemas comuns):**

```yaml
services:
  db:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: secret
```

**After (com esta skill aplicada):**

```yaml
version: '3'

services:
  postgres:
    image: postgres:17
    container_name: project-pg
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: projectdb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Servico de banco de dados | Sempre adicione volume para persistencia |
| Projeto de desenvolvimento local | Use `restart: always` para nao precisar subir manualmente |
| Porta ja em uso no host | Mude apenas a porta do host: `5433:5432` |
| Multiplos projetos na mesma maquina | Use container_name unico por projeto |
| Dados sensiveis em producao | Use secrets do Docker, nao environment direto |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `image: postgres` (sem tag) | `image: postgres:17` |
| Servico sem volume para dados | Volume nomeado + declaracao em `volumes:` |
| `db` ou `service1` como nome | Nome descritivo: `postgres`, `redis`, `app` |
| Sem `restart` policy | `restart: always` para servicos criticos |
| Porta hardcoded sem comentario | Comentar o mapeamento host:container |
| Sem `container_name` | `container_name: projeto-servico` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
