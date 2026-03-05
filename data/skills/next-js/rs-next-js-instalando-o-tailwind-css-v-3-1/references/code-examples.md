# Code Examples: Instalando Tailwind CSS v3 no Next.js 15

## Comandos de instalacao completos

### Com pnpm
```bash
pnpm remove tailwindcss
pnpm install tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### Com npm
```bash
npm uninstall tailwindcss
npm install tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

## tailwind.config.ts completo

```typescript
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

## tailwind.config.js (versao JavaScript)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## src/styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## postcss.config.mjs (ESM)

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

## postcss.config.js (CommonJS padrao gerado pelo init)

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## Teste rapido para verificar funcionamento

```tsx
// src/pages/index.tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <h2 className="text-4xl text-gray-400">Title</h2>
    </div>
  );
}
```

Ao salvar e abrir `localhost:3000`, o texto deve aparecer cinza claro sobre fundo escuro. Se aparecer sem estilizacao, verificar content paths e diretivas no globals.css.