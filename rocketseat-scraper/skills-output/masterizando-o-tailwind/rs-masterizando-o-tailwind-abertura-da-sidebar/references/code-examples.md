# Code Examples: Abertura da Sidebar com Radix Collapsible

## Instalação

```bash
npm i @radix-ui/react-collapsible
```

## Import do Collapsible

```tsx
import * as Collapsible from '@radix-ui/react-collapsible'
```

## Sidebar completa (como mostrado na aula)

```tsx
'use client'

import * as Collapsible from '@radix-ui/react-collapsible'
import { Menu } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './Button'
import { Input } from './Input'
import { Nav } from './Nav'
import { Profile } from './Profile'
import { UsedSpaceWidget } from './UsedSpaceWidget'

export function Sidebar() {
  return (
    <Collapsible.Root
      className="
        fixed left-0 right-0 top-0 z-20
        flex flex-col gap-6
        border-b border-zinc-200 bg-white
        p-4
        data-[state=open]:h-screen
        lg:right-auto lg:h-screen lg:w-80
        lg:border-b-0 lg:border-r
        lg:px-5 lg:py-8
        lg:data-[state=closed]:h-screen
      "
    >
      {/* Header: Logo + Trigger */}
      <div className="flex items-center justify-between">
        <Logo />
        <Collapsible.Trigger asChild className="lg:hidden">
          <Button variant="ghost">
            <Menu className="h-6 w-6" />
          </Button>
        </Collapsible.Trigger>
      </div>

      {/* Conteúdo colapsável */}
      <Collapsible.Content
        forceMount
        className="
          flex flex-1 flex-col gap-6
          data-[state=closed]:hidden
          lg:data-[state=closed]:flex
        "
      >
        <Input.Root>
          <Input.Prefix>
            {/* Search icon */}
          </Input.Prefix>
          <Input.Control placeholder="Search" />
        </Input.Root>

        <Nav />

        <div className="mt-auto">
          <UsedSpaceWidget />
          <Profile />
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
```

## Layout com grid (layout.tsx)

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen lg:grid lg:grid-cols-app">
          <Sidebar />
          <main className="px-4 pb-12 pt-24 lg:col-start-2 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
```

## Tailwind config para grid-cols-app

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        app: 'minmax(18rem, 20rem) 1fr',
      },
    },
  },
}
```

## Variação: Sidebar com estado controlado

Se precisar controlar programaticamente:

```tsx
'use client'

import { useState } from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* Mesmo conteúdo */}
    </Collapsible.Root>
  )
}
```

## Data attributes disponíveis do Radix Collapsible

```css
/* No Root e Content */
[data-state="open"]    /* quando aberto */
[data-state="closed"]  /* quando fechado */

/* Uso no Tailwind */
data-[state=open]:h-screen
data-[state=closed]:hidden
lg:data-[state=closed]:flex
```

## Pattern: esconder trigger no desktop, mostrar no mobile

```tsx
{/* O botão só aparece em telas < lg */}
<Collapsible.Trigger asChild className="lg:hidden">
  <Button variant="ghost">
    <Menu className="h-6 w-6" />
  </Button>
</Collapsible.Trigger>
```

## Pattern: conteúdo sempre visível no desktop

```tsx
{/* forceMount mantém no DOM, data-state controla visibilidade */}
<Collapsible.Content
  forceMount
  className="data-[state=closed]:hidden lg:data-[state=closed]:flex"
>
  {/* conteúdo */}
</Collapsible.Content>
```