---
name: rs-full-stack-efemeridade-na-pratica
description: "Enforces correct Docker container data persistence patterns when working with containers. Use when user asks to 'create a container', 'run docker', 'store data in container', 'persist database', or any Docker workflow. Applies ephemeral container principle: never store state inside containers, always use volumes. Make sure to use this skill whenever generating Docker commands or docker-compose files. Not for Dockerfile syntax, image building, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: docker
  tags: [ docker, containers, volumes, persistencia, docker-compose]
---

# Efemeridade de Containers na Prática

> Containers sao descartaveis — dados persistentes vivem em volumes, nunca dentro do container.

## Rules

1. **Nunca armazene dados dentro do container** — use volumes para qualquer dado que precisa sobreviver a uma recriacao, porque `docker run` cria um container novo com filesystem limpo
2. **Diferencie stop/start de rm/run** — `docker stop` + `docker start` preserva o filesystem do container, mas `docker rm` + `docker run` descarta tudo, porque sao operacoes fundamentalmente diferentes
3. **Use volumes para bancos de dados, uploads e configuracoes** — `docker run -v volume:/path`, porque dados dentro do container sao perdidos na recriacao
4. **Trate containers como cattle, nao pets** — containers devem ser recriados sem medo, porque a infraestrutura efemera e mais resiliente e reproducivel

## How to write

### Container com volume (padrao correto)

```bash
# Banco de dados com volume nomeado — dados sobrevivem a recriacao
docker run -d --name postgres \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:16

# Aplicacao com bind mount para uploads
docker run -d --name api \
  -v ./uploads:/app/uploads \
  myapi:latest
```

### Docker Compose com volumes

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data  # Volume nomeado
  app:
    image: myapp:latest
    volumes:
      - ./uploads:/app/uploads           # Bind mount

volumes:
  pgdata:  # Declaracao do volume nomeado
```

## Example

**Before (dados vao ser perdidos na recriacao):**

```bash
docker run -d --name mydb postgres:16
# Dados do banco vivem DENTRO do container
# docker rm mydb = banco perdido para sempre
```

**After (dados persistem independente do container):**

```bash
docker run -d --name mydb \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
# docker rm mydb + docker run ... = banco intacto
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Banco de dados (Postgres, MySQL, Mongo) | Sempre volume nomeado |
| Arquivos de upload do usuario | Bind mount ou volume nomeado |
| Cache temporario (Redis sem persistencia) | Pode ser efemero |
| Logs da aplicacao | Volume ou log driver externo |
| Codigo da aplicacao | Nunca em volume (vai no image build) |
| Configuracao sensivel (secrets) | Docker secrets ou env vars, nao volumes |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `docker exec ... touch arquivo.txt` para dados permanentes | Monte um volume e escreva la |
| Confiar que `docker stop/start` preserva dados para sempre | Use volumes — stop/start preserva, mas rm destroi |
| `docker run` sem volume para servicos com estado | `docker run -v volume:/data ...` |
| Backup copiando arquivos de dentro do container | Backup do volume: `docker run --rm -v vol:/data -v .:/backup alpine tar czf /backup/bkp.tar.gz /data` |
| Recriar container e perder banco de producao | Volumes nomeados + backup strategy |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Container recriado perde dados do banco | Sem volume montado no diretorio de dados | Use docker run -v pgdata:/var/lib/postgresql/data |
| docker-compose up recria containers limpos | Comportamento padrao — containers sao efemeros | Declare volumes: no docker-compose.yml |
| docker stop vs docker rm confusao | stop preserva filesystem, rm destroi | Use volumes para dados que devem sobreviver a rm |
| Backup de dados impossivel apos docker rm | Dados estavam apenas no filesystem do container | Faca backup do volume antes de remover o container |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre efemeridade, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes