---
name: rs-saas-nextjs-rbac-setup-nextjs
description: "Applies Next.js project setup conventions within a pnpm monorepo when user asks to 'create a next app', 'setup next.js project', 'configure next in monorepo', or 'start a new frontend project'. Covers pnpm workspace integration, shared ESLint/TSConfig packages, Tailwind CSS, and project cleanup. Make sure to use this skill whenever scaffolding a Next.js app inside an existing monorepo. Not for standalone Next.js projects, API setup, or deployment configuration."
---

# Setup de Projeto Next.js em Monorepo

> Configurar um projeto Next.js dentro de um monorepo pnpm com ESLint, TypeScript e Tailwind compartilhados.

## Prerequisites

- Monorepo pnpm com workspaces configurado
- Pacotes compartilhados: `@saas/eslint-config`, `@saas/tsconfig`, `@saas/prettier`
- Diretorio `apps/` existente

## Steps

### Step 1: Criar o projeto Next.js

```bash
cd apps
npx create-next-app@latest web
```

Opcoes de criacao:
- TypeScript: **Yes**
- ESLint: **No** (configurar via pacote compartilhado)
- Tailwind CSS: **Yes**
- `src/` directory: **Yes**
- App Router: **Yes**
- Import alias: **@/** (default)

### Step 2: Reinstalar dependencias com pnpm

O `create-next-app` instala com npm por padrao. Corrigir:

```bash
cd apps/web
rm -rf node_modules package-lock.json
cd ../..
pnpm install
```

Isso garante que o projeto use pnpm workspaces.

### Step 3: Configurar ESLint com pacote compartilhado

Adicionar ao `devDependencies` do `apps/web/package.json`:

```json
{
  "devDependencies": {
    "@saas/eslint-config": "workspace:*",
    "@saas/prettier": "workspace:*",
    "@saas/tsconfig": "workspace:*"
  }
}
```

Criar `.eslintrc.json`:

```json
{
  "extends": ["@saas/eslint-config/next"]
}
```

Criar `.prettierrc.json` apontando para o pacote compartilhado (igual ao da API).

### Step 4: Extrair TSConfig para pacote compartilhado

No pacote `@saas/tsconfig`, criar `nextjs.json`:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  }
}
```

Atualizar `files` no `package.json` do tsconfig para incluir `nextjs.json`.

No `apps/web/tsconfig.json`, manter apenas:

```json
{
  "extends": "@saas/tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`paths` e `include`/`exclude` ficam locais porque dependem do diretorio atual.

### Step 5: Limpar o projeto

```typescript
// src/app/page.tsx — limpar para o minimo
export default function Home() {
  return <h1>Hello World</h1>
}
```

```css
/* src/app/globals.css — manter apenas Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Remover diretorio `src/app/fonts/` (fonte Geist padrao)
- Remover SVGs de `public/`
- No `layout.tsx`: trocar fonte Geist pela Inter

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

### Step 6: Verificar

```bash
pnpm install
pnpm --filter web dev
```

## Heuristics

| Situacao | Acao |
|----------|------|
| `create-next-app` usado com npx | Remover `package-lock.json` e `node_modules`, reinstalar com `pnpm` |
| ESLint ja vem no scaffolding | Descartar e usar pacote compartilhado do monorepo |
| TSConfig tem opcoes especificas de path | Manter local, extrair o resto para pacote compartilhado |
| Fonte padrao Geist | Substituir por Inter (ou a fonte do projeto) |
| `baseUrl` no tsconfig | Sempre incluir como `"."` porque algumas libs dependem dele |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Manter `package-lock.json` em monorepo pnpm | Remover e usar `pnpm install` |
| Duplicar config ESLint/TSConfig por app | Extrair para pacotes compartilhados |
| Deixar `paths` no tsconfig compartilhado | Manter `paths` e `include/exclude` locais |
| Manter arquivos de boilerplate (SVGs, fontes padrao) | Limpar imediatamente apos scaffold |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-setup-do-projeto-next-js/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-setup-do-projeto-next-js/references/code-examples.md)
