---
name: rs-devops-persistindo-informacoes-nos-volumes
description: "Enforces Docker volume persistence patterns when writing docker run, docker-compose, or container orchestration code. Use when user asks to 'create a container', 'persist data', 'mount a volume', 'run docker', or 'set up a database container'. Applies rules: always mount volumes for stateful containers, never rely on container filesystem for persistence, verify mounts with docker inspect. Make sure to use this skill whenever generating Docker commands or docker-compose files with stateful services. Not for Dockerfile authoring, image building, or CI/CD pipeline configuration."
---

# Persistencia de Dados com Docker Volumes

> Sempre associe um volume ao executar containers que precisam persistir dados — o filesystem do container e efemero por definicao.

## Rules

1. **Sempre use `-v` ou `--mount` para dados persistentes** — `docker run -v meu-volume:/app/data`, porque sem volume os arquivos existem apenas enquanto o container roda com aquela configuracao
2. **Volume sobrevive ao container** — deletar ou recriar o container nao apaga o volume, porque volumes sao entidades independentes no Docker
3. **Sem volume = dados perdidos** — rodar `docker run` sem `-v` para um container que tinha volume significa que os arquivos do volume nao estarao acessiveis, porque o novo container nao sabe do volume anterior
4. **Verifique montagens com inspect** — `docker inspect <container>` mostra a secao `Mounts` confirmando se o volume esta associado, porque erros silenciosos de montagem sao comuns
5. **Volume persiste apos delete de arquivos internos** — mesmo deletando arquivos dentro do container, o volume mantem os dados para futuros containers que o referenciarem

## How to write

### Container com volume

```bash
# Criar volume
docker volume create app-data

# Rodar container COM volume — dados persistem
docker run -d -v app-data:/app/src -p 3000:3000 minha-imagem:v3

# Verificar que o volume esta montado
docker inspect <container-id> | grep -A 10 "Mounts"
```

### Container SEM volume (dados efemeros)

```bash
# Rodar container SEM volume — dados vivem apenas neste container
docker run -d -p 3000:3000 minha-imagem:v3

# Arquivos criados aqui desaparecem quando o container e removido
```

### Ciclo completo: criar, verificar, persistir

```bash
# 1. Entrar no container e criar arquivo
docker exec -it <container-id> bash
touch src/file.log
exit

# 2. Parar e recriar container COM mesmo volume
docker stop <container-id>
docker run -d -v app-data:/app/src -p 3000:3000 minha-imagem:v3

# 3. Verificar — arquivo continua existindo
docker exec -it <novo-container-id> bash
ls src/  # file.log esta aqui
```

## Example

**Before (dados perdidos ao recriar container):**

```bash
docker run -d -p 3000:3000 api-skillz:v3
docker exec -it abc123 bash
touch src/file.log    # criou arquivo
exit
docker stop abc123
docker run -d -p 3000:3000 api-skillz:v3   # SEM -v
docker exec -it def456 bash
ls src/               # file.log NAO existe
```

**After (dados persistem com volume):**

```bash
docker run -d -v app-volume:/app/src -p 3000:3000 api-skillz:v3
docker exec -it abc123 bash
touch src/file.log    # criou arquivo
exit
docker stop abc123
docker run -d -v app-volume:/app/src -p 3000:3000 api-skillz:v3  # COM -v
docker exec -it def456 bash
ls src/               # file.log EXISTE
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Banco de dados (Postgres, MySQL, Redis) | Sempre monte volume no datadir |
| Aplicacao stateless (API pura) | Volume opcional, apenas para logs se necessario |
| Ambiente de desenvolvimento local | Volume para hot-reload do codigo |
| Recriando container de producao | Sempre referenciar o mesmo volume nomeado |
| Debugging — arquivo sumiu | `docker inspect` para verificar se volume esta montado |
| Volume existe mas container nao ve | Verificar se `docker run` inclui `-v` apontando para ele |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `docker run -d app` (stateful sem volume) | `docker run -d -v data:/app/data app` |
| Confiar que arquivos sobrevivem sem volume | Sempre montar volume para dados importantes |
| `docker volume rm` sem backup | `docker run --rm -v vol:/data -v $(pwd):/backup alpine tar czf /backup/vol.tar.gz /data` |
| Recriar container esquecendo o `-v` | Documentar o comando completo com volume no docker-compose |
| Usar volumes anonimos para dados criticos | Usar volumes nomeados: `-v nome-explicito:/path` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-persistindo-informacoes-nos-volumes/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-persistindo-informacoes-nos-volumes/references/code-examples.md)
