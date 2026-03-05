---
name: rs-devops-imagem-base
description: "Applies Docker base image selection best practices when writing Dockerfiles or containerizing applications. Use when user asks to 'create a Dockerfile', 'dockerize an application', 'choose a base image', 'optimize Docker image size', or 'reduce container vulnerabilities'. Enforces slim/alpine image variants, proper FROM tag selection, and image size awareness. Make sure to use this skill whenever generating or reviewing Dockerfiles. Not for Kubernetes deployment, docker-compose orchestration, or CI/CD pipeline configuration."
---

# Imagem Base Docker

> Sempre escolha a menor imagem base que satisfaca os requisitos da aplicacao, porque cada pacote desnecessario e uma vulnerabilidade a mais e bytes desperdicados.

## Rules

1. **Nunca use a tag generica sem variante** — `node:18-slim` nao `node:18`, porque a imagem padrao inclui centenas de pacotes desnecessarios (800+ pacotes vs 344) e triplica o tamanho (400MB vs 70MB)
2. **Sempre especifique a versao na tag** — `node:18-slim` nao `node:slim` ou `node:latest`, porque versoes implicitas quebram builds quando a imagem upstream atualiza
3. **Prefira variantes slim ou alpine** — porque reduzem vulnerabilidades drasticamente (92 → 19 no exemplo Node 18) e reduzem superficie de ataque
4. **Mapeie os pre-requisitos antes de escrever o Dockerfile** — identifique: runtime necessario, comando de instalacao de dependencias, comando de build, comando de start
5. **Use imagens oficiais do Docker Hub** — procure pelo selo "Docker Official Image", porque sao mantidas e auditadas pela Docker
6. **O FROM e sempre a primeira instrucao** — ele define o sistema operacional + runtime que sera a fundacao do container

## How to write

### Mapeamento mental antes do Dockerfile

```
# Antes de escrever, responda:
# 1. Qual runtime? → Node, Java, Python, Go...
# 2. Instalar dependencias? → npm install, yarn, pip install...
# 3. Precisa buildar? → npm run build, mvn package, go build...
# 4. Comando de start? → npm run start, java -jar, python app.py...
```

### FROM com imagem otimizada

```dockerfile
# CORRETO: versao especifica + variante slim
FROM node:18-slim

# CORRETO: versao especifica + variante alpine (ainda menor)
FROM node:18-alpine
```

### Estrutura base de um Dockerfile Node.js

```dockerfile
FROM node:18-slim

# 1. Instalar dependencias
COPY package.json yarn.lock ./
RUN yarn install

# 2. Copiar codigo e buildar
COPY . .
RUN yarn run build

# 3. Comando de start
CMD ["yarn", "run", "start"]
```

## Example

**Before (imagem base generica):**
```dockerfile
FROM node:18
# ~400MB, 92 vulnerabilidades, 800+ pacotes
```

**After (com esta skill aplicada):**
```dockerfile
FROM node:18-slim
# ~70MB, 19 vulnerabilidades, 344 pacotes
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao Node.js simples | `node:{version}-slim` ou `node:{version}-alpine` |
| Aplicacao Java | `eclipse-temurin:{version}-jre-alpine` (sem JDK em producao) |
| Aplicacao Python | `python:{version}-slim` |
| Aplicacao Go | Multi-stage com `scratch` ou `alpine` no estagio final |
| Precisa de ferramentas de debug | Use slim em dev, alpine em producao |
| Imagem nao esta no Docker Hub | Procure pelo nome da tecnologia no hub.docker.com |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `FROM node` | `FROM node:18-slim` |
| `FROM node:latest` | `FROM node:22-slim` (versao explicita) |
| `FROM node:18` (sem variante) | `FROM node:18-slim` |
| `FROM ubuntu` + `RUN apt install nodejs` | `FROM node:18-slim` (imagem oficial ja tem tudo) |
| Dockerfile sem saber os pre-requisitos | Mapeie runtime → deps → build → start primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-entendendo-sobre-uma-imagem-base/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-entendendo-sobre-uma-imagem-base/references/code-examples.md)
