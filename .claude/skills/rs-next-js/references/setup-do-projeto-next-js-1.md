---
name: rs-next-js-setup-do-projeto-next-js-1
description: "Applies Next.js App Router project setup conventions when scaffolding or configuring a Next.js application. Use when user asks to 'create a next app', 'setup next.js project', 'configure next.js', 'start a new next project', or 'initialize next app router'. Covers pnpm setup with --empty flag, React Compiler, Biome config, layout structure, and metadata API. Make sure to use this skill whenever creating a new Next.js 14+ project from scratch. Not for page routing, API routes, data fetching, or deployment configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: project-setup
  tags: [next-js, app-router, pnpm, react-compiler, biome, metadata-api, project-scaffold]
---

# Setup do Projeto Next.js (App Router)

> Ao criar um projeto Next.js com App Router, use o template empty, React Compiler, e Biome para comecar com uma base limpa e otimizada.

## Rules

1. **Use pnpm com flag `--empty`** — `pnpm create next-app --empty`, porque o template padrao traz estilos e homepage desnecessarios que voce vai apagar de qualquer forma
2. **Ative o React Compiler** — selecione "yes" no setup, porque ele elimina a necessidade de `useMemo`, `useCallback` e `React.memo` manuais ao adicionar otimizacoes automaticas no build
3. **Use Biome ao inves de ESLint+Prettier** — porque unifica linting e formatting em uma unica ferramenta com performance superior
4. **Nao inclua head no layout** — o Next.js gera o `<head>` automaticamente a partir do objeto `metadata`, entao nunca adicione `<head>` manualmente no layout
5. **Layout e o wrapper global** — use `layout.tsx` para providers de contexto e tudo que deve ser compartilhado com toda a aplicacao
6. **Commit a estrutura base antes de comecar features** — `git add . && git commit` com a estrutura limpa como primeiro commit

## How to write

### Criacao do projeto

```bash
pnpm create next-app --empty board
# Selecionar:
# TypeScript: Yes
# Biome: Yes
# React Compiler: Yes
# Tailwind CSS: Yes
# src/ directory: Yes
# App Router: Yes
```

### Estrutura resultante (template empty)

```
board/
├── src/
│   └── app/
│       ├── layout.tsx    # Wrapper global (HTML + body + providers)
│       ├── page.tsx      # Apenas "Hello World" (limpo)
│       └── globals.css   # Apenas imports do Tailwind
├── next.config.ts        # Apenas reactCompiler: true
├── biome.json            # Configuracoes recomendadas pelo Next
└── package.json
```

### Layout padrao (App Router)

```typescript
// src/app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Board App",
  description: "Public roadmap board",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

### Metadata API (substitui o head)

```typescript
// Tudo que iria no <head> vai no objeto metadata
export const metadata: Metadata = {
  title: "Board App",
  description: "Public roadmap board",
  openGraph: {
    title: "Board App",
    images: ["/og-image.png"],
  },
}
```

### Configuracao do Biome (semicolons opcionais)

```json
{
  "javascript": {
    "formatter": {
      "semicolons": "asNeeded"
    }
  }
}
```

## Example

**Before (template padrao com lixo):**
```
src/app/
├── page.tsx          # Homepage com estilos inline, SVGs, links
├── page.module.css   # CSS modules desnecessarios
├── layout.tsx        # Layout com fonts, metadata complexo
├── globals.css       # Reset CSS extenso + variaveis
└── favicon.ico
```

**After (template --empty, limpo):**
```
src/app/
├── page.tsx          # Apenas: export default function Page() { return <div>Hello World</div> }
├── layout.tsx        # HTML + body + metadata basico
└── globals.css       # Apenas @tailwind imports
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto Next.js | Sempre use `--empty` flag |
| Precisa de memo/useCallback | Confie no React Compiler, nao adicione manualmente |
| Configurar linting | Use Biome, nao ESLint+Prettier |
| Adicionar meta tags | Use o objeto `metadata` no layout/page, nunca `<head>` manual |
| Providers globais (theme, auth) | Adicione no `layout.tsx` envolvendo `{children}` |
| Primeiro commit | Faca antes de qualquer feature, com estrutura base limpa |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `npx create-next-app` (sem --empty) | `pnpm create next-app --empty` |
| Adicionar `<head>` no layout.tsx | Usar objeto `metadata` exportado |
| `useMemo`/`useCallback` manual com React Compiler ativo | Confiar no compilador |
| ESLint + Prettier separados | Biome unico |
| Commit apos varias features | Commit da estrutura base primeiro |
| Manter README padrao do template | Apagar e criar o seu |

## Troubleshooting

### Erro ao iniciar projeto Next.js
**Symptom:** `npm run dev` falha com erros de modulo ou dependencia
**Cause:** Dependencias nao instaladas, versao do Node incompativel, ou conflito de pacotes
**Fix:** Rodar `npm install` para garantir dependencias. Verificar versao do Node (`node -v`, minimo 18+). Deletar `node_modules` e `package-lock.json` e reinstalar

### TypeScript errors no projeto novo
**Symptom:** Erros de tipo em arquivos recem-criados
**Cause:** tsconfig.json nao inclui os paths corretos ou falta `@types` de dependencias
**Fix:** Verificar `include` no tsconfig.json. Instalar types necessarios: `npm i -D @types/react @types/node`

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-setup-do-projeto-next-js-1/references/deep-explanation.md) — O instrutor destaca que a App Folder (App Router) e "a estrutura mais atual" para criar aplicacoes N
- [code-examples.md](../../../data/skills/next-js/rs-next-js-setup-do-projeto-next-js-1/references/code-examples.md) — pnpm create next-app --empty board
