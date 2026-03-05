# Code Examples: Componente FileItem Multi-Estado

## 1. Estrutura base do FileItem extraído

```tsx
// src/components/FileItem.tsx
import { CheckCircle2, Trash2 } from 'lucide-react'
import { formatBytes } from '../utils/format-bytes'
import { Button } from './Button'

interface FileItemProps {
  name: string
  size: number
  type: string
}

export function FileItem({ name, size }: FileItemProps) {
  const state: 'progress' | 'complete' | 'error' = 'progress'

  return (
    <div className="group flex items-start gap-4 rounded-lg border border-zinc-200 p-4">
      {/* Ícone do arquivo */}
      <div className="rounded-full border-4 border-violet-100 bg-violet-200 p-2 text-violet-600">
        {/* UploadCloud icon */}
      </div>

      {/* Conteúdo central - muda por estado */}
      {state === 'error' ? (
        <div className="flex flex-1 flex-col items-start gap-1">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-error-700">
              Upload failed. Please try again.
            </span>
            <span className="text-sm text-error-600">{name}</span>
          </div>
          <button
            type="button"
            className="text-sm font-semibold text-error-700 hover:text-error-900"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-start gap-1">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-700">{name}</span>
            <span className="text-sm text-zinc-500">{formatBytes(size)}</span>
          </div>

          {/* Barra de progresso */}
          <div className="flex w-full items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-zinc-100">
              <div
                className="h-2 rounded-full bg-violet-600"
                style={{
                  width: state === 'complete' ? '100%' : '80%',
                }}
              />
            </div>
            <span className="text-sm font-medium text-zinc-700">
              {state === 'complete' ? '100%' : '80%'}
            </span>
          </div>
        </div>
      )}

      {/* Ação - muda por estado */}
      {state === 'complete' ? (
        <CheckCircle2 className="h-5 w-5 fill-violet-600 text-white" />
      ) : state === 'error' ? null : (
        <Button variant="ghost" type="button">
          <Trash2 className="h-5 w-5 text-zinc-500" />
        </Button>
      )}
    </div>
  )
}
```

## 2. Uso no FileList

```tsx
// src/components/FileList.tsx
import { FileItem } from './FileItem'

export function FileList({ files }: FileListProps) {
  return (
    <div className="mt-4 space-y-3">
      {files.map((file) => (
        <FileItem
          key={file.name}
          name={file.name}
          size={file.size}
          type={file.type}
        />
      ))}
    </div>
  )
}
```

## 3. Paleta de cores customizada

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        violet: {
          25: '#FCFAFF',
          50: '#F9F5FF',
          100: '#F4EBFF',
          200: '#E9D5FF',
          300: '#D6BBFB',
          400: '#B692F6',
          500: '#9E77ED',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        error: {
          25: '#FFFBFA',
          50: '#FEF3F2',
          100: '#FEE4E2',
          200: '#FECDCA',
          300: '#FDA29B',
          400: '#F97066',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
          800: '#912018',
          900: '#7A271A',
        },
      },
    },
  },
} satisfies Config
```

## 4. Variação visual por estado — resumo

### Estado: progress
```tsx
// Conteúdo: nome + tamanho + barra de progresso em 80%
// Ação: botão Trash
// Cores: violet para barra, zinc para texto
```

### Estado: complete
```tsx
// Conteúdo: nome + tamanho + barra de progresso em 100%
// Ação: CheckCircle2 com fill-violet-600 text-white
// Cores: violet para barra e ícone
```

### Estado: error
```tsx
// Conteúdo: "Upload failed" + nome + botão "Try again"
// Ação: nenhum ícone lateral
// Cores: error-700 para título, error-600 para nome, error-900 para hover
```

## 5. Técnica do ícone preenchido

```tsx
// CheckCircle2 com preenchimento colorido e check branco
<CheckCircle2 className="h-5 w-5 fill-violet-600 text-white" />
// fill-violet-600 → preenche o círculo do SVG
// text-white → colore o stroke (o check interno) de branco
```