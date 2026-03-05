---
name: rs-node-js-2023-criando-aplicacao
description: "Generates Node.js REST API project setup with Fastify and TSX when user asks to 'create a node project', 'setup fastify', 'start a REST API', 'initialize node app', or 'create a server'. Applies correct project structure: Fastify app creation, TypeScript with @types/node, TSX for dev execution with watch mode, and npm scripts. Make sure to use this skill whenever scaffolding a new Node.js API project or configuring TypeScript execution. Not for frontend projects, Nest.js, Express, or production deployment configuration."
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
2. **Nunca use TSX em producao** — porque JavaScript puro executa significativamente mais rapido (o instrutor mediu ~999ms vs ~1.2s+ de startup)
3. **Sempre instale `@types/node` como devDependency** — porque TypeScript nao reconhece tipos nativos do Node (Buffer, etc.) sem esse pacote
4. **Nomeie o arquivo principal como `server.ts`, nao `index.ts`** — porque server descreve melhor o proposito do arquivo numa API REST
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
| Commitar arquivos `.js` gerados pelo `tsc` | Adicione `*.js` em `src/` ao `.gitignore` |
| `app.listen(3333)` | `app.listen({ port: 3333 })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
