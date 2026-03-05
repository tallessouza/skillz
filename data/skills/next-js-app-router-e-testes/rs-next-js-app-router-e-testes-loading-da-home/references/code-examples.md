# Code Examples: Loading com Skeleton Screens

## 1. Delay artificial para desenvolvimento

```typescript
// app/api/products/featured/route.ts
import { z } from 'zod'
import data from '../data.json'

export async function GET() {
  // Simula latencia de rede real (REMOVER em producao)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const featured = data.products.filter((product) => product.featured)
  return Response.json(featured)
}
```

## 2. Componente Skeleton completo

```typescript
// components/skeleton.tsx
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge(
        'bg-zinc-50/10 animate-pulse rounded-md',
        className,
      )}
      {...props}
    />
  )
}
```

### Por que cada classe:
- `bg-zinc-50/10` — cinza muito claro com baixa opacidade (10%), ideal para dark themes
- `animate-pulse` — animacao built-in do Tailwind que oscila a opacidade, criando efeito de "respiracao"
- `rounded-md` — bordas arredondadas para parecer com cards/imagens reais

## 3. Loading page da Home

```typescript
// app/(store)/(home)/loading.tsx
import { Skeleton } from '@/components/skeleton'

export default function HomeLoading() {
  return (
    <div className="grid h-full grid-cols-9 grid-rows-6 gap-6">
      <Skeleton className="col-span-6 row-span-6 h-[860px]" />
      <Skeleton className="col-span-3 row-span-3" />
      <Skeleton className="col-span-3 row-span-3" />
    </div>
  )
}
```

### Notas sobre o layout:
- O grid replica exatamente o grid da Home real (`grid-cols-9 grid-rows-6 gap-6`)
- `h-full` ao inves de `max-h-[...]` porque sem imagens dentro, o grid nao tem altura natural
- O primeiro skeleton (produto destaque) tem `h-[860px]` fixo — os outros dois herdam a altura do grid
- `col-span-6 row-span-6` para o produto grande, `col-span-3 row-span-3` para os menores

## 4. Tailwind config — ERRADO vs CORRETO

### ERRADO (substitui valores padrao):
```javascript
// tailwind.config.ts
const config = {
  theme: {
    fontFamily: {
      sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
    },
    gridTemplateRows: {
      app: 'min-content max-content',
    },
    // PROBLEMA: grid-rows-1, grid-rows-2, ..., grid-rows-6 NAO EXISTEM MAIS
  },
}
```

### CORRETO (adiciona sem substituir):
```javascript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
      gridTemplateRows: {
        app: 'min-content max-content',
      },
      // CORRETO: grid-rows-1 ate grid-rows-6 continuam existindo + grid-rows-app
    },
  },
}
```

## 5. Instalacao do tailwind-merge

```bash
npm install tailwind-merge
```

## 6. Variacao: Skeleton para paginas diferentes

```typescript
// app/(store)/product/[slug]/loading.tsx
import { Skeleton } from '@/components/skeleton'

export default function ProductLoading() {
  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      <div className="col-span-2 overflow-hidden">
        <Skeleton className="h-[860px] w-full" />
      </div>
      <div className="flex flex-col justify-center px-12">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="mt-2 h-5 w-1/2" />
        <Skeleton className="mt-8 h-12 w-full" />
        <Skeleton className="mt-4 h-10 w-40" />
      </div>
    </div>
  )
}
```

Cada pagina cria seu proprio `loading.tsx` reutilizando o mesmo componente `Skeleton` com dimensoes diferentes.