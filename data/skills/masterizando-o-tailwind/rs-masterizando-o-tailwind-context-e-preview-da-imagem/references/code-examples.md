# Code Examples: Context e Preview da Imagem

## Exemplo completo: FileInput Context

```typescript
// file-input/root.tsx
'use client'

import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from 'react'

interface FileInputContextType {
  id: string
  files: File[]
  onFilesSelected: (files: File[]) => void
}

const FileInputContext = createContext({} as FileInputContextType)

export function useFileInput() {
  return useContext(FileInputContext)
}

interface RootProps {
  children: ReactNode
}

export function Root({ children }: RootProps) {
  const id = useId()
  const [files, setFiles] = useState<File[]>([])

  return (
    <FileInputContext.Provider
      value={{
        id,
        files,
        onFilesSelected: setFiles,
      }}
    >
      <div>{children}</div>
    </FileInputContext.Provider>
  )
}
```

## Exemplo completo: Control

```typescript
// file-input/control.tsx
'use client'

import { type ChangeEvent } from 'react'
import { useFileInput } from './root'

interface ControlProps {
  multiple?: boolean
}

export function Control({ multiple }: ControlProps) {
  const { id, onFilesSelected } = useFileInput()

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) {
      return
    }

    const files = Array.from(event.target.files)
    onFilesSelected(files)
  }

  return (
    <input
      type="file"
      id={id}
      className="sr-only"
      multiple={multiple}
      onChange={handleFilesSelected}
    />
  )
}
```

## Exemplo completo: Trigger (Label)

```typescript
// file-input/trigger.tsx
'use client'

import { useFileInput } from './root'

export function Trigger() {
  const { id } = useFileInput()

  return (
    <label
      htmlFor={id}
      className="cursor-pointer text-violet-500 hover:text-violet-700"
    >
      Click to upload
    </label>
  )
}
```

## Exemplo completo: ImagePreview

```typescript
// file-input/image-preview.tsx
'use client'

import { useMemo } from 'react'
import { useFileInput } from './root'

export function ImagePreview() {
  const { files } = useFileInput()

  const previewURL = useMemo(() => {
    if (files.length === 0) {
      return null
    }

    return URL.createObjectURL(files[0])
  }, [files])

  if (!previewURL) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
        {/* Placeholder icon */}
      </div>
    )
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={previewURL}
      alt=""
      className="h-16 w-16 rounded-full object-cover"
    />
  )
}
```

## Uso composado

```typescript
// page.tsx
import * as FileInput from './file-input'

export default function Page() {
  return (
    <FileInput.Root>
      <FileInput.ImagePreview />
      <div>
        <FileInput.Trigger />
        <FileInput.Control />
      </div>
    </FileInput.Root>
  )
}
```

## Desabilitando ESLint para img nativa no Next.js

```typescript
// Quando usar <img> em vez de <Image> do Next.js
// (por exemplo, para object URLs que são blobs locais)

// eslint-disable-next-line @next/next/no-img-element
<img src={previewURL} alt="" className="h-16 w-16 rounded-full object-cover" />
```

## Variação: Múltiplos file inputs na mesma página

```typescript
// Cada Root cria seu próprio Context Provider
// Portanto cada um tem seu próprio id e files
<FileInput.Root>
  <FileInput.ImagePreview />
  <FileInput.Trigger />
  <FileInput.Control />
</FileInput.Root>

<FileInput.Root>
  <FileInput.ImagePreview />
  <FileInput.Trigger />
  <FileInput.Control multiple />
</FileInput.Root>
// IDs são únicos automaticamente via useId()
```