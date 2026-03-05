---
name: rs-full-stack-utilizando-imagem-do-postgre-sql
description: "Applies Docker container creation from Docker Hub images without Dockerfile when user asks to 'run postgres', 'create a database container', 'docker run postgres', 'setup postgres with docker', or 'run a container from hub image'. Covers image selection criteria, environment variables, port mapping, and background execution. Make sure to use this skill whenever creating containers directly from Docker Hub images, especially PostgreSQL. Not for Dockerfile-based builds, docker-compose setups, or database administration."
---

# Criando Containers Direto do Docker Hub (PostgreSQL)

> Containers podem ser criados diretamente de imagens do Docker Hub via `docker run`, sem necessidade de Dockerfile.

## Rules

1. **Sempre avalie a imagem antes de usar** — verifique vulnerabilidades em Tags, frequencia de atualizacao e selo de imagem oficial, porque imagens desatualizadas ou vulneraveis comprometem seguranca
2. **Defina variaveis de ambiente com `-e`** — credenciais como `POSTGRES_USER` e `POSTGRES_PASSWORD` sao obrigatorias para o Postgres, porque sem elas o container falha ao iniciar
3. **Mapeie portas explicitamente com `-p`** — use `5432:5432` para Postgres, porque sem mapeamento a porta do container nao e acessivel na maquina host
4. **Sempre rode em background com `-d`** — porque sem essa flag o terminal fica preso ao processo do container
5. **Nomeie o container com `--name`** — use nomes descritivos como `db-postgres`, porque facilita gerenciamento e referencia em comandos futuros

## How to write

### Comando completo para PostgreSQL

```bash
docker run \
  --name db-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d \
  postgres
```

### Verificacao apos criacao

```bash
# Ver containers em execucao
docker ps

# Ver imagens baixadas
docker image ls
```

## Example

**Before (incompleto, sem boas praticas):**
```bash
docker run postgres
```

**After (com todas as flags necessarias):**
```bash
docker run \
  --name db-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d \
  postgres
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de container rapido sem customizacao | `docker run` direto com imagem do Hub |
| Precisa customizar o ambiente (instalar pacotes, copiar arquivos) | Use Dockerfile |
| Escolhendo entre imagens similares no Hub | Compare vulnerabilidades, frequencia de update e selo oficial |
| Porta padrao do servico ja esta ocupada | Mapeie para porta diferente no host: `-p 5433:5432` |
| Container para desenvolvimento local | Use `--name` descritivo e `-d` para background |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `docker run postgres` sem flags | Passe `--name`, `-e`, `-p`, `-d` explicitamente |
| Usar imagem sem verificar vulnerabilidades | Cheque a aba Tags no Docker Hub antes |
| Rodar sem `-d` em desenvolvimento | Sempre use `-d` para liberar o terminal |
| Deixar container sem nome | Use `--name` para facilitar `docker stop/start/rm` |
| Usar imagens com ultima atualizacao antiga | Prefira imagens com updates frequentes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre selecao de imagens e criterios de avaliacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de comando expandidos com variacoes