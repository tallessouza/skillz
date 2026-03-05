---
name: rs-tailwind-variantes-com-slots
description: "Applies Tailwind Variants Slots API pattern when styling multiple elements inside a component based on shared state. Use when user asks to 'style multiple elements based on state', 'create component variants', 'use tailwind variants slots', 'conditional styling across elements', or builds components with state-dependent multi-element styling. Make sure to use this skill whenever a component needs to change styles of 2+ child elements based on a single prop/state. Not for single-element variants, basic Tailwind classes, or CSS-in-JS solutions."
---

# Tailwind Variants — Slots API

> Quando um componente precisa estilizar multiplos elementos internos baseado em um unico estado, use Slots ao inves de base.

## Rules

1. **Use `slots` ao inves de `base` quando estilizar 2+ elementos** — porque `base` so estiliza um unico elemento, slots permite nomear e estilizar varios
2. **De nomes semanticos aos slots** — `container`, `icon`, `deleteButton`, nao `div1`, `wrapper2`, porque slots sao a API publica do componente
3. **Desestruture os slots do retorno da variante** — `const { container, icon, deleteButton } = fileItem({ state })`, porque cada slot retorna uma funcao que gera o className
4. **Passe className externa junto com as variantes** — `button({ className })` dentro do componente, porque senao a className do pai e ignorada
5. **Slots sem estilo base podem ser vazios** — `deleteButton: ''` e valido, porque o slot so precisa existir para receber estilos condicionais nas variantes

## How to write

### Definindo slots com variantes

```typescript
import { tv } from 'tailwind-variants'

const fileItem = tv({
  slots: {
    container: 'group flex items-start gap-4 rounded-lg border border-zinc-200 p-4',
    icon: 'flex items-center rounded-lg border border-violet-100 bg-violet-50 p-2 text-violet-600',
    deleteButton: '',
  },
  variants: {
    state: {
      progress: { container: '', icon: '', deleteButton: '' },
      complete: { container: 'border-violet-500' },
      error: {
        container: 'bg-error-25 border-error-300',
        icon: 'border-error-50 bg-error-100 text-error-600',
        deleteButton: 'text-error-700 hover:text-error-900',
      },
    },
  },
  defaultVariants: {
    state: 'progress',
  },
})
```

### Consumindo slots no componente

```typescript
export function FileItem({ state, ...props }: FileItemProps) {
  const { container, icon, deleteButton } = fileItem({ state })

  return (
    <div className={container()}>
      <div className={icon()}>
        <UploadCloud />
      </div>
      {/* ... */}
      <Button variant="ghost" className={deleteButton()}>
        <Trash2 />
      </Button>
    </div>
  )
}
```

### Passando className externa em componentes internos

```typescript
// Dentro do Button, aceite e repasse className
function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={button({ variant, className })} {...props} />
}
```

## Example

**Before (estilizacao condicional manual):**
```typescript
// Cada elemento precisa de logica condicional separada
<div className={cn('border p-4', state === 'error' && 'bg-red-50 border-red-300')}>
  <div className={cn('p-2 text-violet-600', state === 'error' && 'text-red-600')}>
    <UploadCloud />
  </div>
  <button className={cn('text-zinc-500', state === 'error' && 'text-red-700')}>
    <Trash2 />
  </button>
</div>
```

**After (com Slots API):**
```typescript
const { container, icon, deleteButton } = fileItem({ state })

<div className={container()}>
  <div className={icon()}>
    <UploadCloud />
  </div>
  <Button variant="ghost" className={deleteButton()}>
    <Trash2 />
  </Button>
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| 1 elemento muda com estado | Use `base` + `variants` normal |
| 2+ elementos mudam com estado | Use `slots` + `variants` |
| Slot nao tem estilo base | Declare como string vazia `''` |
| Componente filho ignora className | Passe `className` dentro da funcao tv: `button({ variant, className })` |
| Tipagem das props | Use `VariantProps<typeof suaVariante>` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `base: '...'` com 2+ elementos condicionais | `slots: { container: '...', icon: '...' }` |
| `cn(base, state === 'error' && '...')` repetido | Variante `error` no objeto de slots |
| `className` ignorado em componente interno | `button({ variant, className })` repassando |
| Slots nomeados como `div1`, `span2` | Nomes semanticos: `container`, `icon`, `deleteButton` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-variantes-com-slots/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-variantes-com-slots/references/code-examples.md)
