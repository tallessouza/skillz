---
name: rs-tailwind-eslint-prettier-setup
description: "Configures ESLint and Prettier with Tailwind CSS class sorting plugin in Next.js projects. Use when user asks to 'setup eslint', 'configure prettier', 'sort tailwind classes', 'organize tailwind utilities', or 'setup linting for tailwind'. Applies automatic class ordering: structural first, then colors/fonts, then selectors (dark, hover, enabled). Make sure to use this skill whenever setting up a new Tailwind CSS project or adding linting. Not for general ESLint rule configuration, non-Tailwind projects, or runtime CSS issues."
---

# Configurando ESLint e Prettier com Tailwind CSS

> Configurar ESLint integrado com Prettier e o plugin prettier-plugin-tailwindcss para ordenacao automatica de classes utilitarias.

## Prerequisites

- Next.js project (ja vem com ESLint basico)
- Extensao ESLint instalada no VSCode
- ESLint fix on save habilitado no VSCode

## Steps

### Step 1: Instalar configuracao ESLint com Prettier integrado

O `eslint-config-next` padrao NAO inclui Prettier. Usar uma config que ja integra ambos:

```bash
npm i -D @skillz/eslint-config
```

### Step 2: Estender ESLint config

```js
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@skillz/eslint-config/next"
  ]
}
```

A config `@skillz/eslint-config/next` ja inclui `plugin:prettier/recommended` e regras do Prettier, porque o ESLint precisa estar integrado com Prettier para que plugins do Prettier funcionem via ESLint.

### Step 3: Instalar plugin Tailwind CSS para Prettier

```bash
npm i -D prettier-plugin-tailwindcss
```

### Step 4: Criar arquivo de configuracao Prettier

```js
// prettier.config.js
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
}
```

### Step 5: Reload do VSCode

O VSCode nao observa alteracoes no `prettier.config.js` apos a leitura inicial. Executar `Developer: Reload Window` (Ctrl+Shift+P).

## Output format

Apos salvar qualquer arquivo, as classes Tailwind sao reordenadas automaticamente seguindo ordem semantica:

1. **Estruturais** — `flex`, `grid`, `w-*`, `h-*`, `p-*`, `m-*`
2. **Texto e cores** — `text-*`, `bg-*`, `font-*`, `border-*`
3. **Seletores** — `dark:*`, `hover:*`, `focus:*`, `enabled:*`

## Error handling

- Se nenhum erro aparecer apos setup: verificar aba Output > ESLint no VSCode para conflitos de plugin
- Se classes nao reordenam ao salvar: verificar que `editor.codeActionsOnSave` inclui `source.fixAll.eslint`
- Conflitos entre plugins: verificar versoes compativeis no Google ou forum

## Verification

- Abrir arquivo com classes Tailwind desordenadas
- Salvar o arquivo
- Classes devem reordenar automaticamente na ordem semantica

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Instalar Prettier separado sem integrar ao ESLint | Usar config ESLint que ja inclui Prettier |
| Ordenar classes manualmente | Deixar o plugin ordenar automaticamente ao salvar |
| Ignorar erros de ordem nas classes | Confiar na ordenacao semantica do plugin |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
