---
name: rs-redux-zustand-radix-collapsible
description: "Applies Radix Collapsible component patterns when building collapsible/accordion UI sections in React. Use when user asks to 'create collapsible', 'toggle section', 'expand collapse module', 'accordion component', or 'show hide content'. Enforces Radix primitives with Tailwind data-attribute styling and group-based conditional styles. Make sure to use this skill whenever implementing open/close toggle UI with Radix. Not for custom accordion logic without Radix, nor for Radix Dialog, Popover, or other Radix primitives."
---

# Radix Collapsible nos Módulos

> Usar Radix Collapsible como primitivo para abrir/fechar seções, estilizando via data attributes do Radix com Tailwind.

## Rules

1. **Use Collapsible.Root por volta do elemento inteiro** — ele substitui a div wrapper, porque o Root recebe o `data-state` (open/closed) necessário para estilização condicional
2. **Use Collapsible.Trigger no botão de toggle** — substitua a tag do botão pelo Trigger, porque ele gerencia o estado aberto/fechado automaticamente
3. **Use Collapsible.Content por volta do conteúdo ocultável** — envolva o conteúdo (não substitua elementos com estilização própria como `nav`), porque o Content controla a visibilidade
4. **Estilize via data attributes com Tailwind** — `data-[state=open]:` no próprio elemento, porque o Radix injeta `data-state` automaticamente
5. **Use `group` para estilizar filhos com base no estado do pai** — adicione `group` no Root e `group-data-[state=open]:` no filho, porque `data-state` só existe no Root, não nos filhos internos

## How to write

### Estrutura básica do Collapsible

```tsx
import * as Collapsible from '@radix-ui/react-collapsible'

function Module({ title, children }) {
  return (
    <Collapsible.Root className="group">
      <Collapsible.Trigger className="flex items-center gap-2">
        <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />
        {title}
      </Collapsible.Trigger>

      <Collapsible.Content>
        <nav>{children}</nav>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
```

### Estilização condicional no Root

```tsx
<Collapsible.Root className="data-[state=open]:border-l-4 data-[state=open]:border-green-500">
```

### Estilização de filho via group

```tsx
<Collapsible.Root className="group">
  {/* O ícone não tem data-state, então usa group */}
  <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />
</Collapsible.Root>
```

## Example

**Before (sem Radix):**
```tsx
<div>
  <button onClick={() => setOpen(!open)}>
    <ChevronDown className={open ? 'rotate-180' : ''} />
    Módulo 1
  </button>
  {open && <nav>{lessons}</nav>}
</div>
```

**After (com Radix Collapsible):**
```tsx
<Collapsible.Root className="group">
  <Collapsible.Trigger className="flex items-center gap-2">
    <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />
    Módulo 1
  </Collapsible.Trigger>
  <Collapsible.Content>
    <nav>{lessons}</nav>
  </Collapsible.Content>
</Collapsible.Root>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Quer estilizar o próprio Root quando aberto | `data-[state=open]:classe` direto no Root |
| Quer estilizar um filho quando Root está aberto | `group` no Root + `group-data-[state=open]:classe` no filho |
| Content tem elemento com estilos (nav, ul) | Envolva com Content, não substitua o elemento |
| Múltiplos collapsibles independentes | Cada um tem seu próprio Root, abrem independentemente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useState` + renderização condicional para toggle simples | `Collapsible.Root` + `Collapsible.Content` |
| `data-[state=open]:` em filho interno (SVG, ícone) | `group` no Root + `group-data-[state=open]:` no filho |
| Substituir `nav` por `Collapsible.Content` | Envolver `nav` com `Collapsible.Content` |
| Chevron sem `transition-transform` | Adicionar `transition-transform` para animação suave |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
