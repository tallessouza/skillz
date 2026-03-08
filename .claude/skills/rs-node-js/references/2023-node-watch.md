---
name: rs-node-js-2023-node-watch
description: "Applies Node.js --watch flag and npm scripts setup when configuring development servers or auto-restart workflows. Use when user asks to 'setup dev server', 'auto restart node', 'create npm scripts', 'watch file changes', or 'configure package.json scripts'. Make sure to use this skill whenever setting up a Node.js development environment with file watching. Not for production deployment, process managers like PM2, or bundler watch modes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: node-fundamentals
  tags: [node-watch, npm-scripts, dev-server, auto-restart, package-json, development]
---

# Node --watch e NPM Scripts

> Usar `node --watch` para auto-restart do servidor em desenvolvimento e criar npm scripts para simplificar comandos repetitivos.

## Rules

1. **Usar `node --watch` nativo** — nao instalar nodemon ou bibliotecas externas para watch em desenvolvimento, porque o Node.js ja tem essa feature built-in desde v18
2. **Criar script `dev` no package.json** — todo projeto Node.js deve ter um script `dev` que encapsula o comando completo, porque ninguem deve decorar flags de CLI
3. **Executar com `npm run dev`** — nunca digitar o comando completo no terminal repetidamente, porque scripts existem para criar aliases de comandos longos

## Steps

### Step 1: Executar com --watch

```bash
node --watch src/server.js
```

O Node.js reinicia automaticamente quando qualquer arquivo muda. A flag `--watch` e experimental mas estavel.

### Step 2: Criar npm script

No `package.json`, na secao `scripts`:

```json
{
  "scripts": {
    "dev": "node --watch src/server.js"
  }
}
```

### Step 3: Executar via npm

```bash
npm run dev
```

## Example

**Before (repetitivo e manual):**

```bash
# Muda codigo, precisa parar e reiniciar manualmente
node src/server.js
# Ctrl+C
node src/server.js
# Ctrl+C
node src/server.js
```

**After (com --watch e npm script):**

```bash
npm run dev
# Muda codigo -> restart automatico
# Muda codigo -> restart automatico
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto Node.js novo | Criar script `dev` com `--watch` imediatamente |
| Projeto legado com nodemon | Avaliar substituir por `--watch` nativo |
| Comando de dev tem mais de 5 palavras | Criar npm script para encapsular |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `npm install nodemon` para watch simples | `node --watch src/server.js` |
| Digitar `node --watch src/server.js` toda vez | `npm run dev` |
| Parar e reiniciar servidor manualmente a cada mudanca | Usar `--watch` para auto-restart |
| Deixar `package.json` sem script `dev` | Sempre criar alias no `scripts` |

## Troubleshooting

### node --watch nao reinicia ao salvar arquivo
**Symptom:** Servidor nao reinicia automaticamente apos mudancas no codigo
**Cause:** Versao do Node.js anterior a v18 nao suporta a flag `--watch`
**Fix:** Atualize o Node.js para v18+ ou use `nodemon` como fallback temporario

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
