---
name: rs-devops-estrutura-de-um-dockerfile
description: "Enforces correct Dockerfile structure and instruction ordering when writing or reviewing Dockerfiles. Use when user asks to 'create a Dockerfile', 'dockerize an application', 'build a Docker image', 'containerize a project', or 'write a Dockerfile'. Applies rules: correct instruction order (FROM→WORKDIR→COPY→RUN→EXPOSE→CMD), package.json-first copy pattern, WORKDIR best practices, CMD array syntax, and image size awareness. Make sure to use this skill whenever generating or reviewing any Dockerfile. Not for docker-compose, Kubernetes manifests, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-fundamentos
  tags: [dockerfile, docker, build, workdir, cmd, entrypoint, layers, node-js]
---

# Estrutura de um Dockerfile

> Cada instrucao do Dockerfile segue uma ordem logica: base → diretorio → dependencias → codigo → build → exposicao → execucao.

## Rules

1. **Sempre defina WORKDIR** — nunca rode no diretorio raiz do SO, porque polui o filesystem base e dificulta manutencao
2. **WORKDIR cria diretorios automaticamente** — se o path nao existe, ele sera criado em tempo de build, nao precisa de `mkdir` antes
3. **Copie package.json ANTES do codigo** — `COPY package.json ./` antes de `RUN yarn`, porque isso permite cache de layers nas dependencias
4. **Use CMD com sintaxe de array** — `CMD ["yarn", "run", "start"]` nao `CMD yarn run start`, porque a forma exec evita problemas com signals do processo
5. **Sempre exponha portas com EXPOSE** — mesmo sendo documentacional, porque comunica a intencao da imagem para quem consome
6. **CMD e substituivel, ENTRYPOINT nao** — use CMD para comandos padrao que podem ser overridden via CLI, ENTRYPOINT para executaveis fixos
7. **Monitore o tamanho da imagem** — `docker image ls` apos build, porque imagens de 1GB indicam necessidade de otimizacao (multi-stage, .dockerignore)

## How to write

### Dockerfile basico para aplicacao Node.js

```dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"]
```

### Build da imagem

```bash
# Build com tag (Dockerfile na raiz)
docker build -t api-skillz .

# Build com arquivo customizado
docker build -t api-skillz -f Custom.Dockerfile .
```

### Verificacao pos-build

```bash
# Checar tamanho da imagem
docker image ls api-skillz

# Ver historico de layers
docker image history api-skillz
```

## Example

**Before (ordem errada, sem WORKDIR):**
```dockerfile
FROM node:18-slim
COPY . .
RUN yarn
RUN yarn run build
CMD yarn run start
```

**After (com esta skill aplicada):**
```dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao Node.js simples | Copie package.json primeiro, depois o resto |
| CLI nao disponivel na imagem base | Use `RUN apt-get install` ou `RUN apk add` antes de usar |
| Imagem resultante > 500MB | Investigue multi-stage build e .dockerignore |
| Precisa de comando fixo (nao substituivel) | Use ENTRYPOINT em vez de CMD |
| Dockerfile com nome customizado | Passe `-f nome.dockerfile` no build |

## Anti-patterns

| Nunca escreva | Escreva em vez |
|---------------|----------------|
| `COPY . .` antes de instalar deps | `COPY package.json ./` → `RUN yarn` → `COPY . .` |
| `CMD yarn run start` (shell form) | `CMD ["yarn", "run", "start"]` (exec form) |
| Rodar sem WORKDIR (raiz do SO) | `WORKDIR /usr/src/app` |
| Ignorar EXPOSE | `EXPOSE 3000` para documentar a porta |
| `RUN mkdir /app && cd /app` | `WORKDIR /app` (cria e define de uma vez) |

## Troubleshooting

### Build ignora cache e reinstala dependencias toda vez
**Symptom:** `docker build` demora muito porque `RUN yarn` executa novamente mesmo sem mudancas em dependencias
**Cause:** `COPY . .` esta antes de `RUN yarn`, invalidando o cache da layer de dependencias a cada mudanca de codigo
**Fix:** Copie `package.json` (e lockfile) primeiro, depois `RUN yarn`, e so entao `COPY . .` — assim o cache de dependencias e preservado

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
