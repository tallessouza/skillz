---
name: rs-tailwind-criando-projeto
description: "Guides Tailwind CSS project setup with Next.js and initial configuration. Use when user asks to 'create a Tailwind project', 'setup Next.js with Tailwind', 'configure tailwind.config', or 'start a new frontend project with Tailwind'. Covers content array optimization, theme extension, CSS reset behavior, and VS Code extensions. Make sure to use this skill whenever setting up a new Tailwind + Next.js project from scratch. Not for Tailwind utility class deep-dives, responsive design, or animations."
---

# Criando Projeto com Tailwind

> Configure um projeto Next.js com Tailwind CSS otimizado, entendendo cada decisao de configuracao.

## Rules

1. **Next.js ja inclui Tailwind por padrao** — nao siga guias manuais de instalacao, basta criar o projeto com `create-next-app` e selecionar Yes para Tailwind CSS, porque o Next ja configura tudo automaticamente
2. **Otimize o content array** — remova extensoes desnecessarias (js, jsx, mdx) se o projeto usa apenas TypeScript, porque menos paths = build mais rapido
3. **Tailwind e um plugin do PostCSS** — nunca trate como framework independente, porque ele depende do PostCSS para funcionar
4. **Use import alias com @/** — selecione Yes para import alias no setup, porque evita cadeias de `../../..` nas importacoes
5. **Instale as duas extensoes VS Code obrigatorias** — PostCSS Language Support e Tailwind CSS IntelliSense, porque sem elas perde-se autocomplete e preview de classes
6. **Pense em semantica, nao em visual** — o Tailwind reseta todos os estilos HTML (h1, h2, p ficam iguais), porque elementos devem ser escolhidos pelo significado semantico, nao pela aparencia padrao

## Setup

### Criar projeto

```bash
# pnpm (recomendado)
pnpm create next-app tailwind-next

# yarn
yarn create next-app tailwind-next

# npm
npx create-next-app tailwind-next
```

Selecoes no wizard:
- TypeScript: **Yes**
- Tailwind CSS: **Yes**
- Import Alias (@/): **Yes**
- Demais: usar recomendado

### Otimizar tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.tsx',  // Apenas TSX se o projeto e TypeScript puro
  ],
  theme: {
    extend: {
      colors: {
        // Cores customizadas do projeto
        brand: '#8239F6',
      },
    },
  },
  plugins: [],
}

export default config
```

### Limpar globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Remover todo CSS padrao do Next.js */
```

## Exemplo

**Before (content padrao do Next.js — verboso):**
```typescript
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

**After (otimizado para projeto TypeScript):**
```typescript
content: [
  './src/**/*.tsx',
],
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto usa apenas TypeScript | Content: `./src/**/*.tsx` |
| Projeto mistura JS e TS | Content: `./src/**/*.{tsx,jsx}` |
| Usa MDX para blog | Adicionar `./src/**/*.mdx` ao content |
| Precisa de cor customizada | Adicionar em `theme.extend.colors` |
| Espacamento em Tailwind | Dividir pixels por 4 (16px = `p-4`, 32px = `p-8`) |
| Ocupar tela inteira (height) | Usar `h-screen` (100vh), nao `h-full` (100%) |
| Texto nao aparece sobre fundo escuro | Aplicar `text-slate-100` ou similar no container |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Seguir guia manual de instalacao no Next.js | Criar projeto com `create-next-app` (ja vem configurado) |
| Deixar extensoes desnecessarias no content | Manter apenas extensoes que o projeto realmente usa |
| Escolher h1/h2 pelo tamanho visual | Escolher pela semantica, estilizar com classes |
| Usar `h-full` para ocupar tela toda | Usar `h-screen` (100vh) |
| Esquecer extensoes do VS Code | Instalar PostCSS Language Support + Tailwind CSS IntelliSense |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-criando-projeto-com-tailwind/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-criando-projeto-com-tailwind/references/code-examples.md)
