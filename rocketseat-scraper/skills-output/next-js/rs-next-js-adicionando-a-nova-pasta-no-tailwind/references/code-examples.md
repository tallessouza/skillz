# Code Examples: Tailwind Content Paths

## Exemplo 1: Configuracao original (antes da refatoracao)

```javascript
// tailwind.config.js — config padrao do Next.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Exemplo 2: Apos criar pasta templates

```javascript
// tailwind.config.js — com templates adicionado
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/templates/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Exemplo 3: Estrutura de pastas do projeto

```
src/
├── pages/
│   └── index.tsx          # Importa LandingPage de templates
├── components/
│   ├── Header/
│   ├── Hero/
│   ├── Features/
│   └── Footer/
└── templates/
    └── LandingPage/
        └── index.tsx      # Compoe os components em uma pagina
```

## Exemplo 4: O import chain

```typescript
// src/pages/index.tsx
import { LandingPage } from '../templates/LandingPage'

export default function Home() {
  return <LandingPage />
}
```

```typescript
// src/templates/LandingPage/index.tsx
import { Header } from '../../components/Header'
import { Hero } from '../../components/Hero'
import { Features } from '../../components/Features'
import { Footer } from '../../components/Footer'

export function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Footer />
    </>
  )
}
```

## Exemplo 5: Variacoes comuns de content paths

```javascript
// Para projetos com layouts, hooks customizados com classes, etc.
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/templates/**/*.{js,ts,jsx,tsx,mdx}',
  './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  './src/hooks/**/*.{js,ts,jsx,tsx}',        // se hooks retornam classNames
  './src/utils/**/*.{js,ts}',                // se utils geram classes dinamicas
]
```

## Diagnostico rapido

```bash
# Verificar quais pastas estao no content
cat tailwind.config.js | grep -A 20 "content"

# Listar todas as pastas em src/ para comparar
ls -d src/*/
```