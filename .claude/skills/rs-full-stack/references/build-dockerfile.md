---
name: rs-full-stack-build-dockerfile
description: "Applies Docker image build commands and workflows when working with Dockerfiles and container images. Use when user asks to 'build a docker image', 'create a container', 'run docker build', 'list docker images', or 'check running containers'. Enforces correct flag usage (-t for naming, -f for file, dot for default Dockerfile), tagging for versioning, and build verification steps. Make sure to use this skill whenever generating Docker build commands or troubleshooting image creation. Not for Docker Compose, orchestration, Kubernetes, or runtime container execution."
---

# Docker Build — Construir Imagens Docker

> Utilize `docker build` com flags corretas para criar imagens nomeadas, versionadas e verificaveis.

## Rules

1. **Sempre nomeie a imagem com `-t`** — `docker build -t api .` nao `docker build .`, porque imagens sem nome sao dificeis de identificar e gerenciar
2. **Use ponto (`.`) quando o Dockerfile tem nome padrao** — o Docker procura automaticamente por `Dockerfile` no diretorio atual, nao precisa de `-f` nesse caso
3. **Use `-f` apenas para Dockerfiles com nomes customizados** — `docker build -f Dockerfile.prod -t api .`, porque o flag so e necessario quando o nome nao e o padrao
4. **Nomes de imagem sem espacos** — use tracos ou underlines: `api-skillz` nao `api skillz`, porque Docker nao aceita espacos em nomes
5. **Use tags para versionamento** — `docker build -t api:1.0 .`, porque `latest` e a tag padrao e nao permite controle de versoes anteriores
6. **Verifique apos o build** — execute `docker image ls` para confirmar que a imagem foi criada com nome, tag e tamanho corretos

## Comandos essenciais

### Verificar estado atual

```bash
# Listar containers em execucao
docker ps

# Listar imagens disponiveis localmente
docker image ls
```

### Build da imagem

```bash
# Build com Dockerfile padrao (nome "Dockerfile" no diretorio atual)
docker build -t api .

# Build com Dockerfile customizado
docker build -t api -f Dockerfile.dev .

# Build com tag de versao
docker build -t api:1.0 .
```

### Limpar terminal

```bash
# Linux/Mac
ctrl+l  # ou clear

# Windows
cls
```

## Example

**Before (build sem boas praticas):**

```bash
docker build .
# Resultado: imagem sem nome, dificil de identificar
# docker image ls mostra <none> no REPOSITORY
```

**After (com esta skill aplicada):**

```bash
docker build -t api .
# Resultado: imagem nomeada "api" com tag "latest"

docker image ls
# REPOSITORY  TAG     IMAGE ID      CREATED        SIZE
# api         latest  abc123def     2 seconds ago  150MB
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dockerfile com nome padrao no diretorio | Use `.` sem `-f` |
| Dockerfile com nome customizado | Use `-f nome-do-arquivo` |
| Primeira versao da imagem | Use `-t nome:1.0` |
| Modificou a imagem e quer manter versao anterior | Incremente a tag: `nome:2.0` |
| Quer verificar se o build funcionou | Execute `docker image ls` |
| Nenhum container aparece no `docker ps` | Normal — imagem criada nao e container em execucao |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `docker build .` (sem nome) | `docker build -t minha-api .` |
| `docker build -t "api skillz" .` (espaco) | `docker build -t api-skillz .` |
| `-f Dockerfile` (nome padrao com -f) | Apenas `.` (Docker encontra automaticamente) |
| Nao verificar apos build | `docker image ls` para confirmar |
| Sempre usar `latest` sem versionar | Usar tags: `api:1.0`, `api:2.0` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre build, cache, e fluxo de etapas do Dockerfile
- [code-examples.md](references/code-examples.md) — Todos os exemplos de comandos Docker expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-build-dockerfile/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-build-dockerfile/references/code-examples.md)
