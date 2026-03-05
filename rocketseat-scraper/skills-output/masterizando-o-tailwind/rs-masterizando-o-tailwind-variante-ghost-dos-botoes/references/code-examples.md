# Code Examples: Variante Ghost dos Botoes

## Definicao da variante ghost (tailwind-variants)

```typescript
import { tv } from 'tailwind-variants'

const button = tv({
  base: [
    'flex items-center justify-center gap-2',
    'font-medium text-sm',
    'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500',
  ],
  variants: {
    variant: {
      primary: [
        'rounded-lg px-4 py-2',
        'bg-violet-600 text-white',
        'hover:bg-violet-700',
        'shadow-sm',
      ],
      outline: [
        'rounded-lg px-4 py-2',
        'border border-zinc-300 text-zinc-700',
        'hover:bg-zinc-50',
        'shadow-sm',
      ],
      ghost: [
        'rounded-md px-2 py-2',
        'text-zinc-500',
        'shadow-none',
        'hover:bg-zinc-50',
      ],
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})
```

## Uso no componente de perfil (logout)

```tsx
// Antes — botao HTML com classes inline
<button className="p-2 rounded-md hover:bg-zinc-50">
  <LogOut className="h-5 w-5" />
</button>

// Depois — componente Button com variante ghost
import { Button } from '@/components/Button'

<Button variant="ghost">
  <LogOut className="h-5 w-5" />
</Button>
```

## Uso na toolbar de formatacao

```tsx
// Antes — botoes HTML repetidos com classes
<button className="p-2 rounded-md hover:bg-zinc-50">
  <Bold className="h-4 w-4" />
</button>
<button className="p-2 rounded-md hover:bg-zinc-50">
  <Italic className="h-4 w-4" />
</button>
<button className="p-2 rounded-md hover:bg-zinc-50">
  <Link className="h-4 w-4" />
</button>

// Depois — componentes Button com variante ghost
<Button variant="ghost">
  <Bold className="h-4 w-4" />
</Button>
<Button variant="ghost">
  <Italic className="h-4 w-4" />
</Button>
<Button variant="ghost">
  <Link className="h-4 w-4" />
</Button>
```

## Uso no file list (botao de remover)

```tsx
// Antes
<button className="p-2 rounded-md hover:bg-zinc-50">
  <Trash2 className="h-4 w-4" />
</button>

// Depois
<Button variant="ghost">
  <Trash2 className="h-4 w-4" />
</Button>
```

## Variacao com dark mode

```typescript
ghost: [
  'rounded-md px-2 py-2',
  'text-zinc-500 dark:text-zinc-400',
  'shadow-none',
  'hover:bg-zinc-50 dark:hover:bg-zinc-800',
],
```

## Ghost button com texto (nao apenas icone)

```tsx
// Ghost tambem funciona com texto, nao apenas icones
<Button variant="ghost">
  Cancel
</Button>

// Comum em dialogs onde "Cancel" e secundario ao "Confirm"
<div className="flex gap-2">
  <Button variant="ghost">Cancel</Button>
  <Button variant="primary">Confirm</Button>
</div>
```