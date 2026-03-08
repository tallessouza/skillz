---
name: rs-devops-entendendo-sobre-uma-imagem-base
description: "Applies Docker base image selection best practices with slim/alpine variants. Use when user asks to 'choose Docker base image', 'reduce Docker image size', 'use alpine or slim variant', or 'write FROM instruction'. Enforces specific version tags, slim/alpine variants over full images, official Docker Hub images, and FROM as first instruction. Make sure to use this skill whenever selecting or reviewing Docker base images in Dockerfiles. Not for multi-stage builds (use melhorias-e-otimizacoes-na-nossa-imagem) or Docker Compose configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-fundamentos
  tags: [docker, dockerfile, base-image, alpine, slim, from, image-size, vulnerabilities]
---

# Imagem Base Docker

> Sempre escolha a menor imagem base que satisfaca os requisitos da aplicacao.

## Rules

1. **Nunca use a tag generica sem variante** — `node:18-slim` nao `node:18` (400MB vs 70MB)
2. **Sempre especifique a versao na tag** — `node:18-slim` nao `node:slim`
3. **Prefira variantes slim ou alpine** — reduzem vulnerabilidades (92 para 19)
4. **Mapeie os pre-requisitos antes do Dockerfile** — runtime, deps, build, start
5. **Use imagens oficiais do Docker Hub** — selo "Docker Official Image"
6. **O FROM e sempre a primeira instrucao**

## How to write

```dockerfile
FROM node:18-slim

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn run build

CMD ["yarn", "run", "start"]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Node.js simples | `node:{version}-slim` ou `node:{version}-alpine` |
| Java | `eclipse-temurin:{version}-jre-alpine` |
| Python | `python:{version}-slim` |
| Go | Multi-stage com `scratch` ou `alpine` |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `FROM node` | `FROM node:18-slim` |
| `FROM node:latest` | `FROM node:22-slim` |
| `FROM node:18` (sem variante) | `FROM node:18-slim` |
| `FROM ubuntu` + `RUN apt install nodejs` | `FROM node:18-slim` |

## Troubleshooting

### Build falha com "package not found" ao usar alpine
**Symptom:** `npm install` ou `yarn` falha durante build com dependencia nativa nao encontrada
**Cause:** Imagem alpine nao inclui compiladores C/C++ e headers necessarios para modulos nativos
**Fix:** Adicionar `RUN apk add --no-cache python3 make g++` antes do `npm install` ou usar variante `-slim` em vez de `-alpine`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
