# Code Examples: Setup de Projeto Next.js para Acessibilidade

## 1. Criacao do projeto

```bash
# Com Yarn
yarn create next-app curso-acessibilidade

# Com NPM
npx create-next-app curso-acessibilidade

# Acessar a pasta
cd curso-acessibilidade
code .
```

## 2. Estrutura apos limpeza

```
curso-acessibilidade/
├── src/
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   └── index.tsx
│   └── styles/
│       └── globals.css
├── public/           (vazia)
├── tsconfig.json     (auto-gerado)
├── package.json
└── next.config.js
```

Arquivos removidos:
- `pages/api/` (inteira)
- `public/favicon.ico`
- `public/vercel.svg`
- `styles/Home.module.css`

## 3. _document.tsx completo

```tsx
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Preconnect para performance de fontes */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          {/* Roboto 400 (regular) e 700 (bold) */}
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

### Pontos importantes no codigo:

1. **Tags `<link>` auto-fechadas** — JSX exige `<link ... />` em vez de `<link ...>`
2. **`crossOrigin="anonymous"`** — string, nao booleano
3. **`Html`, `Head`, `Main`, `NextScript`** — componentes do `next/document`, nao tags HTML

## 4. _app.tsx limpo

```tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

## 5. index.tsx minimo

```tsx
export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}
```

## 6. Verificando a fonte

```css
/* globals.css */
body {
  font-family: 'Roboto', sans-serif;
}
```

Abra o DevTools > Elements > Computed e confirme que `font-family` mostra Roboto.

## 7. Ativacao do TypeScript

```bash
# Renomear arquivos
mv src/pages/_app.js src/pages/_app.tsx
mv src/pages/index.js src/pages/index.tsx

# Rodar dev — TypeScript e instalado automaticamente
yarn dev
```

O terminal mostrara:
```
We detected TypeScript in your project and created a tsconfig.json file for you.
```