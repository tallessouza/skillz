# Code Examples: Componentizando o Select

## Exemplo completo do SelectItem

```tsx
'use client'

import * as Select from '@radix-ui/react-select'
import { type SelectItemProps } from '@radix-ui/react-select'
import { Check } from 'lucide-react'

interface SelectItemCustomProps extends SelectItemProps {
  text: string
}

export function SelectItem({ text, ...props }: SelectItemCustomProps) {
  return (
    <Select.Item
      {...props}
      className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-[highlighted]:bg-zinc-50"
    >
      <Select.ItemText className="text-black">
        {text}
      </Select.ItemText>
      <Select.ItemIndicator>
        <Check className="h-4 w-4 text-violet-500" />
      </Select.ItemIndicator>
    </Select.Item>
  )
}
```

## Uso do Select com países

```tsx
import { Select } from './Select'
import { SelectItem } from './Select/SelectItem'

// Country select
<Select placeholder="Select a country">
  <SelectItem value="br" text="Brasil" />
  <SelectItem value="us" text="United States" />
</Select>
```

## Uso do Select com timezones

```tsx
// Timezone select
<Select placeholder="Select a timezone">
  <SelectItem value="utc-3" text="America/São Paulo (UTC-3)" />
  <SelectItem value="utc-8" text="Pacific (UTC-8)" />
</Select>
```

## Estrutura de pasta final

```
src/
  components/
    Select/
      index.tsx          # Select root component
      SelectItem.tsx     # Individual select option
```

## Pattern de extensão de props do Radix

```tsx
// Forma rápida: usar os tipos exportados pelo Radix
import { type SelectItemProps } from '@radix-ui/react-select'

interface MyProps extends SelectItemProps {
  // props customizadas aqui
  text: string
}

// Forma alternativa (quando tipo direto não existe):
import * as Select from '@radix-ui/react-select'
import { ComponentProps } from 'react'

type MyProps = ComponentProps<typeof Select.Item> & {
  text: string
}
```

## Diferença entre Composition Pattern e este approach

```tsx
// Composition Pattern (usado no FileInput — mais flexível, mais complexo):
<FileInput.Root>
  <FileInput.Trigger />
  <FileInput.Content>
    <FileInput.FileList />
  </FileInput.Content>
  <FileInput.Control />
</FileInput.Root>

// Approach simples (usado aqui — suficiente para Select básico):
<Select placeholder="Select a country">
  <SelectItem value="br" text="Brasil" />
</Select>
```