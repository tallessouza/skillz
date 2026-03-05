---
name: rs-saas-nextjs-rbac-eslint-prettier-monorepo
description: "Applies Prettier, ESLint, and TypeScript configuration patterns for Turborepo monorepos. Use when user asks to 'setup eslint', 'configure prettier', 'monorepo config', 'shared eslint config', 'configure linting in turborepo', or 'setup code formatting'. Enforces workspace package structure, symbolic linking, JSDoc typing in JS configs, and simple-import-sort plugin. Make sure to use this skill whenever setting up linting or formatting in a pnpm/turborepo monorepo. Not for single-project ESLint setup, runtime code patterns, or testing configuration."
---

# Prettier & ESLint no Monorepo (Turborepo + pnpm)

> Configuracoes de linting e formatting vivem em pacotes dedicados dentro de `config/`, nunca na raiz do monorepo.

## Rules

1. **Configuracoes em pacotes separados** — crie `config/prettier` e `config/eslint-config` como pacotes independentes, porque permite reutilizar entre apps e packages sem duplicacao
2. **Prefixe com o escopo do projeto** — `@saas/prettier`, `@saas/eslint-config`, porque o pnpm workspace resolve automaticamente pelo nome
3. **Use `private: true`** — pacotes de config nunca serao publicados no npm, o flag evita publicacao acidental
4. **Versao com `workspace:*`** — ao referenciar pacotes internos, use `"@saas/prettier": "workspace:*"`, porque o pnpm cria symbolic links automaticos
5. **Uma config ESLint por tipo de projeto** — `next.js`, `node.js`, `library.js`, porque cada ambiente tem regras diferentes
6. **JSDoc `@typedef` para autocomplete em JS** — use `/** @typedef {import('prettier').Config} PrettierConfig */` no topo de arquivos `.mjs`, porque da type safety sem precisar de TypeScript
7. **`simple-import-sort` como error, nao warn** — configure como `"error"` para que o autofix do editor funcione ao salvar, porque warnings nao disparam autofix

## How to write

### Package.json do pacote de config

```json
{
  "name": "@saas/prettier",
  "version": "0.0.0",
  "private": true,
  "main": "index.mjs"
}
```

### Prettier config (`config/prettier/index.mjs`)

```javascript
/** @typedef {import('prettier').Config} PrettierConfig */

/** @type {PrettierConfig} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'auto',
  bracketSameLine: false,
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
```

### ESLint config por tipo (`config/eslint-config/next.js`)

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@skillz/eslint-config/next'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
  },
}
```

### Referenciando config interna como dependencia

```json
{
  "devDependencies": {
    "@saas/prettier": "workspace:*",
    "@saas/eslint-config": "workspace:*"
  }
}
```

### Ativando Prettier via package.json (sem arquivo .prettierrc)

```json
{
  "prettier": "@saas/prettier"
}
```

### ESLint em pacote de config que tambem usa ESLint

```json
{
  "prettier": "@saas/prettier",
  "eslintConfig": {
    "extends": "./library.js"
  }
}
```

## Example

**Before (config na raiz, tudo misturado):**
```
root/
├── .eslintrc.json      # config global quebradica
├── .prettierrc          # config duplicada
├── tsconfig.json        # config que ninguem usa
├── apps/web/
└── packages/lib/
```

**After (config em pacotes dedicados):**
```
root/
├── package.json         # limpo, sem deps de lint
├── config/
│   ├── prettier/
│   │   ├── package.json # @saas/prettier
│   │   └── index.mjs    # config centralizada
│   ├── eslint-config/
│   │   ├── package.json # @saas/eslint-config
│   │   ├── next.js      # config para apps Next.js
│   │   ├── node.js      # config para backend Node
│   │   └── library.js   # config para libs React
│   └── ts-config/
│       └── package.json # @saas/ts-config (vazio ate ter projetos)
├── apps/web/
└── packages/lib/
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo monorepo Turborepo | Crie `config/prettier`, `config/eslint-config`, `config/ts-config` |
| App Next.js no monorepo | Estenda `@skillz/eslint-config/next` |
| API Node.js no monorepo | Estenda `@skillz/eslint-config/node` |
| Pacote de lib pura | Estenda `@skillz/eslint-config/react` |
| Precisa de autocomplete em `.mjs` | Use `@typedef` com import do tipo |
| Nenhum projeto usa TypeScript ainda | Deixe ts-config vazio, configure quando criar o primeiro projeto |
| Quer Prettier + Tailwind | Instale `prettier-plugin-tailwindcss` no pacote de prettier |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Config ESLint/Prettier na raiz do monorepo | Pacote dedicado em `config/` |
| `"version": "1.0.0"` em pacote interno | `"version": "0.0.0"` com `"private": true` |
| `"@saas/prettier": "^0.0.0"` | `"@saas/prettier": "workspace:*"` |
| `simple-import-sort/imports: "warn"` | `simple-import-sort/imports: "error"` (autofix precisa de error) |
| Criar `.prettierrc` na raiz | `"prettier": "@saas/prettier"` no package.json |
| Uma unica config ESLint para tudo | Configs separadas: `next.js`, `node.js`, `library.js` |
| Configurar TypeScript antes de ter projetos | Deixe vazio, configure quando necessario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-es-lint-and-type-script-no-monorepo/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-es-lint-and-type-script-no-monorepo/references/code-examples.md)
