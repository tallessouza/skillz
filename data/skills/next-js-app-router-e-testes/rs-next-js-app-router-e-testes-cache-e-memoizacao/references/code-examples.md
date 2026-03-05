# Code Examples: Cache & Memoization no Next.js App Router

## Exemplo 1: Fetch com revalidate (da aula)

```typescript
// app/(store)/(home)/page.tsx
export default async function Home() {
  const response = await fetch('http://localhost:3333/products/featured', {
    next: {
      revalidate: 60 * 60, // 1 hora em segundos
    },
  })

  const products = await response.json()

  // ... render products
}
```

**O que acontece:**
1. Primeiro usuario acessa → fetch real ao backend → dados salvos em cache
2. Pelos proximos 3600 segundos → todos os usuarios recebem dados do cache
3. Apos 3600 segundos → proximo acesso refaz o fetch e atualiza o cache
4. Ciclo se repete

## Exemplo 2: As tres estrategias lado a lado

```typescript
// ESTRATEGIA 1: Cache permanente (dados imutaveis)
const res1 = await fetch('https://api.example.com/categories', {
  cache: 'force-cache', // padrao — pode omitir
})

// ESTRATEGIA 2: Sem cache (dados em tempo real / personalizados)
const res2 = await fetch('https://api.example.com/user/recommendations', {
  cache: 'no-store',
})

// ESTRATEGIA 3: Revalidacao periodica (meio-termo)
const res3 = await fetch('https://api.example.com/products/featured', {
  next: { revalidate: 60 * 60 }, // 1 hora
})
```

## Exemplo 3: Memoization automatica do React

```typescript
// app/components/Header.tsx (Server Component)
async function Header() {
  // Este fetch...
  const res = await fetch('http://localhost:3333/products/featured')
  const products = await res.json()
  return <nav>{products.length} produtos</nav>
}

// app/(store)/(home)/page.tsx (Server Component)
export default async function Home() {
  // ...e este fetch sao a MESMA URL na MESMA pagina
  const res = await fetch('http://localhost:3333/products/featured')
  const products = await res.json()
  return (
    <>
      <Header />
      <ProductList products={products} />
    </>
  )
}
// React faz apenas 1 requisicao real — memoization automatica
```

## Exemplo 4: Quando memoization NAO funciona

```typescript
// Pagina A: /home
async function Home() {
  const res = await fetch('http://localhost:3333/products/featured')
  // ...
}

// Pagina B: /trending (OUTRA pagina)
async function Trending() {
  // Mesmo fetch, mas em OUTRA pagina — memoization nao se aplica
  // Sem cache configurado, esta requisicao e feita do zero
  const res = await fetch('http://localhost:3333/products/featured')
  // ...
}
```

Para evitar requisicao duplicada entre paginas, e necessario usar **cache** (Next.js), nao memoization (React).

## Exemplo 5: Tempos de revalidate por dominio

```typescript
// Categorias — mudam raramente
next: { revalidate: 60 * 60 * 24 } // 24 horas

// Produtos em destaque — mudam algumas vezes por dia
next: { revalidate: 60 * 60 } // 1 hora

// Precos/estoque — mudam com frequencia
next: { revalidate: 60 * 5 } // 5 minutos

// Recomendacoes personalizadas — mudam por usuario
cache: 'no-store' // sem cache
```