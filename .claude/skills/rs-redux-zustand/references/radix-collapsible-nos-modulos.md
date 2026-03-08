---
name: rs-redux-zustand-radix-collapsible-nos-modulos
description: "Applies Radix Collapsible component patterns when building collapsible/accordion UI sections in React with Tailwind. Use when user asks to 'create collapsible', 'toggle section', 'expand collapse module', 'accordion component', 'show hide content', or 'radix collapsible with tailwind'. Enforces Radix primitives with data-attribute styling and group-based conditional styles. Make sure to use this skill whenever implementing open/close toggle UI with Radix in Tailwind projects. Not for custom toggle logic without Radix, nor for Radix Dialog, Popover, or Accordion primitives."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: radix-collapsible
  tags: [radix, collapsible, tailwind, data-attributes, group, accordion, react]
---

# Radix Collapsible nos Modulos

> Usar Radix Collapsible como primitivo para abrir/fechar secoes, estilizando via data attributes com Tailwind.

## Rules

1. **Collapsible.Root como wrapper** — substitui a div, recebe `data-state` automaticamente
2. **Collapsible.Trigger no botao** — gerencia estado aberto/fechado
3. **Collapsible.Content envolve o conteudo** — nao substitua elementos com estilos proprios (como `nav`)
4. **Estilize via data attributes** — `data-[state=open]:` no proprio elemento
5. **Use `group` para filhos** — `group` no Root + `group-data-[state=open]:` no filho, porque `data-state` so existe no Root

## How to write

```tsx
import * as Collapsible from '@radix-ui/react-collapsible'

<Collapsible.Root className="group">
  <Collapsible.Trigger>
    <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />
  </Collapsible.Trigger>
  <Collapsible.Content>
    <nav>{children}</nav>
  </Collapsible.Content>
</Collapsible.Root>
```

## Example

**Before (useState manual):**
```tsx
<button onClick={() => setOpen(!open)}><ChevronDown className={open ? 'rotate-180' : ''} /></button>
{open && <nav>{lessons}</nav>}
```

**After (Radix Collapsible):**
```tsx
<Collapsible.Root className="group">
  <Collapsible.Trigger><ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" /></Collapsible.Trigger>
  <Collapsible.Content><nav>{lessons}</nav></Collapsible.Content>
</Collapsible.Root>
```

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `data-[state=open]:` em filho interno (icone) | `group` no Root + `group-data-[state=open]:` |
| Substituir `nav` por Collapsible.Content | Envolver `nav` com Content |
| Chevron sem `transition-transform` | Adicionar para animacao suave |

## Troubleshooting

### data-[state=open] nao funciona no icone
**Symptom:** ChevronDown nao rotaciona quando collapsible abre.
**Cause:** `data-state` so e injetado no Root/Trigger, nao em filhos internos.
**Fix:** Adicione `group` no Root e use `group-data-[state=open]:rotate-180` no icone.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-radix-collapsible-nos-modulos/references/deep-explanation.md) — Radix sem estilizacao, data attributes, group, independencia dos modulos
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-radix-collapsible-nos-modulos/references/code-examples.md) — Module completo, estilizacao condicional, multiplos collapsibles
