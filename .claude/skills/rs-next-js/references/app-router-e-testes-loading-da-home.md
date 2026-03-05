---
name: rs-nextjs-app-router-loading-da-home
description: "Applies Next.js loading page patterns with skeleton screens when user asks to 'create loading state', 'add skeleton', 'loading page', 'shimmer effect', or 'improve perceived performance'. Enforces skeleton component architecture with tailwind-merge for class composition and proper Tailwind config extension. Make sure to use this skill whenever creating loading states in Next.js App Router projects. Not for API loading states, React Suspense boundaries configuration, or spinner/toast implementations."
---

# Loading com Skeleton Screens no Next.js App Router

> Crie paginas de loading com skeleton screens reutilizaveis ao inves de spinners genericos, porque skeleton screens comunicam a estrutura do conteudo antes dele carregar.

## Rules

1. **Use skeleton screens, nunca spinners genericos** — `<Skeleton />` com layout similar ao conteudo final, porque skeleton screens reduzem a percepcao de tempo de espera ao mostrar a estrutura da pagina
2. **Componente Skeleton reutilizavel e configuravel** — largura e altura via props com `ComponentProps<'div'>`, porque cada pagina tem layout diferente
3. **Use `twMerge` para composicao de classes** — nunca spread direto de className, porque classes do Tailwind seriam substituidas ao inves de combinadas
4. **Arquivo `loading.tsx` no App Router** — Next.js detecta automaticamente e exibe durante carregamento assincrono, porque e o mecanismo built-in do framework
5. **Use `extend` no tailwind.config** — adicione customizacoes dentro de `theme.extend`, nao direto em `theme`, porque colocar direto substitui TODAS as opcoes padrao do Tailwind

## How to write

### Componente Skeleton base

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

### Loading page (App Router)

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

### Tailwind config correto (extend)

```javascript
// tailwind.config.ts
theme: {
  extend: {  // DENTRO de extend, nao direto em theme
    fontFamily: { sans: ['var(--font-inter)', ...] },
    gridTemplateRows: { app: 'min-content max-content' },
  },
}
```

## Example

**Before (spinner generico):**
```typescript
export default function Loading() {
  return <p>Carregando...</p>
}
```

**After (skeleton screen estrutural):**
```typescript
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Pagina assincrona com fetch | Criar `loading.tsx` no mesmo diretorio com skeleton matching o layout |
| Skeleton precisa de tamanho fixo | Use altura em pixels quando o conteudo nao define altura natural |
| Skeleton dentro de grid | Use `h-full` no container e deixe grid definir alturas dos filhos |
| Customizando Tailwind theme | Sempre dentro de `extend` para nao perder valores padrao |
| Componente recebe className externo | Use `twMerge` para combinar sem substituir |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `className={className}` substituindo classes fixas | `className={twMerge('bg-zinc-50/10 animate-pulse', className)}` |
| `theme: { gridTemplateRows: { app: '...' } }` | `theme: { extend: { gridTemplateRows: { app: '...' } } }` |
| `<p>Carregando...</p>` como loading | `<Skeleton className="h-[860px]" />` matching layout real |
| Spinner centralizado na tela | Skeleton screens replicando estrutura do conteudo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-loading-da-home/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-loading-da-home/references/code-examples.md)
