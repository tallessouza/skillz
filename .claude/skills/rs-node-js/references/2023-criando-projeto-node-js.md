---
name: rs-node-js-2023-criando-projeto-node-js
description: "Generates initial Node.js project structure with TypeScript, Fastify, and proper build pipeline. Use when user asks to 'create a node project', 'setup typescript node', 'init fastify project', 'start a new API', or 'scaffold node backend'. Applies separation of app/server files, TSX for dev, tsup for build, and correct Fastify host binding. Make sure to use this skill whenever bootstrapping a new Node.js TypeScript API project. Not for frontend projects, Deno/Bun setups, or adding features to existing projects."
---

# Criando Projeto Node.js com TypeScript e Fastify

> Separe a instancia da aplicacao do servidor HTTP, configure TSX para desenvolvimento e tsup para build de producao.

## Prerequisites

- Node.js 18+
- npm (ou yarn/pnpm)
- Se nao encontrado: instalar Node.js via nvm

## Steps

### Step 1: Inicializar projeto e instalar dependencias

```bash
npm init -y
npm i fastify
npm i -D typescript @types/node tsx tsup
npx tsc --init
```

Alterar `tsconfig.json`: target para `es2020` porque o Node ja suporta essa versao do ECMAScript.

### Step 2: Criar estrutura de arquivos

```
src/
├── app.ts      # Instancia do Fastify (exportada)
└── server.ts   # Inicializacao do servidor HTTP
```

### Step 3: Criar app.ts (instancia separada)

```typescript
import fastify from 'fastify'

export const app = fastify()
```

### Step 4: Criar server.ts

```typescript
import { app } from './app'

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running!')
  })
```

O `host: '0.0.0.0'` garante que frontends e outras aplicacoes consigam se conectar ao backend. Sem isso, ha problemas de conexao.

### Step 5: Configurar scripts no package.json

```json
{
  "scripts": {
    "start:dev": "tsx watch src/server.ts",
    "start": "node build/server.js",
    "build": "tsup src --out-dir build"
  }
}
```

### Step 6: Criar .gitignore

```
node_modules
build
```

## Output format

Projeto funcional com:
- `npm run start:dev` — desenvolvimento com hot-reload (TSX)
- `npm run build` — compila TypeScript para JavaScript na pasta `build/`
- `npm run start` — executa versao de producao com Node puro

## Heuristics

| Situacao | Faca |
|----------|------|
| Desenvolvimento local | `npm run start:dev` (TSX com watch) |
| Deploy para producao | `npm run build` e depois `npm run start` |
| Precisa importar app em testes | Importe de `app.ts`, nao de `server.ts` |
| Frontend nao conecta ao backend | Verificar se `host: '0.0.0.0'` esta configurado |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar app e server no mesmo arquivo | Separar em `app.ts` e `server.ts`, porque testes precisam importar app sem subir o servidor |
| Usar `ts-node` para desenvolvimento | Usar `tsx` com `watch`, porque e mais rapido e simples |
| Deixar target do tsconfig em `es2016` | Usar `es2020`, porque o Node ja suporta e evita conversoes desnecessarias |
| Omitir `host: '0.0.0.0'` no listen | Sempre passar, porque sem isso frontends podem nao conseguir conectar |
| Rodar `tsx` em producao | Usar `tsup` para build e `node` para executar, porque TSX e apenas para desenvolvimento |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-criando-projeto-node-js/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-criando-projeto-node-js/references/code-examples.md)
