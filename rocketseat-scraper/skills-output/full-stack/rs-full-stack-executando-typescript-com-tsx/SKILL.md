---
name: rs-full-stack-executando-ts-com-tsx
description: "Configures tsx to execute TypeScript directly without manual transpilation. Use when user asks to 'run typescript', 'execute ts file', 'setup tsx', 'configure dev script', or 'avoid tsc compile step'. Applies tsx installation, watch mode setup, and package.json dev script configuration. Make sure to use this skill whenever setting up a new Node.js + TypeScript project dev environment. Not for production builds, bundling, or tsconfig configuration."
---

# Executando TypeScript com tsx

> Configure tsx para executar TypeScript diretamente no Node.js, eliminando a transcompilacao manual para JavaScript.

## Prerequisites

- Node.js 18+ instalado
- `package.json` existente (rode `npm init -y` se necessario)

## Steps

### Step 1: Instalar tsx como dev dependency

```bash
npm i tsx@4.16.2 -D
```

Sempre fixar versao para evitar breaking changes. O `-D` marca como dependencia de desenvolvimento porque tsx nao vai para producao.

### Step 2: Criar script dev no package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

A flag `watch` reinicia automaticamente a aplicacao quando qualquer arquivo e alterado — sem precisar parar e reexecutar manualmente.

### Step 3: Executar

```bash
npm run dev
```

### Step 4: Remover arquivos .js gerados por tsc

Se existirem arquivos `.js` gerados por transpilacao anterior, apague-os. O tsx executa diretamente o `.ts`.

## Output format

Apos configuracao, o workflow do desenvolvedor e:
1. Editar arquivos `.ts`
2. Salvar
3. tsx detecta a alteracao e reinicia automaticamente

## Error handling

- Se `tsx` nao for encontrado: verificar se `node_modules/.bin/tsx` existe, rodar `npm install`
- Se watch nao reinicia: verificar se o path do arquivo no script esta correto

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto TS + Node | Instalar tsx e criar script dev com watch |
| Projeto ja usa `ts-node` | tsx e mais rapido, considerar migracao |
| Producao/deploy | Nao usar tsx — use `tsc` para build e execute o JS compilado |
| Arquivo de entrada diferente | Ajustar o path no script: `tsx watch src/index.ts` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `tsc && node dist/server.js` no dev | `tsx watch src/server.ts` |
| Instalar tsx como dependencia de producao | `npm i tsx -D` (dev dependency) |
| Rodar `tsx` sem `watch` no desenvolvimento | Sempre usar `watch` para hot reload |
| Deixar arquivos `.js` transpilados junto com `.ts` | Apagar `.js` gerados, usar apenas `.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Por que tsx existe, como funciona por baixo, e quando nao usar
- [code-examples.md](references/code-examples.md) — Exemplos completos de configuracao com variacoes