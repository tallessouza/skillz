---
name: rs-devops-ultimas-correcoes-no-dockerfile
description: "Applies Dockerfile production corrections for NestJS applications including package.json layer caching, start:prod script usage, and volume removal. Use when user asks to 'fix Dockerfile for production', 'optimize NestJS Docker build', 'use start:prod', 'remove dev dependencies from image', or 'fix nest CLI not found in production'. Enforces separate package.json copy, npm install --production, start:prod command, and no volumes for app containers. Make sure to use this skill whenever writing production Dockerfiles for NestJS or Node.js applications. Not for multi-stage builds (extension), Docker Compose, or non-NestJS frameworks."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-production
  tags: [docker, dockerfile, nestjs, production, layer-caching, start-prod, npm-install-production]
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


## Troubleshooting

### nest CLI nao encontrado em producao
**Symptom:** Container falha com erro "nest: command not found" ao rodar `npm run start`
**Cause:** `npm install --production` nao instala devDependencies onde o `@nestjs/cli` esta
**Fix:** Use `npm run start:prod` (que executa `node dist/main`) em vez de `npm run start`

### Imagem Docker muito grande
**Symptom:** Imagem final tem centenas de MB desnecessarios
**Cause:** Todas as dependencias (incluindo dev) estao na imagem, ou `COPY . .` copia arquivos desnecessarios
**Fix:** Use multi-stage build: stage 1 para build com todas as deps, stage 2 apenas com `npm ci --omit=dev` e `dist/`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Correções de Dockerfile para Produção

## Por que copiar o package.json separadamente?

O Docker usa um sistema de cache por layers. Cada instrução `COPY` ou `RUN` cria uma nova layer. Quando você copia o `package.json` separadamente antes do `npm install`, o Docker consegue reutilizar o cache do `npm install` enquanto o `package.json` não mudar — mesmo que o código fonte mude.

Se você fizer `COPY . .` antes do `npm install`, qualquer mudança em qualquer arquivo invalida o cache e força uma reinstalação completa das dependências.

A sequência ideal:
1. `COPY package.json .` (e `package-lock.json`)
2. `RUN npm install --production`
3. `COPY dist/ ./dist/` (ou código compilado)

## Por que start:prod em vez de start?

No ecossistema NestJS, o script `start` padrão gerado pelo CLI é:

```json
"start": "nest start"
```

Isso depende do `@nestjs/cli` que é uma **devDependency**. Quando você instala dependências com `--production` (ou `--omit=dev`), o `nest` CLI simplesmente não existe no `node_modules/.bin/`.

O script `start:prod` usa Node diretamente:

```json
"start:prod": "node dist/main"
```

Isso funciona porque:
- O código já foi compilado (TypeScript → JavaScript) durante o build
- O `dist/main.js` é JavaScript puro que o Node executa diretamente
- Não precisa de nenhuma ferramenta de build em runtime

O instrutor enfatiza que isso é uma **boa prática**: em produção, você nunca deveria depender de ferramentas de desenvolvimento para rodar sua aplicação.

## Volumes: quando usar e quando não usar

O instrutor faz uma distinção importante:

- **Container de aplicação**: NÃO precisa de volume. O código está embutido na imagem Docker. Se precisar atualizar, faz uma nova build.
- **Container de banco de dados**: PRECISA de volume. Os dados precisam persistir mesmo quando o container é destruído e recriado.

Na aula anterior, volumes foram usados para entender o conceito. Mas em produção real, associar um volume ao container da aplicação pode causar problemas — como sobrescrever o código da imagem com arquivos locais desatualizados.

## Fluxo de build e execução

O instrutor demonstra o ciclo:

1. Fazer as correções no Dockerfile
2. Buildar a nova imagem com uma tag versionada (`v8`)
3. Executar sem volume
4. Manter a rede configurada (para comunicação entre containers)
5. Verificar que a aplicação está rodando

Esse ciclo de build → tag → run é o padrão para deployments de container.

---

# Code Examples: Correções de Dockerfile para Produção

## Exemplo 1: Dockerfile completo para NestJS

```dockerfile
# Imagem base leve
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os manifestos de dependência primeiro (cache de layers)
COPY package.json .
COPY package-lock.json .

# Instala apenas dependências de produção
RUN npm install --production

# Copia o código compilado
COPY dist/ ./dist/

# Expõe a porta da aplicação
EXPOSE 3000

# Usa start:prod que roda "node dist/main" diretamente
CMD ["npm", "run", "start:prod"]
```

## Exemplo 2: package.json — diferença entre scripts

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main"
  }
}
```

- `start` → usa `nest` CLI (devDependency) — NÃO funciona em produção
- `start:dev` → usa `nest` com watch — apenas desenvolvimento
- `start:prod` → usa `node` diretamente — funciona em produção

## Exemplo 3: Build e execução do container

```bash
# Build da imagem com tag versionada
docker build -t minha-app:v8 .

# Execução SEM volume (produção)
docker run -d --name minha-app --network minha-rede minha-app:v8

# Verificar se está rodando
docker ps
docker logs minha-app
```

## Exemplo 4: Comparação — com e sem volume

```bash
# DESENVOLVIMENTO: com volume (código local reflete no container)
docker run -d -v $(pwd):/app --name app-dev minha-app:dev

# PRODUÇÃO: sem volume (código está na imagem)
docker run -d --name app-prod --network minha-rede minha-app:v8
```

## Exemplo 5: Multi-stage build (extensão do conceito)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Produção
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
CMD ["npm", "run", "start:prod"]
```

Este padrão multi-stage garante que ferramentas de build (TypeScript compiler, NestJS CLI) existam apenas no stage de build, nunca na imagem final de produção.
