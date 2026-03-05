# Code Examples: Criando Select com Radix UI + Tailwind

## Instalacao

```bash
# Com pnpm
pnpm add @radix-ui/react-select

# Com npm
npm install @radix-ui/react-select
```

## Componente Select completo

```tsx
'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'

export function Select() {
  return (
    <SelectPrimitive.Root>
      <SelectPrimitive.Trigger
        className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm data-[placeholder]:text-zinc-600"
      >
        <SelectPrimitive.Value placeholder="Select a country..." />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-5 w-5 text-zinc-500" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          side="bottom"
          position="popper"
          sideOffset={8}
          className="z-10 overflow-hidden rounded-lg border border-zinc-200 bg-white w-[--radix-select-trigger-width]"
        >
          <SelectPrimitive.Viewport>
            <SelectPrimitive.Item
              value="br"
              className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-[highlighted]:bg-zinc-50"
            >
              <SelectPrimitive.ItemText className="text-black">
                Brasil
              </SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator>
                <Check className="h-4 w-4 text-violet-500" />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>

            <SelectPrimitive.Item
              value="us"
              className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-[highlighted]:bg-zinc-50"
            >
              <SelectPrimitive.ItemText className="text-black">
                United States
              </SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator>
                <Check className="h-4 w-4 text-violet-500" />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
```

## Uso na page (Server Component)

```tsx
// app/page.tsx (Server Component — sem 'use client')
import { Select } from '@/components/form/select'

export default function Home() {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-700">Country</label>
      <Select />
    </div>
  )
}
```

## Componentizando o SelectItem

Para reutilizacao, extraia o Item:

```tsx
'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check } from 'lucide-react'

interface SelectItemProps {
  value: string
  text: string
}

export function SelectItem({ value, text }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-[highlighted]:bg-zinc-50"
    >
      <SelectPrimitive.ItemText className="text-black">
        {text}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-violet-500" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}
```

## Comparacao: w-full vs CSS variable

```tsx
// NAO FUNCIONA — Content esta no Portal, fora do fluxo do Trigger
<SelectPrimitive.Content className="w-full ...">

// FUNCIONA — usa a variavel CSS que o Radix cria automaticamente
<SelectPrimitive.Content className="w-[--radix-select-trigger-width] ...">

// TAMBEM FUNCIONA — mas desnecessariamente verboso
<SelectPrimitive.Content className="w-[var(--radix-select-trigger-width)] ...">
```

## Data attributes no Tailwind

```tsx
// Placeholder com cor diferente (no Trigger)
className="... data-[placeholder]:text-zinc-600"

// Highlight no hover/keyboard (no Item)
className="... data-[highlighted]:bg-zinc-50"

// Sem valor no data attribute = verifica existencia
// data-[placeholder] = "quando data-placeholder existe"
// data-[state=checked] = "quando data-state e checked"
```

## Propriedades importantes do Content

```tsx
<SelectPrimitive.Content
  side="bottom"       // Direcao de abertura: top | bottom | left | right
  position="popper"   // popper = posicionamento flutuante | item-aligned = alinha com item
  sideOffset={8}      // Distancia em pixels entre Trigger e Content
  className="..."
>
```