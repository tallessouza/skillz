---
name: rs-devops-alpine-e-stretch
description: "Enforces container image optimization by selecting the leanest base image (Alpine over Debian/Slim). Use when user asks to 'create a Dockerfile', 'optimize container', 'reduce image size', 'choose base image', or 'build Docker image'. Applies rules: Alpine over Slim over full Debian, minimal packages, no unnecessary OS tools, container runs only the application binary. Make sure to use this skill whenever writing or reviewing Dockerfiles. Not for application code, CI/CD pipelines, or Docker Compose orchestration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-images
  tags: [docker]
---

# Otimizacao de Imagens Docker — Alpine vs Debian

> Escolha sempre a base image mais enxuta possivel: a responsabilidade do container e executar o binario da aplicacao e nada mais.

## Rules

1. **Prefira Alpine como base image** — `node:18-alpine` nao `node:18`, porque Alpine tem ~43MB vs ~1GB do Debian puro, eliminando pacotes e vulnerabilidades desnecessarias
2. **Container executa apenas o binario** — comandos como `ls`, `cat`, `touch` nao deveriam ser necessarios em producao, porque qualquer coisa alem da aplicacao e desperdicio de espaco e superficie de ataque
3. **Minimize pacotes instalados** — menos pacotes = menos vulnerabilidades (Alpine: ~240 pacotes, Debian puro: ~800 pacotes)
4. **Use .dockerignore** — nunca envie `node_modules`, `.git`, arquivos de teste para o container, porque inflam a imagem sem necessidade
5. **Conheca a hierarquia de tags** — Alpine < Slim < Stretch/Buster/Jessie < puro, porque cada nivel adiciona pacotes e vulnerabilidades

## Hierarquia de base images

| Tag | Base | Tamanho (Node 18) | Pacotes | Vulnerabilidades |
|-----|------|-------------------|---------|------------------|
| `18` (pura) | Debian | ~1GB | ~800 | ~100 (criticas) |
| `18-slim` | Debian minimal | ~130MB | ~400 | Apenas low |
| `18-alpine3.19` | Alpine Linux | ~43MB | ~240 | Nenhuma |

## How to write

### Dockerfile otimizado com Alpine

```dockerfile
# Sempre especifique a versao do Alpine
FROM node:18-alpine3.19

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Example

**Before (imagem pesada com Debian puro):**
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

**After (otimizado com Alpine):**
```dockerfile
FROM node:18-alpine3.19
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "dist/main.js"]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao Node/Python/Java simples | Use Alpine |
| Precisa de dependencias nativas (gcc, make) | Use Alpine + `apk add` apenas o necessario |
| Alpine causa incompatibilidade (musl vs glibc) | Use Slim como fallback |
| Ambiente de desenvolvimento local | Debian puro e aceitavel |
| Producao | Alpine sempre, sem excecao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `FROM node:18` (tag pura) | `FROM node:18-alpine3.19` |
| `FROM node:latest` | Especifique versao: `FROM node:18-alpine3.19` |
| `COPY . .` antes de `npm install` | `COPY package*.json` primeiro, depois `COPY . .` |
| Instalar pacotes de debug em producao | Remova devDependencies com `npm ci --only=production` |
| Usar Stretch/Buster/Jessie achando que e otimizado | Sao releases do Debian, nao otimizadas — use Alpine |

## Glossario rapido

| Termo | Significado |
|-------|-------------|
| **Alpine** | Distro Linux super enxuta, sem GUI, ideal para containers |
| **Slim** | Versao minima do Debian, intermediaria entre puro e Alpine |
| **Stretch/Buster/Jessie/Bookworm** | Codinomes de releases do Debian (nao sao otimizacoes) |
| **Bullseye** | Release atual do Debian |

## Troubleshooting

### Aplicacao funciona localmente mas falha no container Alpine
**Symptom:** Erro de segfault ou library not found ao rodar aplicacao no Alpine
**Cause:** Dependencias nativas compiladas com glibc sao incompativeis com musl libc do Alpine
**Fix:** Use `node:18-slim` como fallback ou instale pacotes necessarios com `apk add` no Dockerfile

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-alpine-e-stretch/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-alpine-e-stretch/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
