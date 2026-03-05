---
name: rs-full-stack-persistindo-volumes
description: "Enforces correct Docker volume usage for data persistence when writing Docker commands or docker-compose files. Use when user asks to 'create a container', 'persist data', 'docker run', 'docker-compose', or 'mount volume'. Applies rules: always separate container from volume, never store state inside containers, always use -v flag for persistent data. Make sure to use this skill whenever generating Docker run commands or compose files that involve any form of data storage. Not for Dockerfile creation, image building, or container networking."
---

# Persistindo Informações nos Volumes Docker

> Containers sao efemeros — dados persistentes vivem em volumes, nunca dentro do container.

## Rules

1. **Separe container de volume** — container = ambiente de execucao, volume = persistencia de dados, porque sao responsabilidades distintas e ciclos de vida independentes
2. **Sempre use -v ao rodar containers com dados** — `docker run -v meu-volume:/app/data` nao `docker run` sem volume, porque ao recriar o container sem volume os dados somem
3. **Nunca armazene estado dentro do container** — arquivos criados dentro do container sem volume sao perdidos ao parar/recriar, porque o filesystem do container e efemero
4. **Vincule o volume ao diretorio de trabalho correto** — o caminho do volume deve apontar para onde a aplicacao grava dados, porque um volume montado no path errado nao persiste nada

## How to write

### Docker run com volume

```bash
# Correto: container com volume vinculado
docker run -d -v meu-volume:/app/data minha-imagem

# Acessar o container
docker exec -it <container-id> /bin/sh

# Dados em /app/data persistem entre stop/start/recreate
```

### Docker Compose com volume

```yaml
services:
  app:
    image: minha-imagem
    volumes:
      - app-data:/app/data

volumes:
  app-data:
```

## Example

**Before (dados perdidos ao recriar):**

```bash
docker run -d minha-imagem
docker exec -it <id> /bin/sh
touch /app/data/test.txt   # arquivo criado dentro do container
# docker stop + docker run novamente = test.txt SUMIU
```

**After (dados persistidos com volume):**

```bash
docker run -d -v meu-volume:/app/data minha-imagem
docker exec -it <id> /bin/sh
touch /app/data/test.txt   # arquivo criado no volume
# docker stop + docker run -v meu-volume:/app/data = test.txt PERSISTE
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Container grava logs, uploads, ou banco de dados | Sempre montar volume no diretorio de dados |
| Container so executa codigo stateless (API pura) | Volume nao e necessario |
| Precisa recriar container (update de imagem) | Reusar o mesmo volume com -v |
| Ambiente de desenvolvimento local | Usar bind mount (`-v ./local:/app`) para hot reload |
| Producao com dados criticos | Usar named volumes gerenciados pelo Docker |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `docker run -d app` (com dados) | `docker run -d -v data-vol:/app/data app` |
| Criar arquivos importantes sem volume | Montar volume antes de gravar dados |
| `docker run` sem -v apos `docker stop` | `docker run -v mesmo-volume:/path` para manter dados |
| Backup copiando do container | Backup direto do volume (`docker cp` ou volume inspect) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao container vs volume, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de comandos Docker expandidos com variacoes