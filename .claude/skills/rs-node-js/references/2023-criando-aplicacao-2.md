---
name: 2023-criando-aplicacao-2
description: "Applies Fastify + TSX project setup pattern when creating Node.js REST applications. Use when user asks to 'create a new project', 'setup fastify', 'configure tsx watch', 'start a node api', or 'initialize typescript project'. Enforces tsx watch in dev, JavaScript in production, @types/node as devDependency, server.ts naming, and no npx in npm scripts. Make sure to use this skill whenever bootstrapping Node.js API projects with Fastify. Not for frontend projects, Express setup, or NestJS initialization."
category: workflow
tags: [fastify, typescript, tsx, project-setup, node-api]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: project-setup
  tags: [fastify, typescript, tsx, project-setup, node-api, watch]
---

# Criando Aplicacao Node.js com Fastify

> Ao criar uma aplicacao Node.js REST, use Fastify como framework, TSX para execucao em desenvolvimento, e converta para JavaScript apenas em producao.

## Prerequisites

- Node.js 18+
- npm inicializado (`npm init -y`)
- TypeScript configurado (`tsconfig.json` presente)
- `@types/node` instalado como devDependency

## Steps

### Step 1: Instalar dependencias

```bash
npm install fastify
npm install -D @types/node tsx
```

### Step 2: Criar o servidor

```typescript
// src/server.ts
import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'Hello World'
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
```

### Step 3: Configurar script de desenvolvimento

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

### Step 4: Executar

```bash
npm run dev
```

## Rules

1. **Use `tsx watch` em dev, nunca `tsx` sem watch** — porque sem watch voce precisa reiniciar manualmente a cada alteracao
2. **Nunca use TSX em producao** — porque JavaScript puro executa significativamente mais rapido (~999ms vs ~1.2s+ de startup)
3. **Sempre instale `@types/node` como devDependency** — porque TypeScript nao reconhece tipos nativos do Node sem esse pacote
4. **Nomeie o arquivo principal como `server.ts`, nao `index.ts`** — porque server descreve melhor o proposito numa API REST
5. **No script npm, nao precisa de `npx`** — scripts do package.json ja resolvem binarios de node_modules automaticamente

## Heuristics

| Situacao | Faca |
|----------|------|
| Desenvolvimento local | `tsx watch src/server.ts` |
| Producao | `npx tsc` depois `node build/server.js` |
| Testar TypeScript rapido (one-off) | `npx tsx src/server.ts` (sem watch) |
| Erro "cannot find name Buffer" | `npm install -D @types/node` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `node src/server.ts` | `npx tsx src/server.ts` |
| `tsx` em producao | `tsc` + `node` em producao |
| `"dev": "npx tsx watch ..."` | `"dev": "tsx watch ..."` |
| Commitar `.js` gerados pelo `tsc` | Adicione `*.js` em `src/` ao `.gitignore` |
| `app.listen(3333)` | `app.listen({ port: 3333 })` |

## Troubleshooting

### TSX nao encontrado ao rodar npm run dev
**Symptom:** `tsx: command not found`
**Cause:** TSX nao foi instalado como devDependency
**Fix:** `npm install -D tsx`

### Servidor nao reinicia ao salvar
**Symptom:** Alteracoes no codigo nao refletem sem reiniciar
**Cause:** Usando `tsx` sem a flag `watch`
**Fix:** Alterar script para `tsx watch src/server.ts`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-criando-aplicacao-2/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-criando-aplicacao-2/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
