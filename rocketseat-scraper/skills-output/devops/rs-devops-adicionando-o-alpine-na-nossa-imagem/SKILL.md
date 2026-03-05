---
name: rs-devops-alpine-docker-image
description: "Applies Alpine base image optimization when building Docker images or writing Dockerfiles. Use when user asks to 'create a Dockerfile', 'optimize Docker image', 'reduce image size', 'build a container', or 'configure Docker'. Enforces Alpine variant selection, proper tagging, and cache-aware build practices. Make sure to use this skill whenever writing or reviewing Dockerfiles. Not for Docker Compose, orchestration, or Kubernetes configuration."
---

# Alpine em Imagens Docker

> Sempre use a variante Alpine da base image para reduzir drasticamente o tamanho da imagem sem sacrificar funcionalidade.

## Rules

1. **Use Alpine como base image padrao** — `node:18-alpine3.19` nao `node:18`, porque a reducao de tamanho e de ~120MB+ sem nenhuma alteracao de codigo
2. **Siga o padrao de nomenclatura** — sempre `{versao}-alpine` ou `{versao}-slim`, porque e um padrao universal de containers, nao especifico de Node
3. **Sempre use tags no build** — `docker build -t nome:v5 .` nao `docker build .`, porque tags permitem versionamento e rollback
4. **Entenda o mecanismo de cache** — se nao houve alteracao no Dockerfile ou na aplicacao, o Docker usa cache automaticamente, porque rebuilds desnecessarios desperdicam tempo
5. **Rebuild ao trocar base image** — ao mudar a base image, o cache e invalidado e o Docker faz pull da nova imagem, porque a cadeia de layers mudou completamente

## How to write

### Dockerfile com Alpine

```dockerfile
# Use a variante Alpine — menor e mais segura
FROM node:18-alpine3.19

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

### Build com tag versionada

```bash
# Sempre versione suas imagens
docker build -t api-rocket:v5 .
```

### Verificar reducao de tamanho

```bash
docker image ls api-rocket
# Compare tamanhos entre versoes (slim vs alpine)
```

## Example

**Before (imagem padrao slim):**
```dockerfile
FROM node:18-slim
# Resultado: ~597MB
```

**After (com Alpine):**
```dockerfile
FROM node:18-alpine3.19
# Resultado: ~473MB (reducao de ~124MB apenas trocando a base image)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao Node.js simples | Use `node:{version}-alpine{alpine-version}` |
| Outra tecnologia (Python, Go, etc.) | Mesmo padrao: `python:3.11-alpine`, `golang:1.21-alpine` |
| Build rodou muito rapido | Cache ativo — nenhuma alteracao detectada |
| Build faz pull de nova imagem | Base image mudou — cache invalidado, comportamento esperado |
| Precisa de libs nativas (gcc, etc.) | Alpine usa musl, pode precisar de `apk add` para dependencias |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `FROM node:18` (imagem completa) | `FROM node:18-alpine3.19` |
| `docker build .` (sem tag) | `docker build -t app:v1 .` |
| Rebuildar sem alteracao real | Confie no cache do Docker |
| Ignorar tamanho da imagem | Compare com `docker image ls` apos cada mudanca |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
