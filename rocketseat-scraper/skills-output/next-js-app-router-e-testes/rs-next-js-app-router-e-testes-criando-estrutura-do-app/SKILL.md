---
name: rs-nextjs-app-router-criando-estrutura
description: "Generates initial Next.js App Router project structure with font variables, Tailwind config, and ESLint setup. Use when user asks to 'create a Next.js project', 'setup Next.js app router', 'configure Next.js with Tailwind', 'start a new e-commerce project', or 'scaffold a Next.js app'. Make sure to use this skill whenever setting up a new Next.js 13+ project with App Router. Not for page creation, component building, API routes, or deploying existing projects."
---

# Criando Estrutura do App Next.js (App Router)

> Configure um projeto Next.js App Router com fontes via CSS variables, Tailwind otimizado e ESLint padronizado.

## Prerequisites

- Node.js 18+
- Package manager (npm/yarn/pnpm)
- Se usar ESLint Rocketseat: `npm i -D @rocketseat/eslint-config`

## Steps

### Step 1: Criar o projeto

```bash
npx create-next-app@latest dev-store
# Aceitar: TypeScript, Tailwind, src/, App Router
cd dev-store
```

### Step 2: Limpar arquivos desnecessarios

- Remover `README.md`
- Remover SVGs de `public/`
- Remover `favicon.ico` de `src/app/`
- Em `globals.css`, manter apenas as diretivas do Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Em `page.tsx`, substituir conteudo por um placeholder simples:

```tsx
export default function Home() {
  return <h1>Hello World</h1>
}
```

### Step 3: Configurar fonte com CSS variable

No `layout.tsx`, usar `variable` ao inves de aplicar a fonte diretamente no body:

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Dev Store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### Step 4: Configurar Tailwind para usar a variavel

Em `tailwind.config.ts`, configurar `fontFamily` apontando para a CSS variable:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-inter)',
      },
    },
  },
  plugins: [],
}

export default config
```

### Step 5: Configurar ESLint

```bash
npm i -D @rocketseat/eslint-config
```

No `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "@rocketseat/eslint-config/next"]
}
```

Passar arquivo por arquivo salvando para aplicar auto-fix.

## Verification

- `npm run dev` inicia sem erros
- Pagina exibe "Hello World"
- `npm run lint` passa sem erros
- No DevTools, verificar que `--font-inter` existe como CSS variable no `<html>`

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto com 2+ fontes | Criar uma `variable` para cada fonte, registrar cada uma no Tailwind |
| Sem ESLint Rocketseat | Usar apenas `next/core-web-vitals` no extends |
| Projeto existente | Aplicar apenas os steps 3-5 sem recriar o projeto |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Aplicar fonte direto no className do body | Usar `variable` na fonte e CSS variable no Tailwind, porque permite multiplas fontes |
| Deixar theme do Tailwind com configs padrao inuteis | Limpar theme, manter minimo necessario |
| Manter README/SVGs/favicon padrao do Next | Remover tudo que nao pertence ao projeto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
