# Code Examples: _app vs _document

## Exemplo 1: console.log para provar onde executa

### No _app.tsx
```typescript
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  console.log('App') // Aparece no terminal E no browser console
  return <Component {...pageProps} />
}
```

**Resultado:** Ao atualizar a pagina no browser, "App" aparece:
- No terminal do servidor (onde roda `pnpm dev`)
- No console do browser (DevTools > Console)

### No _document.tsx
```typescript
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  console.log('Document') // Aparece APENAS no terminal
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

**Resultado:** "Document" aparece APENAS no terminal do servidor. No browser, nada.

## Exemplo 2: Pagina basica com _app

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

```typescript
// pages/index.tsx
export default function Home() {
  return <h2>Hello World</h2>
}
```

O _app recebe `Component` (que e a pagina atual, neste caso Home) e `pageProps` (props vindas de getStaticProps/getServerSideProps).

## Exemplo 3: _app com estilos globais do Tailwind

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app'
import '@/styles/globals.css' // Tailwind vai aqui, NAO no _document

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

## Exemplo 4: _app com multiplos providers

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

## Exemplo 5: _app com layout compartilhado

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  )
}
```

## Exemplo 6: _document com fontes e meta tags

```typescript
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

## Tabela comparativa completa

| Caracteristica | _app | _document |
|---------------|------|-----------|
| Executa no client | Sim | Nao |
| Executa no server | Sim | Sim |
| Re-executa na navegacao | Sim | Nao |
| Obrigatorio | Sim | Nao |
| Estilos globais | Sim | Nao |
| Providers | Sim | Nao |
| Layouts | Sim | Nao |
| Meta tags | Nao | Sim |
| Fontes externas | Nao | Sim |
| Scripts globais | Nao | Sim |
| Atributo lang | Nao | Sim |