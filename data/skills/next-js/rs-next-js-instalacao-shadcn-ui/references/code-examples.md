# Code Examples: Instalacao shadcn/ui

## Inicializacao completa

```bash
# 1. Inicializar shadcn/ui
pnpm dlx shadcn-ui@latest init

# Respostas:
# Style: default
# Base color: gray
# CSS variables: yes
# Force: yes

# 2. Instalar um componente (ex: button)
pnpm dlx shadcn-ui@latest add button
```

## Estrutura do Button gerado

O componente gerado em `src/components/ui/button.tsx` inclui:

```tsx
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
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Uso basico no Next.js

```tsx
// src/pages/index.tsx
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}
```

## Passando props HTML nativas

```tsx
<Button
  variant="secondary"
  onClick={() => console.log("clicked")}
  disabled={isLoading}
>
  Submit
</Button>
```

O Button aceita todas as propriedades nativas do `<button>` HTML (onChange, onClick, disabled, type, etc).

## Helper cn() gerado

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Instalando outros componentes

```bash
# Cada componente segue o mesmo padrao
pnpm dlx shadcn-ui@latest add alert
pnpm dlx shadcn-ui@latest add avatar
pnpm dlx shadcn-ui@latest add badge
pnpm dlx shadcn-ui@latest add breadcrumb
pnpm dlx shadcn-ui@latest add dialog
```