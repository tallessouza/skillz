---
name: rs-a11y-react-setup-do-projeto
description: "Generates Next.js project setup optimized for accessibility when user asks to 'create a next app', 'setup next.js project', 'start accessibility project', 'configure next.js from scratch', or 'setup _document.tsx'. Applies folder structure with src/, TypeScript auto-config, custom _document.tsx with Next.js special components, and Google Fonts integration. Make sure to use this skill whenever scaffolding a new Next.js Pages Router project. Not for App Router, not for Vite/CRA setups, not for existing project refactoring."
---

# Setup de Projeto Next.js para Acessibilidade

> Configure um projeto Next.js Pages Router com estrutura limpa, TypeScript, _document.tsx customizado e fontes externas.

## Prerequisites

- Node.js 18+
- Yarn, npm ou pnpm instalado
- Terminal na pasta do usuario (nunca em System32 no Windows)

## Steps

### Step 1: Criar o projeto

```bash
yarn create next-app curso-acessibilidade
# Ou: npx create-next-app curso-acessibilidade
cd curso-acessibilidade
code .
```

### Step 2: Limpar estrutura inicial

Remover arquivos desnecessarios:
- `pages/api/` (rotas serverless nao utilizadas)
- `public/favicon.ico` e `public/vercel.svg`
- `styles/Home.module.css`
- Limpar conteudo de `styles/globals.css` (manter o arquivo)

### Step 3: Criar pasta src e mover codigo

```
src/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
└── styles/
    └── globals.css
```

Mover `pages/` e `styles/` para dentro de `src/`.

### Step 4: Ativar TypeScript

Renomear arquivos `.js` para `.tsx` e rodar:

```bash
yarn dev
```

Next.js detecta `.tsx` e instala automaticamente `typescript`, `@types/react` e `@types/node`, criando `tsconfig.json`.

### Step 5: Configurar _document.tsx

```tsx
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
```

### Step 6: Limpar _app.tsx e index.tsx

```tsx
// _app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

```tsx
// index.tsx
export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}
```

## Error handling

- Se `crossOrigin` der erro de tipo, passe como string: `crossOrigin="anonymous"` (nao booleano)
- Tags `<link>` do Google Fonts devem ser auto-fechadas em JSX: `<link ... />`
- Se alterar `_document.tsx` nao refletir, reinicie o dev server (versoes antigas do Next)

## Verification

1. `yarn dev` roda sem erros
2. `localhost:3000` exibe a pagina
3. Inspecionar HTML: tag `<html>` presente, fonts carregando no `<head>`
4. Aplicar `font-family: 'Roboto'` e confirmar fonte renderizada

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa controlar `<html lang>`, `<head>`, `<body>` | Use `_document.tsx` |
| Precisa de estado global ou CSS global | Use `_app.tsx` |
| Precisa de rotas API | Recrie `pages/api/` (removida no cleanup) |
| Next.js App Router (v13+) | NAO use este setup — use `layout.tsx` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
