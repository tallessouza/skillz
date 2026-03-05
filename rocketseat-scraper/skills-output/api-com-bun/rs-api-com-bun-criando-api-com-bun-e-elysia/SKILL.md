---
name: rs-api-com-bun-criando-api-bun-elysia
description: "Generates Bun + ElysiaJS API project setup when user asks to 'create an API with Bun', 'setup ElysiaJS project', 'initialize Bun project', 'start a new backend with Bun', or 'create REST API with Elysia'. Applies correct project structure, scripts, and server configuration. Make sure to use this skill whenever scaffolding a new Bun-based API or adding ElysiaJS to a project. Not for Node.js/Express projects, frontend apps, or Deno-based setups."
---

# Criando API com Bun e ElysiaJS

> Ao criar uma API com Bun, use ElysiaJS como framework HTTP e organize o codigo em src/http/ desde o inicio.

## Rules

1. **Use Bun como runtime, nunca Node** — execute com `bun` ao inves de `node`/`npx`/`npm`, porque Bun ja entende TypeScript nativamente sem transpilacao
2. **Instale dependencias com `bun add`** — nunca `npm install` ou `yarn add`, porque o gerenciador de pacotes do Bun e significativamente mais rapido
3. **Organize codigo em `src/http/`** — o arquivo principal do servidor fica em `src/http/server.ts`, porque separa concerns desde o inicio
4. **Use ElysiaJS como framework HTTP** — sintaxe similar a Express/Fastify mas otimizado para Bun, porque aproveita melhor o runtime
5. **TypeScript e o padrao** — Bun e TypeScript-first, mantenha `strict: true` no tsconfig, porque o runtime ja suporta TS sem configuracao extra
6. **Configure scripts no package.json corretamente** — apontar para `src/http/server.ts` nos scripts dev/build/start

## How to write

### Inicializacao do projeto

```bash
mkdir pizzashop-api && cd pizzashop-api
bun init -y
bun add elysia
```

### Estrutura de pastas

```
project-root/
├── src/
│   └── http/
│       └── server.ts
├── package.json
└── tsconfig.json
```

### Server basico com ElysiaJS

```typescript
// src/http/server.ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => {
    return 'Hello World'
  })
  .listen(3333, () => {
    console.log('🔥 HTTP server running')
  })
```

### Scripts no package.json

```json
{
  "scripts": {
    "dev": "bun --watch src/http/server.ts",
    "build": "bun build src/http/server.ts",
    "start": "bun src/http/server.ts",
    "test": "bun test"
  }
}
```

## Example

**Before (setup incorreto misturando Node com Bun):**
```bash
npm init -y
npm install elysia
# tsconfig manual, ts-node, nodemon...
```

```typescript
// index.ts na raiz
const express = require('express')
```

**After (setup correto com Bun + Elysia):**
```bash
bun init -y
bun add elysia
```

```typescript
// src/http/server.ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hello World')
  .listen(3333, () => {
    console.log('🔥 HTTP server running')
  })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo projeto API backend | `bun init -y` + `bun add elysia` |
| Precisa de TypeScript | Nao configure nada extra — Bun ja suporta nativamente |
| Precisa de hot reload | Use `bun --watch` no script dev |
| Precisa testar rota rapidamente | `curl http://localhost:3333/` ou HTTPie `http :3333/` |
| Projeto precisa rodar em Node tambem | O codigo e compativel — Bun usa mesmas APIs do Node |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `npm install elysia` | `bun add elysia` |
| `npx ts-node src/server.ts` | `bun src/http/server.ts` |
| `require('elysia')` | `import { Elysia } from 'elysia'` |
| Codigo na raiz `index.ts` | `src/http/server.ts` |
| `nodemon --watch` | `bun --watch` |
| Configurar babel/swc para TS | Nao precisa — Bun entende TS nativamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
