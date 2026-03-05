---
name: rs-electron-setup-do-tailwindcss
description: "Guides TailwindCSS setup in Electron apps using Vite. Use when user asks to 'setup tailwind in electron', 'configure tailwind with vite', 'add css framework to electron app', or 'fix postCSS config error in electron'. Covers installation, config file placement, PostCSS inline config workaround for ESM, and font-family extension. Make sure to use this skill whenever setting up styling in an Electron+Vite project. Not for React/Next.js Tailwind setup, Tailwind usage patterns, or CSS-in-JS solutions."
---

# Setup do TailwindCSS no Electron com Vite

> Configure TailwindCSS como plugin PostCSS dentro de um projeto Electron que usa Vite, resolvendo o problema de config path com ESM.

## Prerequisites

- Projeto Electron com Vite configurado (electron-vite ou similar)
- Node.js 18+
- Extensoes VSCode: Tailwind CSS IntelliSense + PostCSS Language Support

## Steps

### Step 1: Instalar dependencias

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Step 2: Inicializar Tailwind dentro do renderer

```bash
cd src/renderer
npx tailwindcss init -p
```

Isso cria `tailwind.config.js` e `postcss.config.js` dentro de `src/renderer/`.

### Step 3: Configurar tailwind.config.js

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

### Step 4: Resolver erro PostCSS com ESM (critico)

O `postcss.config.js` dentro de `src/renderer/` causa erro:
```
Cannot read properties of undefined reading config postCSS
```

**Solucao:** Remover `postcss.config.js` e configurar PostCSS inline no Vite config:

```javascript
import tailwindcss from 'tailwindcss'

// Dentro do vite config do renderer:
{
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: './src/renderer/tailwind.config.js',
        }),
      ],
    },
  },
}
```

### Step 5: Criar arquivo global de estilos

Criar `src/renderer/src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 6: Importar no App

```typescript
import './styles/global.css'
```

## Error handling

- Se `dynamic require of tailwindcss is not supported` → usar `import` em vez de `require` no config (projeto usa ESM)
- Se classes Tailwind nao aplicam → verificar `content` paths no `tailwind.config.js`
- Se IntelliSense nao funciona → instalar extensoes PostCSS + Tailwind no VSCode

## Verification

- Aplicar classe como `text-violet-400 font-bold text-4xl` em um elemento
- Reiniciar app (`npm run dev`) e confirmar que estilos aplicam corretamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
