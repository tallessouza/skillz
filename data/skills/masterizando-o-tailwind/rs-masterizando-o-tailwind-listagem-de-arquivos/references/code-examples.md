# Code Examples: Listagem de Arquivos

## Componente FileList completo

```tsx
'use client'

import { useFileInput } from './Root' // ou de onde vem o contexto
import { UploadCloud, Trash2 } from 'lucide-react'
import { formatBytes } from '@/utils/format-bytes'

export function FileList() {
  const { files } = useFileInput()

  return (
    <div className="mt-4 flex flex-col gap-3">
      {files.map((file) => {
        return (
          <div
            key={file.name}
            className="group flex items-start gap-4 rounded-lg border border-zinc-200 px-4 py-3"
          >
            <div className="rounded-full border-4 border-violet-100 bg-violet-200 p-2 text-violet-600">
              <UploadCloud className="h-4 w-4" />
            </div>

            <div className="flex flex-1 flex-col items-start gap-1">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-700">
                  {file.name}
                </span>
                <span className="text-sm text-zinc-500">
                  {formatBytes(file.size)}
                </span>
              </div>

              <div className="flex w-full items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-zinc-100">
                  <div
                    className="h-2 rounded-full bg-violet-600"
                    style={{ width: '80%' }}
                  />
                </div>
                <span className="text-sm font-medium text-zinc-700">80%</span>
              </div>
            </div>

            <button
              type="button"
              className="ml-auto rounded-md p-2 hover:bg-zinc-50"
            >
              <Trash2 className="h-5 w-5 text-zinc-500" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
```

## Funcao formatBytes

```typescript
// utils/format-bytes.ts
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let value = bytes

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`
}
```

## Logica de multiple no Control

```tsx
// Dentro do FileInput Control
interface ControlProps {
  multiple?: boolean
}

export function Control({ multiple = false }: ControlProps) {
  const { onFileSelected } = useFileInput()

  return (
    <input
      type="file"
      multiple={multiple}
      onChange={(e) => {
        if (e.target.files) {
          onFileSelected(Array.from(e.target.files), multiple)
        }
      }}
    />
  )
}
```

## Handler com suporte a multiple

```tsx
// Dentro do Root/Provider do FileInput
function handleSelectedFiles(files: File[], multiple: boolean = false) {
  if (multiple) {
    setFiles((prev) => [...prev, ...files])
  } else {
    setFiles(files)
  }
}
```

## Re-exportacao no index.ts

```typescript
// components/FileInput/index.ts
export { FileList } from './FileList'
export { Control } from './Control'
export { Trigger } from './Trigger'
export { Root } from './Root'
```

## Uso na pagina

```tsx
<FileInput.Root>
  <FileInput.Trigger />
  <FileInput.Control multiple />
  <FileInput.FileList />
</FileInput.Root>
```

## Alternativa: space-y vs gap

O instrutor menciona que `mt-4 flex flex-col gap-3` pode ser substituido por `mt-4 space-y-3`. Ambos funcionam, mas `flex + gap` e mais previsivel com elementos condicionais.