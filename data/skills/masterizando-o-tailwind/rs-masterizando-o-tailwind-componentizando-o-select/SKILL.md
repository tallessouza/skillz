---
name: rs-tailwind-componentizando-select
description: "Applies Select component splitting pattern using Radix UI primitives in React/Next.js projects. Use when user asks to 'create a select', 'build a dropdown', 'split a component', 'componentize a select', or 'refactor select into smaller parts'. Follows folder-based component structure with index + subcomponents. Make sure to use this skill whenever creating or refactoring Select/dropdown components with Radix UI. Not for complex composition patterns, non-Radix selects, or native HTML selects."
---

# Componentizando o Select

> Ao criar um Select com Radix UI, separe em componentes menores (Select + SelectItem) usando estrutura de pasta, sem aplicar Composition Pattern completo quando o foco e simplicidade.

## Rules

1. **Separe Select em pasta com index + subcomponentes** — `Select/index.tsx` + `Select/SelectItem.tsx`, porque facilita manutenção sem over-engineering
2. **Extenda as props do Radix diretamente** — use `SelectItemProps` do Radix para tipar, porque mantém type-safety sem reescrever tipos
3. **Exponha `text` como prop customizada no SelectItem** — separe `value` (Radix) de `text` (display), porque são responsabilidades diferentes
4. **Use `children` no Select root para receber SelectItems** — porque permite composição simples sem Composition Pattern formal
5. **Exponha `placeholder` como prop do Select root** — porque é o único texto configurável no wrapper
6. **Adicione `'use client'` nos subcomponentes** — porque Radix requer client-side rendering no Next.js App Router

## How to write

### Estrutura de pasta

```
Select/
├── index.tsx        # Select root (wrapper do Radix)
└── SelectItem.tsx   # Item individual do select
```

### SelectItem

```tsx
'use client'

import * as Select from '@radix-ui/react-select'
import { Check } from 'lucide-react'
import { type SelectItemProps } from '@radix-ui/react-select'

interface SelectItemCustomProps extends SelectItemProps {
  text: string
}

export function SelectItem({ text, ...props }: SelectItemCustomProps) {
  return (
    <Select.Item {...props} className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-[highlighted]:bg-zinc-50">
      <Select.ItemText className="text-black">{text}</Select.ItemText>
      <Select.ItemIndicator>
        <Check className="h-4 w-4 text-violet-500" />
      </Select.ItemIndicator>
    </Select.Item>
  )
}
```

### Select root

```tsx
'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { ReactNode } from 'react'

interface SelectProps {
  placeholder: string
  children: ReactNode
}

export function Select({ placeholder, children }: SelectProps) {
  return (
    <SelectPrimitive.Root>
      <SelectPrimitive.Trigger className="flex items-center justify-between gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>{/* ChevronDown */}</SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-md">
          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
```

### Uso na página

```tsx
<Select placeholder="Select a country">
  <SelectItem value="br" text="Brasil" />
  <SelectItem value="us" text="United States" />
</Select>
```

## Example

**Before (tudo inline):**
```tsx
<SelectPrimitive.Root>
  <SelectPrimitive.Trigger>
    <SelectPrimitive.Value placeholder="Select a country" />
  </SelectPrimitive.Trigger>
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content>
      <SelectPrimitive.Viewport>
        <SelectPrimitive.Item value="br">
          <SelectPrimitive.ItemText>Brasil</SelectPrimitive.ItemText>
          <SelectPrimitive.ItemIndicator><Check /></SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
        <SelectPrimitive.Item value="us">
          <SelectPrimitive.ItemText>United States</SelectPrimitive.ItemText>
          <SelectPrimitive.ItemIndicator><Check /></SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
</SelectPrimitive.Root>
```

**After (componentizado):**
```tsx
<Select placeholder="Select a country">
  <SelectItem value="br" text="Brasil" />
  <SelectItem value="us" text="United States" />
</Select>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Select simples com poucos items | Separe em Select + SelectItem (este pattern) |
| Select com triggers customizados, múltiplos conteúdos | Aplique Composition Pattern completo |
| Componente Radix usado em 1 lugar só | Inline é aceitável, não force componentização |
| Renomear arquivo para pasta | Crie `Component/index.tsx` e mova subcomponentes para mesma pasta |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Colocar `SelectItem` no mesmo arquivo do `Select` | Arquivo separado: `SelectItem.tsx` |
| Reescrever tipos que o Radix já exporta | Extender `SelectItemProps` com `extends` |
| Esquecer `'use client'` em componentes Radix no App Router | Adicionar diretiva no topo do arquivo |
| Usar `margin` genérico no componente reutilizável | Aplicar margin apenas no contexto de uso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
