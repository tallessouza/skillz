# Code Examples: Prettier & ESLint no Monorepo

## 1. Package.json do pacote Prettier

```json
{
  "name": "@saas/prettier",
  "version": "0.0.0",
  "private": true,
  "main": "index.mjs"
}
```

**Notas:**
- `name` usa o prefixo `@saas/` definido no workspace
- `version` e `0.0.0` porque nunca sera publicado
- `main` aponta para `index.mjs` (ESM)
- `private: true` impede publicacao acidental

## 2. Instalacao de dependencias do Prettier

```bash
cd config/prettier
pnpm install -D prettier prettier-plugin-tailwindcss
```

## 3. Configuracao completa do Prettier (`index.mjs`)

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

**Explicacao de cada opcao:**

| Opcao | Valor | Efeito |
|-------|-------|--------|
| `printWidth` | 80 | Largura maxima da linha |
| `tabWidth` | 2 | Espacos por indentacao |
| `useTabs` | false | Usa espacos, nao tabs |
| `semi` | false | Remove ponto e virgula |
| `singleQuote` | true | Aspas simples em JS |
| `quoteProps` | 'as-needed' | Aspas em props de objeto so quando necessario |
| `jsxSingleQuote` | false | Aspas duplas em atributos JSX |
| `trailingComma` | 'es5' | Virgula no final (compativel ES5) |
| `bracketSpacing` | true | Espaco entre chaves `{ foo }` |
| `arrowParens` | 'always' | Parenteses em arrow functions `(x) => x` |
| `endOfLine` | 'auto' | Detecta automaticamente (Windows/Unix/Mac) |
| `bracketSameLine` | false | `>` do JSX em nova linha |

## 4. Package.json do ESLint config

```json
{
  "name": "@saas/eslint-config",
  "version": "0.0.0",
  "private": true,
  "devDependencies": {
    "@rocketseat/eslint-config": "^2.2.2",
    "eslint-plugin-simple-import-sort": "^12.1.1",
    "@saas/prettier": "workspace:*"
  }
}
```

**Nota:** `@saas/prettier` usa `workspace:*` para criar symbolic link.

## 5. Config ESLint para Next.js (`next.js`)

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@rocketseat/eslint-config/next'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
  },
}
```

## 6. Config ESLint para Node.js (`node.js`)

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@rocketseat/eslint-config/node'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
  },
}
```

## 7. Config ESLint para bibliotecas (`library.js`)

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@rocketseat/eslint-config/react'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
  },
}
```

## 8. Ativando Prettier e ESLint via package.json

```json
{
  "name": "@saas/eslint-config",
  "prettier": "@saas/prettier",
  "eslintConfig": {
    "extends": "./library.js"
  }
}
```

## 9. Package.json da raiz (limpo)

```json
{
  "name": "saas-rbac",
  "packageManager": "pnpm@9.x",
  "engines": {
    "node": ">=18"
  }
}
```

**Nota:** Todas as dependencias de ESLint, Prettier e TypeScript foram removidas da raiz.

## 10. Estrutura final de arquivos

```
root/
├── package.json                    # limpo, sem deps de lint
├── pnpm-workspace.yaml
├── config/
│   ├── prettier/
│   │   ├── package.json            # @saas/prettier
│   │   └── index.mjs               # config exportada
│   ├── eslint-config/
│   │   ├── package.json            # @saas/eslint-config
│   │   ├── next.js                 # extends @rocketseat/next
│   │   ├── node.js                 # extends @rocketseat/node
│   │   └── library.js              # extends @rocketseat/react
│   └── ts-config/
│       └── package.json            # @saas/ts-config (vazio)
├── apps/                           # (ainda sem projetos)
└── packages/                       # (ainda sem pacotes)
```