# Code Examples: CopyButton Component Pattern

## Exemplo completo do componente

```typescript
'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type CopyButtonProps = {
  content: string
}

export const CopyButton = ({ content }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isContentEmpty = content.trim().length === 0

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  const handleCopy = async () => {
    const text = content.trim()
    clearTimer()

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      timerRef.current = setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error('Erro ao copiar o texto', {
        description: (error as Error).message,
      })
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      size="sm"
      disabled={isContentEmpty}
      onClick={handleCopy}
      className="disabled:opacity-50 disabled:cursor-default"
      style={{ pointerEvents: isContentEmpty ? 'none' : 'auto' }}
    >
      {isCopied ? (
        <Check width={16} height={16} className="text-green-500" />
      ) : (
        <Copy width={16} height={16} />
      )}
      <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
    </Button>
  )
}
```

## Estrutura de pastas

```
components/
  button-actions/
    copy-button/
      copy-button.tsx
      index.ts          # re-export
```

## index.ts (re-export)

```typescript
export { CopyButton } from './copy-button'
```

## Integracao com formulario (React Hook Form)

```typescript
import { CopyButton } from '@/components/button-actions/copy-button'

// Dentro do componente de formulario:
const form = useForm<FormValues>({
  // ... config
})

const content = form.watch('content')

return (
  <form>
    <header>
      <CopyButton content={content} />
      <Button type="submit">Salvar</Button>
    </header>
    {/* ... campos do formulario */}
  </form>
)
```

## Evolucao: versao sem cleanup (ERRADA)

```typescript
// PROBLEMA: vazamento de memoria
const handleCopy = async () => {
  await navigator.clipboard.writeText(content)
  setIsCopied(true)
  setTimeout(() => setIsCopied(false), 2000)
}
```

## Evolucao: com ref mas sem funcao extraida (INTERMEDIARIA)

```typescript
// Funciona mas duplica logica
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }
}, [])

const handleCopy = async () => {
  if (timerRef.current) {
    clearTimeout(timerRef.current)
    timerRef.current = null
  }
  // ...
}
```

## Evolucao: versao final com clearTimer extraido (CORRETA)

```typescript
const clearTimer = () => {
  if (timerRef.current) {
    clearTimeout(timerRef.current)
    timerRef.current = null
  }
}

useEffect(() => () => clearTimer(), [])

const handleCopy = async () => {
  clearTimer()
  // ...
}
```