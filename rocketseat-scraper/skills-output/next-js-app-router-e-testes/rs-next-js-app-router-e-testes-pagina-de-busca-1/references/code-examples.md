# Code Examples: Pagina de Busca — Next.js App Router

## Exemplo completo da pagina de busca (estatica)

Este e o codigo final da aula, com dados hardcoded:

```tsx
// app/(store)/search/page.tsx
import Image from 'next/image'
import Link from 'next/link'

export default async function Search() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">moletom</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        <Link
          href="/product/moletom-never-stop-learning"
          className="group relative rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
        >
          <Image
            src="/moletom-never-stop-learning.png"
            className="group-hover:scale-105 transition-transform duration-500"
            width={480}
            height={480}
            quality={100}
            alt=""
          />
          <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
            <span className="text-sm truncate">Moletom Never Stop Learning</span>
            <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
              {(129).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </Link>

        {/* Replicado 2x para simular multiplos resultados */}
        <Link
          href="/product/moletom-never-stop-learning"
          className="group relative rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
        >
          <Image
            src="/moletom-never-stop-learning.png"
            className="group-hover:scale-105 transition-transform duration-500"
            width={480}
            height={480}
            quality={100}
            alt=""
          />
          <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
            <span className="text-sm truncate">Moletom Never Stop Learning</span>
            <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
              {(129).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </Link>

        <Link
          href="/product/moletom-never-stop-learning"
          className="group relative rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
        >
          <Image
            src="/moletom-never-stop-learning.png"
            className="group-hover:scale-105 transition-transform duration-500"
            width={480}
            height={480}
            quality={100}
            alt=""
          />
          <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
            <span className="text-sm truncate">Moletom Never Stop Learning</span>
            <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
              {(129).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
```

## Formatacao de preco — comparacao de abordagens

```tsx
// 1. ERRADO — Number constructor (lint error)
{new Number(129).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
// Error: Do not use Number as a constructor

// 2. CORRETO — Literal com parenteses
{(129).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
// Output: R$ 129,00

// 3. CORRETO — Variavel
const priceInCents = 12900
{(priceInCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
// Output: R$ 129,00
```

## Estrutura de rota no filesystem

```
app/
└── (store)/
    ├── search/
    │   └── page.tsx        ← Pagina de busca (esta aula)
    ├── product/
    │   └── [slug]/
    │       └── page.tsx    ← Pagina do produto (ja existia)
    └── page.tsx            ← Home (ja existia)
```

## Card de produto — da Home vs da Busca

### Home (com col-span para featured)
```tsx
<Link
  href={`/product/${product.slug}`}
  className="group relative col-span-6 row-span-6 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
>
  {/* ... */}
</Link>
```

### Busca (sem col-span, todos iguais)
```tsx
<Link
  href="/product/moletom-never-stop-learning"
  className="group relative rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
>
  {/* ... */}
</Link>
```

A diferenca principal: na home, os cards usam `col-span` e `row-span` para criar layout variado (produto destaque maior). Na busca, todos os cards tem o mesmo tamanho dentro do grid de 3 colunas.

## Evolucao esperada (proximas aulas)

```tsx
// O que vai mudar nesta pagina:
export default async function Search({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  // 1. Extrair o termo de busca dos searchParams
  const { q: query } = searchParams

  // 2. Buscar produtos na API
  const response = await api(`/products/search?q=${query}`)
  const products = await response.json()

  // 3. Renderizar dinamicamente
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">{query}</span>
      </p>
      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`}>
            {/* ... */}
          </Link>
        ))}
      </div>
    </div>
  )
}
```