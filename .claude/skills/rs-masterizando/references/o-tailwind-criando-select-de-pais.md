---
name: rs-tailwind-criando-select-radix
description: "Applies Radix UI Select component patterns with Tailwind CSS styling when building custom select/dropdown inputs. Use when user asks to 'create a select', 'build a dropdown', 'custom select component', 'Radix select', or 'styled dropdown with Tailwind'. Covers composition pattern, CSS variables for width sync, data attributes for states, and Portal usage. Make sure to use this skill whenever creating select/dropdown components with Radix and Tailwind. Not for native HTML selects, React Select library, or headless UI selects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: masterizando-o-tailwind
  module: tailwind-css
  tags: [tailwind, react, radix-ui, nextjs, flexbox]
---

# Criando Select com Radix UI + Tailwind

> Construa selects customizados usando o pattern de composicao do Radix com estilizacao Tailwind via data attributes e variaveis CSS.

## Rules

1. **Use o pattern de composicao do Radix** — `Root > Trigger > Portal > Content > Viewport > Item`, porque cada peca tem responsabilidade unica e permite estilizacao granular
2. **Sincronize a largura do Content com o Trigger via CSS variable** — use `w-[--radix-select-trigger-width]` no Content, porque o Radix cria automaticamente essa variavel e o Tailwind entende `--` como var()
3. **Estilize estados via data attributes** — use `data-[placeholder]:` e `data-[highlighted]:` no Tailwind, porque o Radix injeta esses atributos automaticamente nos componentes
4. **Use Portal para posicionamento** — envolva o Content em Portal, porque selects/modals precisam renderizar no body para ficar acima de outros elementos (z-index)
5. **Remova outline no Item, nao no Content** — o foco vai para o Item individual, entao `outline-none` deve estar no Item
6. **Use overflow-hidden no Content** — porque itens internos podem cobrir o border-radius do container

## How to write

### Estrutura base do Select

```tsx
import * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'

export function Select() {
  return (
    <SelectPrimitive.Root>
      <SelectPrimitive.Trigger className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm data-[placeholder]:text-zinc-600">
        <SelectPrimitive.Value placeholder="Select an option..." />
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
            {/* Items here */}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
```

### Item com indicator e highlight

```tsx
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
```

## Example

**Before (select sem sincronizacao de largura):**
```tsx
<SelectPrimitive.Content className="w-full rounded-lg border bg-white">
```
O `w-full` nao funciona porque o Content esta no Portal (fora do fluxo do Trigger).

**After (usando CSS variable do Radix):**
```tsx
<SelectPrimitive.Content className="w-[--radix-select-trigger-width] rounded-lg border bg-white">
```
O Tailwind interpreta `--radix-select-trigger-width` como `var(--radix-select-trigger-width)` automaticamente.

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa que dropdown ocupe largura do trigger | Use `w-[--radix-select-trigger-width]` no Content |
| Placeholder precisa de cor diferente | Use `data-[placeholder]:text-zinc-600` no Trigger |
| Item precisa de hover visual | Use `data-[highlighted]:bg-zinc-50` no Item |
| Item selecionado precisa de indicador | Use `SelectPrimitive.ItemIndicator` com icone Check |
| Usando Next.js App Router | Crie componente separado com `'use client'` |
| Itens cobrem border-radius | Adicione `overflow-hidden` no Content |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `outline-none` no Content | `outline-none` no Item (quem recebe foco) |
| `w-full` no Content dentro de Portal | `w-[--radix-select-trigger-width]` |
| `var(--radix-select-trigger-width)` no Tailwind | `--radix-select-trigger-width` (Tailwind entende `--` como var) |
| Estilos hover com CSS `:hover` | Data attributes `data-[highlighted]:` do Radix |
| Select direto em Server Component (Next.js) | Componente separado com `'use client'` |
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

- [deep-explanation.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-criando-select-de-pais/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](../../../data/skills/masterizando-o-tailwind/rs-masterizando-o-tailwind-criando-select-de-pais/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
