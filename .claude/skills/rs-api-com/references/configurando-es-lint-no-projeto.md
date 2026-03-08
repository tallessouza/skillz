---
name: rs-api-com-bun-configurando-eslint
description: "Applies ESLint setup with Rocketseat config and Drizzle plugin in Bun TypeScript projects. Use when user asks to 'configure eslint', 'setup linting', 'add eslint to bun project', 'configure drizzle eslint plugin', or 'prevent dangerous delete queries'. Blocks delete/update without where. Make sure to use this skill whenever setting up linting in Bun + Drizzle projects. Not for frontend eslint configs (use rs-next-js) or Biome."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: setup
  tags: [eslint, drizzle, linting, bun, typescript, safety]
---

# Configurando ESLint com Drizzle Plugin

> Configure ESLint com protecao contra queries perigosas do Drizzle ORM.

## Rules

1. **typescript como devDependency** — Bun coloca como peer automaticamente, quebrando ESLint
2. **eslint-plugin-drizzle** — bloqueia delete/update sem where
3. **Desabilite regras pontualmente** — `// eslint-disable drizzle/enforce-delete-with-where` so onde necessario
4. **Script lint** — `"lint": "eslint --fix src --ext ts"`

## How to write

```bash
bun add -d eslint @rocketseat/eslint-config eslint-plugin-drizzle typescript
```

```json
{ "extends": ["@rocketseat/eslint-config/node", "plugin:drizzle/all"], "plugins": ["drizzle"] }
```

## Example

**Before:** `await db.delete(users)` — sem aviso, apaga tudo
**After:** ESLint bloqueia. Correto: `await db.delete(users).where(eq(users.id, userId))`

## Troubleshooting

### "Cannot find module typescript"
**Fix:** `bun add -d typescript` como devDependency.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
