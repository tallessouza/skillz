# Code Examples: Componente de Compartilhamento

## Exemplo 1: Estrutura completa do aside

```tsx
// src/pages/blog/post/[slug].tsx (ou componente extraido)

import { Button } from '@/components/Button'

// Array de providers (sera implementado na proxima aula)
const shareProviders: { name: string; link: string }[] = []

export default function Post() {
  return (
    <>
      {/* Article com o conteudo do post */}
      <article>
        {/* ... markdown renderizado ... */}
      </article>

      {/* Aside de compartilhamento - FORA do article */}
      <aside className="space-y-6">
        <div className="rounded-lg bg-gray-700 p-[16px] md:p-[24px]">
          <h2 className="mb-[16px] text-heading-xs text-gray-100">
            Compartilhar
          </h2>
          <div className="space-y-3">
            {shareProviders.map((provider) => (
              <Button key={provider.name} variant="outline">
                {provider.name}
              </Button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
```

## Exemplo 2: Variante outline no Button

```tsx
// src/components/Button.tsx

// Antes (apenas 2 variantes)
const buttonVariants = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-600 text-white hover:bg-gray-500",
}

// Depois (com outline adicionada)
const buttonVariants = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-600 text-white hover:bg-gray-500",
  outline: "border border-gray-400 bg-gray-700 transition-colors duration-200 hover:text-blue-200 hover:border-blue-200",
}
```

## Exemplo 3: Layout responsivo (article + aside)

```tsx
// Container pai que posiciona article e aside
<div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
  <article>
    {/* Conteudo do post */}
  </article>
  
  <aside className="space-y-6">
    {/* Compartilhamento */}
  </aside>
</div>
```

Nota: o instrutor menciona que o body do post "ja ta no jeito" para suportar o aside ao lado. O grid com `lg:grid-cols-[1fr_300px]` e um padrao comum para isso.

## Exemplo 4: Evolucao futura do array de providers

```tsx
// Estrutura que sera implementada na proxima aula
interface ShareProvider {
  name: string
  icon: React.ComponentType
  getShareUrl: (postUrl: string) => string
}

const shareProviders: ShareProvider[] = [
  {
    name: 'Twitter',
    icon: TwitterIcon,
    getShareUrl: (url) => `https://twitter.com/intent/tweet?url=${url}`,
  },
  {
    name: 'Facebook', 
    icon: FacebookIcon,
    getShareUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    getShareUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  },
]
```