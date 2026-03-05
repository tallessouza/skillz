# Code Examples: Setup Design System (shadcn/ui)

## Inicializacao completa

```bash
# 1. Inicializar shadcn/ui
npx shadcn@latest init

# Selecionar: neutral style, sim para dependencias

# 2. Criar pasta de estilos e mover CSS
mkdir -p src/styles
mv src/app/globals.css src/styles/global.css
```

## Layout com import corrigido

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import '@/styles/global.css'

export const metadata: Metadata = {
  title: 'Prompt Manager',
  description: 'Manage your prompts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

## Instalando e usando um componente

```bash
# Instalar componente button
npx shadcn@latest add button
```

```typescript
// Componente gerado em src/components/ui/button.tsx
// Ja vem pronto para uso:

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main>
      <Button variant="default">Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Delete</Button>
    </main>
  )
}
```

## Instalando multiplos componentes

```bash
# Instalar conforme necessidade do projeto
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add textarea
```

## Estrutura de arquivos resultante

```
src/
├── styles/
│   └── global.css           # Variaveis CSS do tema
├── components/
│   └── ui/
│       ├── button.tsx        # Componente local, editavel
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── lib/
│   └── utils.ts             # Funcao cn() para class merging
├── app/
│   ├── layout.tsx            # Import: @/styles/global.css
│   └── page.tsx
├── components.json           # Config do shadcn CLI
└── tailwind.config.ts
```

## Customizacao de tema (mencionada para aulas futuras)

```css
/* src/styles/global.css */
@layer base {
  :root {
    /* Estas variaveis serao customizadas */
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    /* ... outras variaveis de tema */
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    /* ... variaveis do tema escuro */
  }
}
```