---
name: rs-testes-arq-frontend-copy-button
description: "Applies CopyButton component pattern when building copy-to-clipboard functionality in React/Next.js. Use when user asks to 'create a copy button', 'copy to clipboard', 'clipboard component', or 'copy text button'. Enforces proper timer cleanup with useRef, useEffect unmount cleanup, disabled state management, and navigator.clipboard API usage. Make sure to use this skill whenever implementing any copy-to-clipboard UI in React. Not for backend clipboard operations, file copy, or non-React contexts."
---

# CopyButton Component Pattern

> Ao implementar botoes de copiar em React, gerenciar timers com useRef e limpar no unmount para evitar vazamento de memoria.

## Rules

1. **Receba conteudo via props** — o componente nao deve saber de onde vem o texto, recebe `content: string` como prop, porque isso desacopla o botao da fonte de dados
2. **Desabilite quando vazio** — use `content.trim()` para checar, porque copiar string vazia nao faz sentido para o usuario
3. **Use navigator.clipboard.writeText** — API async do browser, sempre dentro de try/catch, porque pode falhar por permissoes do navegador
4. **Guarde timer em useRef** — `useRef<ReturnType<typeof setTimeout>>` para manter referencia entre re-renders sem disparar novo render
5. **Limpe timer no unmount** — useEffect com return cleanup, porque setTimeout sem cleanup causa vazamento de memoria
6. **Limpe timer antes de novo click** — se usuario clicar rapido varias vezes, limpe o timer anterior antes de criar novo

## How to write

### Estrutura do CopyButton

```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
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

### Uso com React Hook Form watch

```typescript
// No formulario pai
const content = form.watch('content')

<CopyButton content={content} />
```

## Example

**Before (vazamento de memoria):**
```typescript
const handleCopy = async () => {
  await navigator.clipboard.writeText(content)
  setIsCopied(true)
  setTimeout(() => setIsCopied(false), 2000) // leak! sem ref, sem cleanup
}
```

**After (com cleanup correto):**
```typescript
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

const clearTimer = () => {
  if (timerRef.current) {
    clearTimeout(timerRef.current)
    timerRef.current = null
  }
}

useEffect(() => () => clearTimer(), [])

const handleCopy = async () => {
  clearTimer() // limpa timer anterior
  try {
    await navigator.clipboard.writeText(content.trim())
    setIsCopied(true)
    timerRef.current = setTimeout(() => setIsCopied(false), 2000)
  } catch (error) {
    toast.error('Erro ao copiar', { description: (error as Error).message })
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente usa setTimeout/setInterval | Sempre useRef + cleanup no useEffect |
| Botao depende de conteudo externo | Receba via props, nao acesse contexto interno |
| Estado muda temporariamente (feedback visual) | useRef para timer + cleanup antes de novo disparo |
| Disabled precisa bloquear tab navigation | Use `pointerEvents: 'none'` alem de `disabled` |
| Clipboard API pode falhar | try/catch + toast de erro com message |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `setTimeout(() => setState(false), 2000)` solto | `timerRef.current = setTimeout(...)` com cleanup |
| `navigator.clipboard.writeText(text)` sem try/catch | Sempre dentro de try/catch com feedback de erro |
| Componente que busca o conteudo internamente | Props `content: string` para desacoplamento |
| `disabled={!content}` sem trim | `disabled={content.trim().length === 0}` |
| Timer sem cleanup no unmount | `useEffect(() => () => clearTimeout(...), [])` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
