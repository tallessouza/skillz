# Code Examples: Iniciando Design System com shadcn/ui

## Inicializacao completa do shadcn

```bash
# Inicializar shadcn no projeto Next.js
pnpx shadcn@latest init

# Quando perguntado sobre estilo, selecionar "neutral"
# Isso instala dependencias e cria lib/utils.ts
```

## Instalando componentes individuais

```bash
# Instalar botao
pnpx shadcn@latest add button

# Instalar input (quando necessario)
pnpx shadcn@latest add input

# Instalar toast (quando necessario)
pnpx shadcn@latest add toast
```

## Estrutura de pastas apos setup

```
src/
├── app/
│   ├── layout.tsx          # Import atualizado para styles/globals.css
│   └── page.tsx
├── components/
│   └── ui/
│       └── button.tsx      # Componente gerado pelo shadcn
├── lib/
│   └── utils.ts            # cn() helper gerado pelo shadcn
└── styles/
    └── globals.css         # Design tokens extraidos do Figma
```

## Atualizacao do import no layout

```typescript
// ANTES (default do Next.js)
import "./globals.css"

// DEPOIS (com pasta styles)
import "@/styles/globals.css"
```

## Estrutura do globals.css com design tokens

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Background colors */
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    
    /* Primary */
    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;
    
    /* Secondary */
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    
    /* Accent */
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    
    /* Border, Ring, etc. */
    --border: 214.3 31.8% 91.4%;
    --ring: 221 83% 53%;
    --radius: 0.5rem;
    
    /* Tipografia e demais tokens do Figma */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode tokens */
  }
}

/* Aplicacoes default */
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Verificacao rapida de funcionamento

```tsx
// Em qualquer componente, testar uma classe do design system
export default function Home() {
  return (
    <div>
      <p className="text-accent-blue">Testando design system</p>
    </div>
  )
}
```

## Componente Button gerado pelo shadcn (base antes de customizar)

```typescript
// src/components/ui/button.tsx
// Gerado pelo shadcn — contem muitas variacoes
// O instrutor recomenda LIMPAR as variacoes nao utilizadas

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Remover variacoes nao utilizadas no projeto
      },
      size: {
        default: "h-10 px-4 py-2",
        // Remover tamanhos nao utilizados
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```