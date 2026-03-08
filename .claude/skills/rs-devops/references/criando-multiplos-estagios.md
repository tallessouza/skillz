---
name: rs-devops-criando-multiplos-estagios
description: "Enforces Docker multi-stage build patterns when writing Dockerfiles. Use when user asks to 'create a Dockerfile', 'optimize Docker image', 'reduce image size', 'build container', or 'multi-stage build'. Applies rules: separate build and runtime stages, use AS aliases, COPY --from between stages, only copy runtime artifacts (dist + node_modules). Make sure to use this skill whenever generating or reviewing Dockerfiles. Not for docker-compose, Kubernetes manifests, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-multi-stage
  tags: [docker, dockerfile, multi-stage, build, optimization, alpine, image-size]
---

# Multi-Stage Build em Dockerfiles

> Separe build e execucao em estagios distintos — a imagem final so contem o necessario para rodar.

## Rules

1. **Use AS para nomear cada estagio** — `FROM node:18 AS build`, porque sem alias a referencia entre estagios usa indices numericos frageis
2. **Separe build de runtime** — estagio 1 instala dependencias e builda, estagio 2 so copia artefatos finais, porque dependencias de build nao pertencem a imagem de producao
3. **Copie entre estagios com --from** — `COPY --from=build /app/dist ./dist`, porque isso extrai apenas o resultado do build sem arrastar o contexto inteiro
4. **Copie apenas artefatos de runtime** — `dist/` e `node_modules/` (producao), porque devDependencies e source code inflam a imagem sem necessidade
5. **Defina WORKDIR em cada estagio** — se o diretorio muda entre estagios, atualize o path no COPY --from, porque o path e absoluto relativo ao estagio de origem
6. **Combine com Alpine para maximo ganho** — multi-stage reduz artefatos, Alpine reduz a base OS, porque juntos produzem a menor imagem possivel

## How to write

### Dockerfile multi-stage basico (Node.js)

```dockerfile
# Estagio 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Estagio 2: Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### COPY --from com diretorio diferente

```dockerfile
# Se o estagio de build usa /build como WORKDIR
FROM node:18-alpine AS build
WORKDIR /build
COPY . .
RUN yarn install && yarn build

# Runtime precisa referenciar /build (path absoluto do estagio de origem)
FROM node:18-alpine
WORKDIR /app
COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules
```

## Example

**Before (single-stage, imagem pesada ~1GB):**
```dockerfile
FROM node:18
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**After (multi-stage, ~383MB sem Alpine, ~90MB com Alpine):**
```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Heuristics

| Situacao | Acao |
|----------|------|
| App precisa de devDependencies so no build (ex: NestJS CLI) | Multi-stage obrigatorio |
| Imagem final > 500MB | Investigar multi-stage + Alpine |
| Precisa rodar testes no CI | Adicionar estagio `test` entre `build` e `runtime` |
| Multiplos binarios/artefatos | Um estagio de build para cada, runtime copia de todos |
| WORKDIR diferente entre estagios | Usar path absoluto no COPY --from |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Imagem unica com build + runtime | Separar em estagios com AS |
| `COPY --from=0` (indice numerico) | `COPY --from=build` (alias nomeado) |
| Copiar tudo do estagio anterior | Copiar apenas `dist/` e `node_modules/` de producao |
| Deixar source code na imagem final | Source fica apenas no estagio de build |
| FROM sem AS em multi-stage | Sempre nomear: `FROM image AS nome` |

## Troubleshooting

### COPY --from=build falha com "file not found"
**Symptom:** O build do estagio de runtime falha com erro indicando que o arquivo ou diretorio nao existe no estagio anterior.
**Cause:** O WORKDIR do estagio de build e diferente do path usado no COPY --from. O path no --from e absoluto relativo ao estagio de origem.
**Fix:** Use o path absoluto completo do estagio de origem no COPY --from. Se o build usa `WORKDIR /build`, use `COPY --from=build /build/dist ./dist`, nao `COPY --from=build /app/dist ./dist`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
