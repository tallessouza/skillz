---
name: rs-devops-ultimas-correcoes-dockerfile
description: "Applies Dockerfile production-readiness corrections when building Node.js/NestJS container images. Use when user asks to 'fix Dockerfile', 'prepare container for production', 'optimize Docker build for Node', or 'run NestJS in production container'. Ensures package.json is copied and start script uses node instead of nest CLI. Make sure to use this skill whenever reviewing or creating Dockerfiles for NestJS/Node.js apps. Not for Docker Compose, orchestration, or volume configuration."
---

# Correções de Dockerfile para Produção (Node.js/NestJS)

> Antes de buildar uma imagem de produção, garanta que o Dockerfile copia todas as dependências necessárias e usa comandos compatíveis com `npm install --production`.

## Rules

1. **Copie o package.json explicitamente** — `COPY package.json .` antes do `npm install`, porque o Docker precisa do manifesto para resolver dependências e aproveitar cache de layers
2. **Use `start:prod` em vez de `start` para NestJS** — porque `npm run start` usa o `nest` CLI que não existe quando dependências de dev são removidas (`npm install --production`)
3. **Não associe volumes ao container da aplicação em produção** — volumes são para dados persistentes (bancos de dados), não para código de aplicação, porque o código já está na imagem

## How to write

### Dockerfile para NestJS em produção

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --production

COPY dist/ ./dist/

CMD ["npm", "run", "start:prod"]
```

### package.json — script start:prod

```json
{
  "scripts": {
    "start": "nest start",
    "start:prod": "node dist/main"
  }
}
```

## Example

**Before (falha em produção):**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["npm", "run", "start"]
# ERRO: nest CLI não encontrado — não foi instalado em produção
```

**After (com esta skill aplicada):**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --production
COPY dist/ ./dist/
CMD ["npm", "run", "start:prod"]
```

## Heuristics

| Situação | Ação |
|----------|------|
| NestJS app com `npm install --production` | Usar `start:prod` (node direto) |
| Dockerfile sem COPY do package.json | Adicionar antes do `npm install` |
| Container de aplicação com volume de código | Remover volume — código vai na imagem |
| Banco de dados em container | Aí sim, usar volume para persistência |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| `CMD ["npm", "run", "start"]` em prod com NestJS | `CMD ["npm", "run", "start:prod"]` |
| `COPY . .` sem copiar package.json separado | `COPY package.json .` + `RUN npm install` + `COPY dist/ .` |
| Volume montado no container de app em produção | Sem volume — código está na imagem |
| Instalar devDependencies em produção | `npm install --production` ou `npm ci --omit=dev` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-ultimas-correcoes-no-dockerfile/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-ultimas-correcoes-no-dockerfile/references/code-examples.md)
