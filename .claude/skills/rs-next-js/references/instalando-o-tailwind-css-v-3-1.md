---
name: rs-next-js-instalando-tailwind-css-v3
description: "Guides Tailwind CSS v3 installation and configuration in Next.js 15 projects using Pages Router. Use when user asks to 'install tailwind v3', 'downgrade tailwind to v3', 'configure tailwind with next.js pages router', 'setup postcss with tailwind', or 'migrate from tailwind v4 to v3'. Make sure to use this skill whenever setting up Tailwind CSS v3 in a Next.js project. Not for Tailwind v4 setup, App Router tailwind config, or styling/utility class guidance."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: instalacao
  tags: [tailwind-css, tailwind-v3, postcss, autoprefixer, next-js, pages-router, configuration]
---

# Instalando Tailwind CSS v3 no Next.js 15

> Configurar Tailwind CSS v3 no Next.js 15 (Pages Router) requer downgrade explicito, configuracao de content paths e importacao via diretivas @tailwind.

## Prerequisites

- Next.js 15 com Pages Router
- Package manager: pnpm, npm ou yarn
- Se Tailwind v4 ja estiver instalado: desinstalar primeiro

## Steps

### Step 1: Remover Tailwind v4 (se existente)

```bash
# pnpm
pnpm remove tailwindcss

# npm
npm uninstall tailwindcss
```

### Step 2: Instalar Tailwind v3 com dependencias

```bash
pnpm install tailwindcss@3 postcss autoprefixer
```

### Step 3: Inicializar configuracao

```bash
npx tailwindcss init -p
```

Gera `tailwind.config.js` e `postcss.config.js`.

### Step 4: Configurar content paths no tailwind.config

Converter para TypeScript (`tailwind.config.ts`) e definir os paths:

```typescript
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
  ],
} satisfies Config;
```

### Step 5: Configurar globals.css com diretivas v3

Substituir todo o conteudo de `src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

A sintaxe `@import "tailwindcss"` e da v4 — na v3 usar as tres diretivas `@tailwind`.

### Step 6 (opcional): Converter postcss.config para ESM

Renomear para `postcss.config.mjs`:

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

## Verification

1. Rodar `pnpm dev` (ou `npm run dev`)
2. Adicionar classes utilitarias a um elemento (ex: `className="text-4xl text-red-500"`)
3. Confirmar que estilos sao aplicados no browser

## Error handling

- Se estilos nao aplicam: verificar que `content` no `tailwind.config.ts` inclui todos os diretorios com componentes
- Se erros de importacao no CSS: confirmar que usa `@tailwind base/components/utilities` (v3), nao `@import "tailwindcss"` (v4)
- Se PostCSS falha: verificar que `autoprefixer` e `postcss` estao instalados

## Heuristics

| Situacao | Acao |
|----------|------|
| Next.js 15 novo com Tailwind v4 padrao | Seguir todos os steps acima |
| Projeto ja tem Tailwind v3 | Apenas verificar content paths |
| Pasta `app/` tambem existe | Adicionar `./src/app/**/*.{js,jsx,ts,tsx,mdx}` ao content |
| Usando JavaScript puro | Manter `tailwind.config.js` com `module.exports` |

## Troubleshooting

### Estilos Tailwind nao aplicam
**Symptom:** Classes Tailwind no JSX nao geram CSS correspondente
**Cause:** Arquivo/pasta nao esta mapeado no array `content` do tailwind.config
**Fix:** Adicionar o path da pasta no `content` do tailwind.config: `'./src/{nova-pasta}/**/*.{js,ts,jsx,tsx}'`. Reiniciar o servidor de desenvolvimento

### Fontes customizadas nao carregam
**Symptom:** Fonte do Google Fonts/local nao aparece, fallback e usado
**Cause:** Configuracao incorreta do next/font ou CSS variable nao aplicada
**Fix:** Usar `next/font/google` ou `next/font/local` e aplicar a className no elemento raiz do layout. Verificar que a variavel CSS esta sendo referenciada no Tailwind config

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-instalando-o-tailwind-css-v-3-1/references/deep-explanation.md) — A partir do Next.js 15, o setup padrao (`create-next-app`) instala Tailwind CSS v4 automaticamente. 
- [code-examples.md](../../../data/skills/next-js/rs-next-js-instalando-o-tailwind-css-v-3-1/references/code-examples.md) — pnpm remove tailwindcss
