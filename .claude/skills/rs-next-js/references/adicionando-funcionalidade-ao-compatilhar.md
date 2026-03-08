---
name: rs-next-js-use-clipboard-hook
description: "Generates a reusable useClipboard custom hook when writing React copy-to-clipboard functionality. Use when user asks to 'copy to clipboard', 'copy link', 'share button', 'clipboard hook', or 'copy text feedback'. Applies pattern: navigator.clipboard API with try/catch, auto-reset state via configurable timeout, useCallback for stable reference. Make sure to use this skill whenever implementing any copy-to-clipboard feature in React/Next.js. Not for native mobile clipboard, file copying, or drag-and-drop operations."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: custom-hooks
  tags: [clipboard, custom-hook, useClipboard, react, share, copy-to-clipboard]
---

# useClipboard Hook Pattern

> Encapsule logica de copia em um custom hook com estado temporario e timeout configuravel.

## Rules

1. **Sempre use um custom hook separado** — `useClipboard` isolado em sua propria pasta, porque a logica de copia e reutilizavel em qualquer componente
2. **Verifique suporte do navigator.clipboard** — cheque antes de usar, porque nem todo browser suporta a API
3. **Use useCallback para a funcao de copia** — porque o hook exporta a funcao e ela sera passada como prop/dependencia
4. **Auto-reset o estado com timeout configuravel** — `isCopied` volta a `false` apos delay, porque o feedback visual deve ser temporario
5. **Faca cleanup do timeout no useEffect** — `clearTimeout` no return, porque evita memory leaks e state updates em componentes desmontados
6. **Timeout default de 2 segundos** — parametro opcional com default sensato, porque 2s e o padrao de UX para feedback de copia

## How to write

### Estrutura do hook

```typescript
// hooks/useClipboard/index.ts
import { useState, useCallback, useEffect } from 'react'

interface UseClipboardProps {
  timeout?: number
}

export function useClipboard({ timeout = 2000 }: UseClipboardProps = {}) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(async (text: string) => {
    if (!navigator.clipboard) {
      console.error('Clipboard nao suportado')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      return true
    } catch (error) {
      console.error('Falha ao copiar o texto:', error)
      setIsCopied(false)
      return false
    }
  }, [])

  useEffect(() => {
    if (!isCopied) return

    const timer = setTimeout(() => {
      setIsCopied(false)
    }, timeout)

    return () => clearTimeout(timer)
  }, [isCopied, timeout])

  return { isCopied, handleCopy }
}
```

### Uso com feedback visual

```tsx
const { isCopied, handleCopy } = useClipboard({ timeout: 2000 })

<button onClick={() => handleCopy(url)}>
  <Link2 className="h-4 w-4" />
  {isCopied ? 'Link copiado' : 'Copiar link'}
</button>
```

## Example

**Before (logica inline no componente):**
```tsx
function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return <button onClick={copy}>{copied ? 'Copiado!' : 'Copiar'}</button>
}
```

**After (com useClipboard):**
```tsx
function ShareButton({ url }: { url: string }) {
  const { isCopied, handleCopy } = useClipboard()

  return (
    <button onClick={() => handleCopy(url)}>
      {isCopied ? 'Link copiado' : 'Copiar link'}
    </button>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Botao de copiar link/share | Use useClipboard com feedback visual |
| Multiplos botoes de copia na mesma pagina | Uma instancia de useClipboard por botao |
| Timeout customizado necessario | Passe `{ timeout: 3000 }` no hook |
| Provider pattern com social share | Adicione `clipboard` como provider type no enum |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `navigator.clipboard.writeText()` inline no componente | `handleCopy(text)` via useClipboard |
| `setTimeout` sem cleanup | `useEffect` com `clearTimeout` no return |
| Estado de copia sem auto-reset | Timeout configuravel que reseta `isCopied` |
| Ignorar verificacao de suporte | Checar `navigator.clipboard` antes de usar |

## Troubleshooting

### Comportamento diferente entre dev e producao
**Symptom:** Funcionalidade funciona em `npm run dev` mas nao em `npm run build && npm start`
**Cause:** Dev mode e mais permissivo — producao aplica otimizacoes, cache agressivo, e validacoes mais estritas
**Fix:** Sempre testar com `npm run build && npm start` antes de deploy. Verificar que nao ha erros no build output. Limpar .next antes de rebuildar

### Erro "Module not found" apos refatoracao
**Symptom:** Import de modulo falha apos mover arquivo
**Cause:** Path do import nao foi atualizado, ou alias de path (@/) nao esta configurado
**Fix:** Atualizar todos os imports que referenciam o arquivo movido. Verificar tsconfig.json paths para aliases

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-adicionando-funcionalidade-ao-compatilhar/references/deep-explanation.md) — O instrutor enfatiza a importancia de encapsular a logica de copia em um hook dedicado porque:
- [code-examples.md](../../../data/skills/next-js/rs-next-js-adicionando-funcionalidade-ao-compatilhar/references/code-examples.md) — hooks/
