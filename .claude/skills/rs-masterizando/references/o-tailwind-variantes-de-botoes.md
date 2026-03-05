---
name: rs-tailwind-variantes-de-botoes
description: "Enforces Tailwind Variants pattern for component styling when creating buttons, UI components, or variant-based designs in React/Next.js. Use when user asks to 'create a button component', 'add variants to a component', 'style different button types', 'use tailwind-variants', or 'create reusable UI components'. Applies tv() pattern with base styles, named variants, defaultVariants, and VariantProps typing. Make sure to use this skill whenever building components with multiple visual states. Not for utility-first inline Tailwind classes without variants, CSS modules, or styled-components."
---

# Tailwind Variants — Variantes de Componentes

> Quando um componente tem multiplas customizacoes visuais (cor, tamanho, padding), usar variantes via `tailwind-variants` em vez de uniao manual de classes.

## Rules

1. **Use `tv()` para componentes com mais de uma estilizacao visual** — porque uniao manual de classes nao escala e perde type-safety
2. **Separe estilos base dos variantes** — `base` recebe o que TODO componente compartilha (arredondamento, padding, font, focus ring), variantes recebem apenas diferencas
3. **Nomeie variantes pela intencao, nao pela propriedade CSS** — use `variant="primary"` nao `color="violet"`, porque variantes mudam multiplas propriedades de uma vez
4. **Defina `defaultVariants`** — sempre declare qual variante e aplicada quando nenhuma e passada, porque evita componente sem estilo
5. **Use `VariantProps` para tipagem automatica** — nunca declare tipos de variantes manualmente, porque `VariantProps<typeof button>` sincroniza automaticamente
6. **Use array no `base` para organizar classes por responsabilidade** — linha para layout, linha para estados (focus, active, hover), porque melhora legibilidade

## How to write

### Estrutura base com tv()

```typescript
import { tv, VariantProps } from 'tailwind-variants'

const button = tv({
  base: [
    'rounded-lg px-4 py-2 text-sm font-semibold outline-none shadow-sm',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500',
    'active:opacity-80',
  ],
  variants: {
    variant: {
      primary: 'bg-violet-600 text-white hover:bg-violet-700',
      outline: 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50',
      ghost: 'rounded-md p-2 text-zinc-500 shadow-none hover:bg-zinc-50',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})
```

### Tipagem do componente

```typescript
import { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={button({ variant })} {...props} />
}
```

### Uso no consumidor

```tsx
<Button variant="primary">Save</Button>
<Button variant="outline">Cancel</Button>
<Button>Default (primary)</Button>
```

## Example

**Before (classes manuais repetidas):**
```tsx
<button className="rounded-lg px-4 py-2 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700">
  Save
</button>
<button className="rounded-lg px-4 py-2 text-sm font-semibold border border-zinc-300 text-zinc-700 hover:bg-zinc-50">
  Cancel
</button>
```

**After (com tailwind-variants):**
```tsx
<Button variant="primary">Save</Button>
<Button variant="outline">Cancel</Button>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente com 2+ estilos visuais distintos | Usar `tv()` com variantes nomeadas |
| Apenas 1 estilo, sem variacao | Classes Tailwind diretas, sem tv() |
| Variante muda so cor de fundo | Ainda usar variante (pode expandir depois) |
| Propriedade `variant` nao descreve bem | Nomeie pela dimensao: `size`, `variant`, `intent` |
| Focus/active/hover compartilhado | Colocar no `base`, nao repetir em cada variante |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `color="violet"` como prop | `variant="primary"` (intencao, nao CSS) |
| Tipos manuais: `variant: 'primary' \| 'outline'` | `VariantProps<typeof button>` |
| Classes base repetidas em cada variante | Array no `base` com estilos compartilhados |
| `className={condition ? 'bg-violet-600' : 'border'}` | `variant={condition ? 'primary' : 'outline'}` |
| String unica gigante no base | Array separando layout, estados, tipografia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-variantes-de-botoes/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-variantes-de-botoes/references/code-examples.md)
