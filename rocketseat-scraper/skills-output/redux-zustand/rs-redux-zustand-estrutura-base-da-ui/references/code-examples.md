# Code Examples: Estrutura Base da UI

## Instalacao completa do Tailwind com Vite

```bash
# 1. Instalar dependencias
npm install -D tailwindcss postcss autoprefixer

# 2. Inicializar configs (flag -p e CRITICO para Vite)
npx tailwindcss init -p
```

Resultado: cria `tailwind.config.js` E `postcss.config.js`.

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## postcss.config.js (gerado pelo -p)

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  -webkit-font-smoothing: antialiased;
}
```

## Player completo (versao estatica)

```tsx
import { MessageCircle } from 'lucide-react'

export function Player() {
  return (
    <div className="h-screen bg-zinc-950 text-zinc-50 flex justify-center items-center">
      <div className="flex w-[1100px] flex-col gap-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Fundamentos do Redux</h1>
            <span className="text-sm text-zinc-400">
              Módulo: Desvendando o Redux
            </span>
          </div>

          <button className="flex items-center gap-2 rounded bg-violet-500 px-3 py-2 text-sm font-medium text-white hover:bg-violet-600">
            <MessageCircle className="w-4 h-4" />
            Deixar feedback
          </button>
        </header>

        {/* Main: Video + Modules sidebar */}
        <main className="relative flex overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow">
          <div className="flex-1">
            {/* Video player vai aqui */}
          </div>

          <aside className="w-80 border-l border-zinc-800 bg-zinc-900 h-[600px]">
            {/* Lista de modulos e aulas vai aqui */}
          </aside>
        </main>
      </div>
    </div>
  )
}
```

## Importacao no App.tsx

```tsx
import { Player } from './pages/player'

function App() {
  return <Player />
}

export default App
```

## Importacao de estilos no main.tsx

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## Instalacao do Lucide React (icones)

```bash
npm install lucide-react
```

Uso:
```tsx
import { MessageCircle } from 'lucide-react'

// Como componente com classes Tailwind
<MessageCircle className="w-4 h-4" />
```