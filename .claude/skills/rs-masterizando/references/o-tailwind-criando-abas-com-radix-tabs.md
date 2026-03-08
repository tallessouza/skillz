---
name: rs-tailwind-criando-abas-radix-tabs
description: "Applies Radix UI Tabs patterns with Tailwind CSS styling when building tabbed interfaces in React/Next.js. Use when user asks to 'create tabs', 'build tab navigation', 'implement tabbed interface', 'use radix tabs', or 'style tabs with tailwind'. Enforces data-attribute styling, negative margin tricks for border overlap, anti-aliased fonts, and proper client component separation. Make sure to use this skill whenever implementing tab components with Radix primitives. Not for accordion, dropdown, or non-tab navigation patterns."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: tailwind-css
  tags: [tailwind, react, radix-ui, nextjs, flexbox]
---

# Criando Abas com Radix Tabs + Tailwind

> Use composicao do Radix Tabs com data-attributes para estilizar estados ativos, separando client components no Next.js.

## Rules

1. **Use Radix Tabs com composicao** — `Tabs.Root` > `Tabs.List` > `Tabs.Trigger`, porque Radix fornece acessibilidade e data-attributes automaticamente
2. **Estilize estados via data-attributes** — `data-[state=active]:text-violet-700` em vez de logica condicional com ternarios, porque Radix ja gerencia o estado internamente
3. **Separe client components no Next.js** — extraia tabs para componente com `'use client'`, porque Radix usa JavaScript client-side (hooks, event listeners)
4. **Use anti-aliased no HTML root** — classe `antialiased` no `<html>`, porque fontes ficam mais sharp e bem definidas
5. **Use margin negativa para sobreposicao de bordas** — `-bottom-px` para o indicador ativo ficar sobre a borda do container, porque cria efeito visual de continuidade
6. **Nao crie div wrapper desnecessaria** — use React Fragment quando o layout pai ja fornece o container, porque evita DOM bloat

## How to write

### Estrutura basica de Tabs com Radix

```tsx
'use client'

import * as Tabs from '@radix-ui/react-tabs'

export function SettingsTabs() {
  return (
    <Tabs.Root defaultValue="tab1">
      <Tabs.List className="mt-6 flex w-full items-center gap-4 border-b border-zinc-200">
        <TabItem value="tab1" title="My details" />
        <TabItem value="tab2" title="Profile" />
      </Tabs.List>
    </Tabs.Root>
  )
}
```

### TabItem com data-attribute styling

```tsx
'use client'

import * as Tabs from '@radix-ui/react-tabs'

interface TabItemProps {
  value: string
  title: string
  isSelected?: boolean
}

export function TabItem({ value, title, isSelected = false }: TabItemProps) {
  return (
    <Tabs.Trigger
      value={value}
      className="relative px-1 pb-4 text-sm font-medium text-zinc-500 hover:text-violet-700 data-[state=active]:text-violet-700"
    >
      <span>{title}</span>

      {isSelected && (
        <div className="absolute left-0 right-0 -bottom-px h-0.5 bg-violet-700" />
      )}
    </Tabs.Trigger>
  )
}
```

### Controle de estado para indicador ativo

```tsx
'use client'

import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'

export function SettingsTabs() {
  const [currentTab, setCurrentTab] = useState('tab1')

  return (
    <Tabs.Root value={currentTab} onValueChange={setCurrentTab}>
      <Tabs.List className="mt-6 flex w-full items-center gap-4 border-b border-zinc-200">
        <TabItem value="tab1" title="My details" isSelected={currentTab === 'tab1'} />
        <TabItem value="tab2" title="Profile" isSelected={currentTab === 'tab2'} />
      </Tabs.List>
    </Tabs.Root>
  )
}
```

## Example

**Before (sem Radix, logica manual):**
```tsx
<div className="flex border-b">
  <button
    className={activeTab === 'details' ? 'text-violet-700 border-b-2 border-violet-700' : 'text-zinc-500'}
    onClick={() => setActiveTab('details')}
  >
    My details
  </button>
</div>
```

**After (com Radix + data-attributes):**
```tsx
<Tabs.Root value={currentTab} onValueChange={setCurrentTab}>
  <Tabs.List className="flex w-full items-center gap-4 border-b border-zinc-200">
    <Tabs.Trigger
      value="details"
      className="relative px-1 pb-4 text-sm font-medium text-zinc-500 hover:text-violet-700 data-[state=active]:text-violet-700"
    >
      <span>My details</span>
      {currentTab === 'details' && (
        <div className="absolute left-0 right-0 -bottom-px h-0.5 bg-violet-700" />
      )}
    </Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente usa hooks ou onClick | Adicionar `'use client'` no topo do arquivo |
| Indicador ativo precisa sobrepor borda | Usar `absolute` + `-bottom-px` no indicador |
| Estilizar baseado em estado do Radix | Usar `data-[state=active]:` em vez de ternario |
| Page.tsx no Next.js precisa de tabs interativas | Extrair para componente separado com `'use client'` |
| Fontes parecem grosseiras/pesadas | Adicionar `antialiased` no `<html>` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `className={active ? 'text-violet' : 'text-zinc'}` | `className="data-[state=active]:text-violet-700"` |
| `<div>` wrapper desnecessaria dentro de page.tsx | React Fragment `<>...</>` |
| `bottom-0` para indicador sobre borda | `-bottom-px` para sobreposicao precisa |
| Tabs implementadas com botoes manuais | `@radix-ui/react-tabs` com composicao |
| `'use client'` no page.tsx inteiro | Extrair apenas o componente interativo |
## Troubleshooting

### Componente Radix nao funciona no Next.js App Router
**Symptom:** Erro de hydration ou componente nao interativo.
**Cause:** Componentes Radix usam hooks client-side mas estao em Server Component.
**Fix:** Adicione `'use client'` no topo do arquivo que usa componentes Radix.

### Dropdown aparece atras de outros elementos
**Symptom:** O conteudo do select fica escondido atras de outros componentes.
**Cause:** Falta de Portal ou z-index insuficiente.
**Fix:** Use `SelectPrimitive.Portal` para renderizar no body e adicione `z-10` ou superior no Content.

## Deep reference library

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-criando-abas-com-radix-tabs/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-criando-abas-com-radix-tabs/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
