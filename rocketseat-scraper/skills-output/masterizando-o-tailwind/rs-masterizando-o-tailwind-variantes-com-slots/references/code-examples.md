# Code Examples: Variantes com Slots

## Exemplo completo do FileItem

### Definicao da variante com slots

```typescript
import { tv, VariantProps } from 'tailwind-variants'

const fileItem = tv({
  slots: {
    container:
      'group flex items-start gap-4 rounded-lg border border-zinc-200 p-4',
    icon:
      'flex items-center rounded-lg border border-violet-100 bg-violet-50 p-2 text-violet-600',
    deleteButton: '',
  },

  variants: {
    state: {
      progress: {
        container: '',
        icon: '',
        deleteButton: '',
      },
      complete: {
        container: 'border-violet-500',
      },
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

type FileItemProps = VariantProps<typeof fileItem>
```

### Consumo no componente

```typescript
export function FileItem({ state }: FileItemProps) {
  const { container, icon, deleteButton } = fileItem({ state })

  return (
    <div className={container()}>
      <div className={icon()}>
        <UploadCloud className="h-4 w-4" />
      </div>

      <div className="flex flex-1 flex-col items-start gap-1">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-700">
            photo.png
          </span>
          <span className="text-sm text-zinc-500">180 KB</span>
        </div>

        <div className="flex w-full items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-zinc-100">
            <div className="h-2 w-4/5 rounded-full bg-violet-600" />
          </div>
          <span className="text-sm font-medium text-zinc-700">80%</span>
        </div>
      </div>

      <Button variant="ghost" className={deleteButton()}>
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  )
}
```

### Uso no componente pai

```typescript
// FileList.tsx
<FileItem state="error" />
<FileItem state="progress" />
<FileItem state="complete" />
```

## Button aceitando className externo

### Antes (className ignorado)

```typescript
function Button({ variant, ...props }: ButtonProps) {
  return <button className={button({ variant })} {...props} />
}
// className passado via props e IGNORADO
```

### Depois (className composto)

```typescript
function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={button({ variant, className })} {...props} />
}
// className externo e mesclado com os estilos internos
```

## Migracao de base para slots

### Antes (base — 1 elemento)

```typescript
const fileItem = tv({
  base: 'group flex items-start gap-4 rounded-lg border border-zinc-200 p-4',
  variants: {
    state: {
      error: 'bg-error-25 border-error-300',
    },
  },
})

// Uso: className={fileItem({ state })}
```

### Depois (slots — N elementos)

```typescript
const fileItem = tv({
  slots: {
    container: 'group flex items-start gap-4 rounded-lg border border-zinc-200 p-4',
    icon: 'flex items-center rounded-lg border ...',
    deleteButton: '',
  },
  variants: {
    state: {
      error: {
        container: 'bg-error-25 border-error-300',
        icon: 'border-error-50 bg-error-100 text-error-600',
        deleteButton: 'text-error-700 hover:text-error-900',
      },
    },
  },
})

// Uso:
const { container, icon, deleteButton } = fileItem({ state })
// container(), icon(), deleteButton()
```

## Variacao: adicionando estado "success"

```typescript
const fileItem = tv({
  slots: {
    container: '...',
    icon: '...',
    deleteButton: '',
  },
  variants: {
    state: {
      progress: {},
      complete: {
        container: 'border-violet-500',
        icon: 'border-violet-200 bg-violet-100 text-violet-700',
      },
      error: {
        container: 'bg-error-25 border-error-300',
        icon: 'border-error-50 bg-error-100 text-error-600',
        deleteButton: 'text-error-700 hover:text-error-900',
      },
      success: {
        container: 'border-emerald-500 bg-emerald-25',
        icon: 'border-emerald-200 bg-emerald-100 text-emerald-600',
        deleteButton: 'text-emerald-700 hover:text-emerald-900',
      },
    },
  },
  defaultVariants: { state: 'progress' },
})
```