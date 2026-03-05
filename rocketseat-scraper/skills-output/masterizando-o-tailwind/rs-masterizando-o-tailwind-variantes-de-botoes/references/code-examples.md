# Code Examples: Tailwind Variants — Variantes de Botoes

## Exemplo completo do componente Button

### Instalacao

```bash
npm install tailwind-variants
```

### Button.tsx — componente final

```typescript
import { ComponentProps } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

const button = tv({
  base: [
    // Layout e tipografia
    'rounded-lg px-4 py-2 text-sm font-semibold outline-none shadow-sm',
    // Estados interativos
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

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={button({ variant })} {...props} />
}
```

### Uso na pagina

```tsx
import { Button } from '@/components/Button'

// Botao primario (padrao — nao precisa passar variant)
<Button type="submit" form="settings">
  Save
</Button>

// Botao outline
<Button variant="outline" type="button" form="settings">
  Cancel
</Button>

// Botao ghost (para icones, toolbar)
<Button variant="ghost">
  <Bold className="h-4 w-4" />
</Button>
```

## Evolucao: antes e depois

### Antes — botoes com classes duplicadas na pagina

```tsx
{/* Save */}
<button
  type="submit"
  form="settings"
  className="rounded-lg px-4 py-2 text-sm font-semibold bg-violet-600 text-white shadow-sm hover:bg-violet-700"
>
  Save
</button>

{/* Cancel */}
<button
  type="button"
  form="settings"
  className="rounded-lg px-4 py-2 text-sm font-semibold border border-zinc-300 text-zinc-700 shadow-sm hover:bg-zinc-50"
>
  Cancel
</button>
```

Problema: `rounded-lg px-4 py-2 text-sm font-semibold shadow-sm` repetido em ambos. Focus states nao existem. Nenhuma tipagem.

### Depois — componente com variantes

```tsx
<Button type="submit" form="settings">Save</Button>
<Button variant="outline" type="button" form="settings">Cancel</Button>
```

Beneficios: estilos base centralizados, focus/active automaticos, type-safe, extensivel.

## Adicionando novas variantes (extensao)

Para adicionar uma variante de tamanho alem de cor:

```typescript
const button = tv({
  base: [
    'rounded-lg font-semibold outline-none shadow-sm',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500',
    'active:opacity-80',
  ],
  variants: {
    variant: {
      primary: 'bg-violet-600 text-white hover:bg-violet-700',
      outline: 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50',
      ghost: 'rounded-md text-zinc-500 shadow-none hover:bg-zinc-50',
    },
    size: {
      default: 'px-4 py-2 text-sm',
      sm: 'px-3 py-1 text-xs',
      lg: 'px-6 py-3 text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
})
```

Uso:

```tsx
<Button variant="primary" size="lg">Large Save</Button>
<Button variant="outline" size="sm">Small Cancel</Button>
```

## Passando className adicional

O `tv()` retorna uma funcao que aceita `className` para override pontual:

```typescript
export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={button({ variant, className })} {...props} />
}
```

```tsx
<Button variant="primary" className="w-full">Full Width Save</Button>
```