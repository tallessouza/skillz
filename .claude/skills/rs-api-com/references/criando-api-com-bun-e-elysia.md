---
name: rs-api-com-bun-criando-api-bun-elysia
description: "Generates Bun + ElysiaJS API project scaffolding when user asks to 'create an API with Bun', 'setup ElysiaJS project', 'initialize Bun backend', 'start a new REST API', or 'scaffold Bun project'. Applies correct project structure with src/http/, bun --watch scripts, and ElysiaJS server configuration. Make sure to use this skill whenever bootstrapping a new Bun-based API or adding ElysiaJS to an existing Bun project. Not for Node.js/Express setups (use rs-node-js), frontend React apps (use rs-next-js), or Deno-based projects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: setup
  tags: [bun, elysia, api, setup, typescript, rest]
---

# Criando API com Bun e ElysiaJS

> Ao criar uma API com Bun, use ElysiaJS como framework HTTP e organize o codigo em src/http/ desde o inicio.

## Rules

1. **Use Bun como runtime, nunca Node** — execute com `bun` ao inves de `node`/`npx`/`npm`, porque Bun entende TypeScript nativamente
2. **Instale dependencias com `bun add`** — nunca `npm install`, porque Bun e mais rapido
3. **Organize codigo em `src/http/`** — servidor em `src/http/server.ts`, porque separa concerns desde o inicio
4. **Use ElysiaJS como framework HTTP** — otimizado para Bun
5. **TypeScript e o padrao** — `strict: true` no tsconfig, sem configuracao extra
6. **Scripts no package.json** — `"dev": "bun --watch src/http/server.ts"`

## How to write

### Inicializacao

```bash
mkdir pizzashop-api && cd pizzashop-api
bun init -y
bun add elysia
```

### Server basico

```typescript
// src/http/server.ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hello World')
  .listen(3333, () => { console.log('HTTP server running on port 3333') })
```

### Scripts

```json
{ "scripts": { "dev": "bun --watch src/http/server.ts", "start": "bun src/http/server.ts" } }
```

## Example

**Before:** `npm init -y && npm install elysia` + `require('express')`

**After:** `bun init -y && bun add elysia` + `import { Elysia } from 'elysia'` in `src/http/server.ts`

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto API | `bun init -y` + `bun add elysia` |
| Precisa de TypeScript | Nada extra — Bun suporta nativamente |
| Hot reload | `bun --watch` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `npm install elysia` | `bun add elysia` |
| `require('elysia')` | `import { Elysia } from 'elysia'` |
| Codigo na raiz `index.ts` | `src/http/server.ts` |
| `nodemon --watch` | `bun --watch` |

## Troubleshooting

### Porta ja em uso
**Symptom:** EADDRINUSE ao iniciar
**Cause:** Processo na porta 3333
**Fix:** `lsof -i :3333` e encerre, ou altere a porta.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
