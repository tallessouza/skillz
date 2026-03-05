# Code Examples: ESLint + Prettier + Tailwind CSS

## Configuracao completa passo a passo

### 1. eslintrc.json padrao do Next.js (ANTES)

```json
{
  "extends": "next/core-web-vitals"
}
```

### 2. Instalacao

```bash
npm i -D @rocketseat/eslint-config prettier-plugin-tailwindcss
```

### 3. eslintrc.json estendido (DEPOIS)

```json
{
  "extends": [
    "next/core-web-vitals",
    "@rocketseat/eslint-config/next"
  ]
}
```

### 4. prettier.config.js

```js
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
}
```

## Exemplo de reordenacao automatica

### Antes de salvar (ordem arbitraria):

```tsx
<div className="hover:bg-blue-600 p-4 flex dark:bg-gray-800 text-white items-center bg-blue-500 rounded-lg gap-2 font-bold">
  Content
</div>
```

### Depois de salvar (ordem semantica):

```tsx
<div className="flex items-center gap-2 rounded-lg bg-blue-500 p-4 font-bold text-white hover:bg-blue-600 dark:bg-gray-800">
  Content
</div>
```

**Ordem aplicada:**
1. `flex items-center gap-2 rounded-lg` — estrutural
2. `bg-blue-500 p-4` — spacing/cor base
3. `font-bold text-white` — texto
4. `hover:bg-blue-600` — seletor hover
5. `dark:bg-gray-800` — seletor dark

## VSCode settings.json necessario

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Alternativa sem @rocketseat/eslint-config

Se nao quiser usar a config da Rocketseat, instalar manualmente:

```bash
npm i -D prettier eslint-plugin-prettier eslint-config-prettier prettier-plugin-tailwindcss
```

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:prettier/recommended"
  ]
}
```

```js
// prettier.config.js
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
}
```

## Commit de referencia

[Configurando ESLint e Prettier](https://github.com/rocketseat-education/ignite-tailwind/commit/79f33d19408cefbf65bc3885fe3ee7cce8671ebe)