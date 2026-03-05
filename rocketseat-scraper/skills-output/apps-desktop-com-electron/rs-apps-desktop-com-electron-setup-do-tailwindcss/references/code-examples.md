# Code Examples: Setup do TailwindCSS no Electron

## Instalacao completa

```bash
# Na raiz do projeto
npm install -D tailwindcss postcss autoprefixer

# Dentro do renderer
cd src/renderer
npx tailwindcss init -p
```

## tailwind.config.js (dentro de src/renderer/)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

O `content` define onde o Tailwind procura classes usadas. `./src/**/*.tsx` cobre qualquer arquivo TSX dentro de qualquer subpasta (components, pages, etc.).

## PostCSS inline config no Vite (solucao para ESM)

```javascript
import tailwindcss from 'tailwindcss'

// electron.vite.config.ts — secao renderer
export default defineConfig({
  renderer: {
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            config: './src/renderer/tailwind.config.js',
          }),
        ],
      },
    },
    // ... resto do config
  },
})
```

## global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Importacao no App.tsx

```typescript
import './styles/global.css'

export function App() {
  return (
    <h1 className="text-violet-400 font-bold text-4xl">
      Hello World
    </h1>
  )
}
```

## Tentativa que NAO funciona (require em ESM)

```javascript
// postcss.config.js — CAUSA ERRO em projetos ESM
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
// Erro: dynamic require of tailwindcss is not supported
```

## Estrutura de pastas resultante

```
src/
└── renderer/
    ├── tailwind.config.js     # Config do Tailwind (fica aqui)
    ├── src/
    │   ├── styles/
    │   │   └── global.css     # @tailwind directives
    │   ├── App.tsx             # Importa global.css
    │   └── components/
    └── index.html
```

Nota: o `postcss.config.js` gerado pelo `init -p` deve ser **removido** — a config PostCSS vai inline no Vite config.