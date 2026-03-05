---
name: rs-next-js-diferencas-entre-app-e-document
description: "Enforces correct usage of _app and _document files in Next.js Pages Router. Use when user asks to 'create a Next.js page', 'add global styles', 'configure document head', 'add providers', 'setup layout', or any Pages Router task. Applies rules: global state/styles/providers go in _app, HTML structure/meta/fonts/scripts go in _document. Make sure to use this skill whenever working with Next.js Pages Router architecture. Not for App Router (app/ directory), API routes, or individual page components."
---

# _app vs _document no Next.js Pages Router

> Coloque estado, estilos e providers no _app. Coloque estrutura HTML, meta tags e fontes no _document.

## Rules

1. **_app e obrigatorio, _document e opcional** — nunca delete o _app, porque ele controla a renderizacao de todas as paginas
2. **_app executa no client E no server** — coloque aqui tudo que precisa reagir a mudancas de estado e navegacao, porque ele re-executa a cada transicao de pagina
3. **_document executa APENAS no server** — nunca coloque logica interativa ou event handlers aqui, porque nao ha client-side execution
4. **Estilos globais vao no _app** — imports como globals.css ou Tailwind pertencem ao _app.tsx, porque o _document nao processa estilos
5. **Providers de contexto vao no _app** — Redux, Context API, Zustand, Material UI providers envolvem o Component no _app, porque ele e o wrapper de todas as paginas
6. **Meta tags, fontes e scripts vao no _document** — use Head, Html, Main e NextScript no _document, porque ele define a estrutura HTML inicial do servidor

## How to write

### _app.tsx (estado, estilos, providers, layout)

```typescript
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Layout } from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}
```

### _document.tsx (estrutura HTML, meta, fontes, scripts)

```typescript
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

## Example

**Before (tudo misturado no _app):**
```typescript
// _app.tsx — ERRADO: meta tags e fontes aqui
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
```

**After (separacao correta):**
```typescript
// _document.tsx — estrutura HTML e fontes
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

// _app.tsx — estado e estilos globais
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

## Heuristics

| Situacao | Coloque no |
|----------|-----------|
| Import de CSS global (Tailwind, globals.css) | _app |
| Provider de estado (Redux, Context, Zustand) | _app |
| Layout compartilhado entre paginas | _app |
| Google Fonts ou fontes externas | _document |
| Meta tags globais (charset, viewport) | _document |
| Scripts de terceiros (analytics, tracking) | _document |
| Transicao de pagina / loading state | _app |
| Atributo lang no HTML | _document |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar Provider no _document | Colocar Provider no _app |
| Importar CSS global no _document | Importar CSS global no _app |
| Usar event handlers no _document | Usar event handlers no _app |
| Deletar o _app | _app e obrigatorio, mantenha sempre |
| Definir fontes no _app | Definir fontes no _document via Head |
| Colocar console.log esperando client no _document | _document so executa no server |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
