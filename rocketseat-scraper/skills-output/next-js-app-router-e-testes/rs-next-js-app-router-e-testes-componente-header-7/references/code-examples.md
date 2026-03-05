# Code Examples: Componente Header

## Exemplo 1: Layout raiz completo (layout.tsx)

```tsx
// app/layout.tsx - configuracao do body
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

## Exemplo 2: Layout da loja com grid

```tsx
// app/(store)/layout.tsx
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-rows-[min-content_max-content] gap-5 p-8">
      <header>
        {/* Header component */}
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}
```

### Alternativa com Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      gridTemplateRows: {
        app: 'min-content max-content',
      },
    },
  },
}
```

```tsx
// Uso simplificado
<div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-rows-app gap-5 p-8">
```

## Exemplo 3: Header completo

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingBag } from 'lucide-react'

export function Header() {
  return (
    <div className="flex items-center justify-between">
      {/* Esquerda: Logo + Busca */}
      <div className="flex items-center gap-5">
        <Link href="/" className="text-2xl font-extrabold text-white">
          devstore
        </Link>

        <form className="flex w-[320px] items-center gap-3 rounded-full bg-zinc-900 px-5 py-3 ring-zinc-700">
          <Search className="h-5 w-5 text-zinc-500" />
          <input
            placeholder="Buscar produtos..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
          />
        </form>
      </div>

      {/* Direita: Carrinho + Separador + Conta */}
      <div className="flex items-center gap-4">
        {/* Carrinho */}
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          <span className="text-sm">Cart (0)</span>
        </div>

        {/* Separador vertical */}
        <div className="w-px h-4 bg-zinc-700" />

        {/* Conta */}
        <Link href="/" className="flex items-center gap-2 hover:underline">
          <span className="text-sm">Account</span>
          <Image
            src="https://github.com/diego3g.png"
            className="h-6 w-6 rounded-full"
            width={24}
            height={24}
            alt=""
          />
        </Link>
      </div>
    </div>
  )
}
```

## Exemplo 4: Configuracao do Next.js para imagens externas

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com'],
  },
}

module.exports = nextConfig
```

## Exemplo 5: Variacoes do input de busca

### Com submit button

```tsx
<form className="flex w-[320px] items-center gap-3 rounded-full bg-zinc-900 px-5 py-3 ring-zinc-700">
  <Search className="h-5 w-5 text-zinc-500" />
  <input
    placeholder="Buscar produtos..."
    className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
  />
  <button type="submit" className="text-zinc-500 hover:text-zinc-300">
    <ArrowRight className="h-4 w-4" />
  </button>
</form>
```

### Com largura responsiva

```tsx
<form className="flex w-full max-w-[320px] items-center gap-3 rounded-full bg-zinc-900 px-5 py-3 ring-zinc-700">
  {/* ... */}
</form>
```

## Exemplo 6: Padrao de separador reutilizavel

```tsx
// Separador vertical fino
<div className="w-px h-4 bg-zinc-700" />

// Separador vertical medio
<div className="w-px h-6 bg-zinc-700" />

// Separador horizontal
<div className="h-px w-full bg-zinc-700" />
```

## Exemplo 7: Classe por classe do layout

```
mx-auto          → margin: 0 auto (centraliza horizontalmente)
grid              → display: grid
min-h-screen      → min-height: 100vh
w-full            → width: 100%
max-w-[1600px]    → max-width: 1600px
grid-rows-[min-content_max-content] → grid-template-rows: min-content max-content
gap-5             → gap: 1.25rem (20px)
p-8               → padding: 2rem (32px)
```

```
bg-zinc-950       → background-color: #09090b (quase preto)
text-zinc-50      → color: #fafafa (quase branco)
antialiased       → -webkit-font-smoothing: antialiased
```

```
flex              → display: flex
items-center      → align-items: center
justify-between   → justify-content: space-between
gap-5             → gap: 1.25rem (20px)
gap-4             → gap: 1rem (16px)
gap-3             → gap: 0.75rem (12px)
gap-2             → gap: 0.5rem (8px)
```