# Code Examples: Componentizando File Input

## Exemplo completo: Root.tsx

```tsx
import { ComponentProps } from 'react'

type RootProps = ComponentProps<'div'>

export function Root(props: RootProps) {
  return <div {...props} />
}
```

O Root e propositalmente minimalista. Ele apenas repassa props, incluindo `className`, para que o consumidor controle o layout (flex, gap, etc.).

## Exemplo completo: Trigger.tsx

```tsx
import { UploadCloud } from 'lucide-react'

export function Trigger() {
  return (
    <label
      htmlFor="photo"
      className="group flex flex-1 cursor-pointer flex-col items-center gap-3 rounded-lg border border-zinc-300 px-6 py-4 text-center text-zinc-500 shadow-sm hover:border-violet-200 hover:bg-violet-25 hover:text-violet-500"
    >
      <div className="rounded-full border-6 border-zinc-50 bg-zinc-100 p-2 group-hover:border-violet-50 group-hover:bg-violet-100">
        <UploadCloud className="h-5 w-5 text-zinc-600 group-hover:text-violet-600" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm">
          <span className="font-semibold text-violet-700">Click to upload</span>{' '}
          or drag and drop
        </span>
        <span className="text-xs">SVG, PNG, JPG or GIF (max. 800x400px)</span>
      </div>
    </label>
  )
}
```

Nota: o `htmlFor="photo"` esta hardcoded aqui. Em uma versao mais robusta, isso seria dinamico via Context API.

## Exemplo completo: ImagePreview.tsx

```tsx
import { User } from 'lucide-react'

export function ImagePreview() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
      <User className="h-8 w-8 text-violet-500" />
    </div>
  )
}
```

Versao inicial com icone placeholder. Futuramente, recebera a URL da imagem para mostrar preview real.

## Exemplo completo: Control.tsx

```tsx
import { ComponentProps } from 'react'

type ControlProps = ComponentProps<'input'>

export function Control({ ...props }: ControlProps) {
  return (
    <input
      type="file"
      className="sr-only"
      {...props}
    />
  )
}
```

O `type="file"` e forcado internamente. O `className="sr-only"` esconde visualmente o input (o Trigger e o elemento visivel). Todas as outras props (id, accept, multiple) sao repassadas.

## Exemplo completo: index.ts (barrel)

```ts
import { Control } from './Control'
import { ImagePreview } from './ImagePreview'
import { Root } from './Root'
import { Trigger } from './Trigger'

export { Control, ImagePreview, Root, Trigger }
```

## Uso na pagina: upload de avatar (com preview)

```tsx
import * as FileInput from '@/components/Form/FileInput'

<FileInput.Root className="flex items-start gap-5">
  <FileInput.ImagePreview />
  <FileInput.Trigger />
  <FileInput.Control id="photo" />
</FileInput.Root>
```

## Uso na pagina: upload de portfolio (sem preview, multiple)

```tsx
import * as FileInput from '@/components/Form/FileInput'

<FileInput.Root>
  <FileInput.Trigger />
  <FileInput.Control id="documents" multiple />
</FileInput.Root>
```

Sem `ImagePreview`, sem `flex items-start gap-5` no Root (nao precisa de layout lado-a-lado). O `multiple` permite selecionar varios arquivos.

## Comparacao: antes vs depois

### Antes (duplicacao)
```tsx
{/* Avatar upload */}
<div className="flex items-start gap-5">
  <div className="...preview styles...">
    <User />
  </div>
  <label htmlFor="photo" className="...trigger styles...">
    <UploadCloud />
    <span>Click to upload</span>
  </label>
  <input type="file" id="photo" className="sr-only" />
</div>

{/* Portfolio upload - codigo duplicado sem preview */}
<div>
  <label htmlFor="documents" className="...mesmos trigger styles...">
    <UploadCloud />
    <span>Click to upload</span>
  </label>
  <input type="file" id="documents" className="sr-only" multiple />
</div>
```

### Depois (composicao)
```tsx
{/* Avatar upload */}
<FileInput.Root className="flex items-start gap-5">
  <FileInput.ImagePreview />
  <FileInput.Trigger />
  <FileInput.Control id="photo" />
</FileInput.Root>

{/* Portfolio upload */}
<FileInput.Root>
  <FileInput.Trigger />
  <FileInput.Control id="documents" multiple />
</FileInput.Root>
```