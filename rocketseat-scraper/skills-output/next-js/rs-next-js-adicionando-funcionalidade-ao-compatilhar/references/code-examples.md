# Code Examples: useClipboard Hook Pattern

## Estrutura de pastas

```
hooks/
├── useClipboard/
│   └── index.ts
└── useShare/
    ├── index.tsx
    └── socialProviders.ts
```

## useClipboard completo

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

## Social providers com clipboard

```typescript
// hooks/useShare/socialProviders.ts
type SocialProvider = 'twitter' | 'facebook' | 'linkedin' | 'clipboard'

interface ShareProvider {
  provider: SocialProvider
  name: string
  icon: React.ReactNode
  action: () => void
}
```

## useShare consumindo useClipboard

```typescript
// hooks/useShare/index.tsx
import { useClipboard } from '../useClipboard'
import { Link2 } from 'lucide-react'

interface UseShareProps {
  url: string
  clipboardTimeout?: number
}

export function useShare({ url, clipboardTimeout = 2000 }: UseShareProps) {
  const { isCopied, handleCopy } = useClipboard({ timeout: clipboardTimeout })

  async function share(provider: SocialProvider) {
    if (provider === 'clipboard') {
      return await handleCopy(url)
    }
    // ... outros providers (twitter, facebook, etc)
  }

  const shareButtons = [
    // ... social providers
    {
      provider: 'clipboard' as SocialProvider,
      name: isCopied ? 'Link copiado' : 'Copiar link',
      icon: <Link2 className="h-4 w-4" />,
      action: () => share('clipboard'),
    },
  ]

  return { shareButtons, isCopied, handleCopy }
}
```

## Componente de share com feedback visual

```tsx
function ShareSidebar({ url }: { url: string }) {
  const { shareButtons } = useShare({ url })

  return (
    <aside>
      {shareButtons.map(({ provider, name, icon, action }) => (
        <button key={provider} onClick={action}>
          {icon}
          {name}
        </button>
      ))}
    </aside>
  )
}
```

## Variacoes

### Com timeout maior para contextos diferentes

```typescript
// Em um code block, 3 segundos de feedback
const { isCopied, handleCopy } = useClipboard({ timeout: 3000 })
```

### Com icone que troca (check vs copy)

```tsx
import { Link2, Check } from 'lucide-react'

const { isCopied, handleCopy } = useClipboard()

<button onClick={() => handleCopy(text)}>
  {isCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
  {isCopied ? 'Copiado!' : 'Copiar'}
</button>
```