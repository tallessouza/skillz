# Code Examples: Esqueleto de Aplicacao Electron

## 1. BrowserWindow completa para macOS

```typescript
// src/main/index.ts
import { BrowserWindow } from 'electron'

const mainWindow = new BrowserWindow({
  width: 1120,
  height: 700,
  titleBarStyle: 'hiddenInset',
  trafficLightPosition: { x: 20, y: 20 },
  webPreferences: {
    preload: path.join(__dirname, '../preload/index.js'),
  },
})
```

## 2. Vite config com define para process.platform

```typescript
// src/renderer/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.platform': JSON.stringify(process.platform),
  },
})
```

## 3. Tailwind plugin completo para region drag

```javascript
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.region-drag': {
          '-webkit-app-region': 'drag',
        },
        '.region-no-drag': {
          '-webkit-app-region': 'no-drag',
        },
      })
    }),
  ],
}
```

## 4. Layout principal (App.tsx)

```tsx
// src/renderer/src/App.tsx
import { Sidebar } from './components/sidebar'
import { Header } from './components/header'

export function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col max-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-rotion-400">
            Selecione ou crie um documento
          </p>
        </main>
      </div>
    </div>
  )
}
```

## 5. Uso de CLSX para classes condicionais (sidebar)

```tsx
// src/renderer/src/components/sidebar.tsx
import clsx from 'clsx'

const isMacOS = process.platform === 'darwin'

export function Sidebar() {
  return (
    <aside
      className={clsx('w-60 border-r border-rotion-600 bg-rotion-800', {
        'mt-6': isMacOS, // margem extra para traffic lights
      })}
    >
      {/* Div para drag no topo da sidebar */}
      <div className="region-drag h-6" />
      {/* Navegacao */}
      <nav className="region-no-drag">
        {/* items */}
      </nav>
    </aside>
  )
}
```

## 6. Header com drag e no-drag

```tsx
// src/renderer/src/components/header.tsx
export function Header() {
  return (
    <header id="header" className="region-drag flex items-center h-14 px-6 border-b border-rotion-600">
      {/* Breadcrumbs - interativos, precisam de no-drag */}
      <div className="region-no-drag flex items-center gap-2">
        <a href="#">Documents</a>
        <span>/</span>
        <a href="#">Current Document</a>
      </div>

      {/* Acoes - interativas, precisam de no-drag */}
      <div className="region-no-drag ml-auto flex items-center gap-2">
        <button>Delete</button>
      </div>
    </header>
  )
}
```

## 7. CSS global para app fullscreen

```css
/* src/renderer/src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  overflow: hidden;
}
```

## 8. Instalacao das dependencias

```bash
npm install clsx @phosphor-icons/react cmdk
```

## 9. Variacao — titleBarStyle options

```typescript
// Default — title bar nativa padrao
titleBarStyle: 'default'

// Hidden — esconde tudo (sem traffic lights)
titleBarStyle: 'hidden'

// Hidden Inset — esconde title bar, traffic lights dentro da janela
titleBarStyle: 'hiddenInset'
```

## 10. CSS equivalente (sem Tailwind plugin)

```css
/* NAO RECOMENDADO em projetos Tailwind — use o plugin */
#header {
  -webkit-app-region: drag;
}

#header a,
#header button {
  -webkit-app-region: no-drag;
}
```