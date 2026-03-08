# Code Examples: Organizando o Projeto React

## App.tsx — Antes (boilerplate do Vite)

```tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
```

## App.tsx — Depois (limpo)

```tsx
export function App() {
  return <h1>App</h1>
}
```

## main.tsx — Antes (boilerplate)

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## main.tsx — Depois (corrigido)

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Note a mudanca: `import App from './App.tsx'` → `import { App } from './App'`

Duas correcoes:
1. Named import com chaves `{ App }` para casar com o named export
2. Remocao da extensao `.tsx` (desnecessaria com o resolver do Vite)

## index.css — Depois

```css
/* Arquivo mantido vazio — sera preenchido com estilos globais */
```

## index.html — Antes

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## index.html — Depois

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Refund</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Mudancas: removido o favicon do Vite, atualizado o title.

## Variacao: Se preferir manter default export

```tsx
// App.tsx com default export
export default function App() {
  return <h1>App</h1>
}

// main.tsx correspondente
import App from './App'
```

Funciona, mas named exports sao preferidos em projetos React modernos por serem mais explicitos e refatoraveis.

## Estrutura final de arquivos

```
projeto/
├── public/                  # Vazio (vite.svg removido)
├── src/
│   ├── App.tsx              # export function App — componente raiz minimo
│   ├── index.css            # Vazio — pronto para estilos globais
│   ├── main.tsx             # import { App } — named import corrigido
│   └── vite-env.d.ts        # Tipos do Vite (nao mexer)
├── index.html               # Title atualizado, favicon removido
├── package.json
├── tsconfig.json
└── vite.config.ts
```