# Code Examples: Input de Biografia

## Estrutura completa da seção de bio

```tsx
// Dentro da page do formulário
<div className="space-y-3">
  {/* Cabeçalho: Select + Toolbar */}
  <div className="grid grid-cols-2 gap-3">
    {/* Select de modo */}
    <Select defaultValue="normal">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="shadow-sm">
        <SelectItem value="normal">Normal Text</SelectItem>
        <SelectItem value="md">Markdown</SelectItem>
      </SelectContent>
    </Select>

    {/* Toolbar de formatação */}
    <div className="flex items-center gap-1">
      <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
        <Bold className="h-4 w-4 text-zinc-500" strokeWidth={3} />
      </button>
      <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
        <Italic className="h-4 w-4 text-zinc-500" strokeWidth={3} />
      </button>
      <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
        <Link className="h-4 w-4 text-zinc-500" strokeWidth={3} />
      </button>
      <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
        <List className="h-4 w-4 text-zinc-500" strokeWidth={3} />
      </button>
      <button type="button" className="rounded-md p-2 hover:bg-zinc-50">
        <ListOrdered className="h-4 w-4 text-zinc-500" strokeWidth={3} />
      </button>
    </div>
  </div>

  {/* Textarea */}
  <Textarea
    id="bio"
    defaultValue="I'm a product designer based in Melbourne"
  />
</div>
```

## Componente Textarea extraído (textarea.tsx)

```tsx
import { ComponentProps } from 'react'

type TextareaProps = ComponentProps<'textarea'>

export function Textarea(props: TextareaProps) {
  return (
    <textarea
      className="min-h-[120px] w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 shadow-sm"
      {...props}
    />
  )
}
```

## Estendendo Select para aceitar defaultValue

```tsx
import * as SelectPrimitive from '@radix-ui/react-select'

// Estender as props do Root para aceitar defaultValue
type SelectProps = ComponentProps<typeof SelectPrimitive.Root>

export function Select({ defaultValue, ...props }: SelectProps) {
  return <SelectPrimitive.Root defaultValue={defaultValue} {...props} />
}
```

## Padrão de botão de toolbar reutilizado

O instrutor copia o padrão de botão do profile e adapta:

```tsx
// Padrão original (do profile)
<button type="button" className="rounded-md p-2 hover:bg-zinc-50 ml-auto">
  <SomeIcon className="h-5 w-5 text-zinc-500" />
</button>

// Adaptado para toolbar (menor, sem ml-auto, com strokeWidth)
<button type="button" className="rounded-md p-2 hover:bg-zinc-50">
  <Bold className="h-4 w-4 text-zinc-500" strokeWidth={3} />
</button>
```

## Classes da textarea comparadas com input

```tsx
// Input existente no formulário
<input className="w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm" />

// Textarea — mesmas classes base + resize-y + min-h
<textarea className="min-h-[120px] w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 shadow-sm" />
```

## Grid do cabeçalho — dividindo em duas colunas

```tsx
// grid-cols-2 divide igualmente para o Select não crescer demais
<div className="grid grid-cols-2 gap-3">
  <Select>...</Select>      {/* Coluna 1: select de modo */}
  <div>...</div>             {/* Coluna 2: toolbar de ícones */}
</div>
```

## Ícones Lucide usados

```tsx
import { Bold, Italic, Link, List, ListOrdered } from 'lucide-react'

// Todos com o mesmo padrão:
// h-4 w-4 (menor que padrão) + strokeWidth={3} (mais grosso)
```