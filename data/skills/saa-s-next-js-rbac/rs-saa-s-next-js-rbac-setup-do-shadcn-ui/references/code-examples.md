# Code Examples: Setup do shadcn/ui

## Inicializacao completa

```bash
# Parar o servidor de desenvolvimento primeiro
# Ctrl+C

# Inicializar shadcn/ui
pnpm dlx shadcn@latest init

# Opcoes interativas:
# Style: Default
# Base color: Zinc
# CSS variables: Yes
```

## globals.css gerado (estrutura)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    /* ... mais variaveis ... */
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    /* ... mais variaveis ... */
  }
}
```

## Configurar tema Dark no layout

```tsx
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
```

## Instalar multiplos componentes

```bash
pnpm dlx shadcn@latest add alert button input label separator
```

## Estrutura de arquivos criada

```
src/
├── components/
│   └── ui/
│       ├── alert.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── separator.tsx
└── lib/
    └── utils.ts
```

## utils.ts (cn helper)

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Usando um componente instalado

```tsx
// src/app/page.tsx
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div>
      <Button>Sign In</Button>
    </div>
  )
}
```

## Resolver dependencias

```bash
# Se erros de dependencia aparecerem
pnpm install

# No VS Code, reiniciar TS server:
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

## Adicionar mais componentes depois

```bash
# Componentes podem ser adicionados individualmente
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add toast

# Ou multiplos de uma vez
pnpm dlx shadcn@latest add dialog dropdown-menu toast
```

## Verificacao visual

```tsx
// Teste rapido para confirmar que tudo funciona
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <Separator />
      <Button>Sign In</Button>
    </div>
  )
}
```