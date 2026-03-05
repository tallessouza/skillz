---
name: rs-nextjs-app-router-pagina-busca
description: "Generates Next.js App Router search page structure with grid layout for product results. Use when user asks to 'create search page', 'add product search', 'build search results page', 'list search results', or 'search page layout' in Next.js App Router projects. Applies patterns: search route under app/(store)/search/, grid layout for results, search term display, next/image and next/link for products. Make sure to use this skill whenever building search or listing pages in Next.js App Router. Not for API route creation, search input handling, or server-side data fetching logic."
---

# Pagina de Busca — Next.js App Router

> Crie paginas de busca com estrutura de rota dedicada, exibicao do termo buscado e grid de resultados usando next/image e next/link.

## Rules

1. **Rota dedicada para busca** — crie `app/(store)/search/page.tsx` porque o App Router usa file-based routing e busca merece sua propria rota
2. **Exiba o termo buscado** — sempre mostre "Resultados para: {termo}" no topo, porque o usuario precisa de feedback visual do que buscou
3. **Grid de produtos com colunas fixas** — use `grid grid-cols-3 gap-6` para resultados, porque e o padrao de e-commerce para listagens
4. **next/image para todas as imagens** — nunca use `<img>` diretamente, porque next/image otimiza carregamento e dimensionamento automaticamente
5. **next/link para navegacao** — cada produto e um Link para `/product/{slug}`, porque preserva navegacao client-side do Next.js
6. **Layout flexivel no container** — envolva tudo em `div` com `flex flex-col gap-4`, porque separa visualmente o titulo dos resultados

## How to write

### Estrutura da pagina de busca

```tsx
// app/(store)/search/page.tsx
import Image from 'next/image'
import Link from 'next/link'

export default async function Search() {
  // TODO: extrair query dos searchParams e buscar na API
  const searchTerm = 'moletom'

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">{searchTerm}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* Produto — replicar para cada resultado */}
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
              {129..toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
```

### Formatacao de preco sem new Number()

```tsx
// CORRETO — literal numerico com toLocaleString
{(129).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}

// ERRADO — Number como constructor
{new Number(129).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
```

## Example

**Before (pagina vazia):**
```tsx
export default function Search() {
  return <div>Search</div>
}
```

**After (com estrutura de busca):**
```tsx
export default async function Search() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">moletom</span>
      </p>
      <div className="grid grid-cols-3 gap-6">
        <Link href="/product/moletom-never-stop-learning" className="group relative ...">
          <Image src="/moletom-never-stop-learning.png" width={480} height={480} quality={100} alt="" />
          <div className="absolute bottom-10 right-10 ...">
            <span className="text-sm truncate">Moletom Never Stop Learning</span>
            <span className="... bg-violet-500 ...">
              {(129).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pagina de busca sem resultados ainda | Monte o layout estatico primeiro, depois conecte a API |
| Preco numerico em JSX | Use `(valor).toLocaleString()` com parenteses no literal |
| Imagens de produto | Use `next/image` com width/height proporcionais, nao precisa ser tamanho real |
| Link para produto | Use `next/link` com href para `/product/{slug}` |
| Layout de resultados | Grid com colunas fixas (3 para desktop) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<img src="...">` | `<Image src="..." width={480} height={480} />` |
| `<a href="/product/...">` | `<Link href="/product/...">` |
| `new Number(129).toLocaleString(...)` | `(129).toLocaleString(...)` |
| Busca sem feedback do termo | `Resultados para: <span>{termo}</span>` |
| Resultados em lista vertical | `grid grid-cols-3 gap-6` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
