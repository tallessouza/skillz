---
name: 2023-criando-projeto-node-js
description: "Sets up a Node.js project with TypeScript and Fastify, separating app instance from server startup, with TSX for development and tsup for production builds. Use when user asks to 'create Node.js project', 'setup Fastify with TypeScript', 'initialize backend project', or 'configure development and build scripts'. Enforces: separate app.ts from server.ts, use TSX with watch for dev, tsup for production build, host 0.0.0.0 for external access. Make sure to use this skill whenever bootstrapping a new Node.js backend project with TypeScript and Fastify. Not for NestJS projects, frontend setups, or JavaScript-only projects."
category: workflow
tags: [deploy, fastify, modules, testing, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: project-setup
  tags: [fastify, typescript, tsx, tsup, project-setup, node-js]
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

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
