# Code Examples: Criando Projeto com Tailwind

## 1. Criacao do projeto

```bash
# Usando pnpm
pnpm create next-app tailwind-next

# Respostas no wizard:
# Would you like to use TypeScript? Yes
# Would you like to use ESLint? Yes
# Would you like to use Tailwind CSS? Yes
# Would you like to use `src/` directory? Yes
# Would you like to use App Router? Yes
# Would you like to customize the default import alias? Yes (@/)
```

## 2. tailwind.config.ts — padrao vs otimizado

### Padrao gerado pelo Next.js:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
```

### Otimizado pelo instrutor:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        diego: '#823996',
      },
    },
  },
  plugins: [],
}
export default config
```

## 3. globals.css limpo

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Apenas as tres diretivas. Todo CSS padrao do Next.js foi removido.

## 4. Pagina inicial limpa (src/app/page.tsx)

```tsx
export default function Home() {
  return <h1>Hello Tailwind</h1>
}
```

Remover todas as importacoes e conteudo padrao do Next.js.

## 5. Demonstracao do reset de estilos

```tsx
export default function Home() {
  return (
    <div>
      <h1>Hello Tailwind</h1>
      <h2>Hello Tailwind</h2>
      <p>Hello Tailwind</p>
    </div>
  )
}
```

Resultado: todos os tres elementos aparecem visualmente identicos (mesmo tamanho, mesmo peso de fonte). O Tailwind reseta estilos padrao do navegador.

## 6. Aplicando classes basicas

```tsx
export default function Home() {
  return (
    <div className="h-screen bg-slate-900 p-8 text-slate-100">
      <h1 className="font-bold text-5xl text-violet-500">
        Hello Tailwind
      </h1>
      <h2>Hello Tailwind</h2>
      <p>Hello Tailwind</p>
    </div>
  )
}
```

### Detalhamento de cada classe:

| Classe | CSS resultante | Explicacao |
|--------|---------------|------------|
| `h-screen` | `height: 100vh` | Ocupa altura total da viewport |
| `bg-slate-900` | `background-color: #0f172a` | Fundo cinza-azulado escuro |
| `p-8` | `padding: 2rem` (32px) | Padding de 32px (8 × 4) |
| `text-slate-100` | `color: #f1f5f9` | Texto cinza claro para todos os filhos |
| `font-bold` | `font-weight: 700` | Texto em negrito |
| `text-5xl` | `font-size: 3rem` (48px) | Texto grande |
| `text-violet-500` | `color: #8b5cf6` | Texto roxo (sobrescreve o slate-100 do pai) |

## 7. Usando cor customizada do tema

```tsx
{/* Apos adicionar 'diego' no tailwind.config.ts */}
<h1 className="text-diego">Hello Tailwind</h1>
```

A extensao Tailwind CSS IntelliSense reconhece automaticamente e mostra a cor no autocomplete.

## 8. Referencia rapida de espacamento

```
p-1  = 4px    (1 × 4)
p-2  = 8px    (2 × 4)
p-4  = 16px   (4 × 4)
p-8  = 32px   (8 × 4)
p-16 = 64px   (16 × 4)
```

## 9. h-full vs h-screen

```tsx
{/* NAO funciona para ocupar tela toda */}
<div className="h-full bg-slate-900">...</div>

{/* FUNCIONA — usa 100vh */}
<div className="h-screen bg-slate-900">...</div>
```

`h-full` resulta em `height: 100%`, que depende do pai ter altura definida. Como HTML e Body nao tem `height: 100%` por padrao, nao funciona. `h-screen` resulta em `height: 100vh`, que referencia diretamente a viewport.