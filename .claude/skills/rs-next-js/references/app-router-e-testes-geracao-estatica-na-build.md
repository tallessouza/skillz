---
name: rs-nextjs-app-router-geracao-estatica
description: "Applies Next.js generateStaticParams for static generation at build time when writing dynamic route pages. Use when user asks to 'pre-render pages', 'cache at build', 'static generation', 'generateStaticParams', or 'optimize first load'. Ensures correct function export, selective pre-rendering strategy, and async data fetching for params. Make sure to use this skill whenever creating or optimizing Next.js dynamic routes with App Router. Not for ISR configuration, revalidate tags, or server actions."
---

# Geracao Estatica na Build (Next.js App Router)

> Exporte `generateStaticParams` em rotas dinamicas para pre-cachear paginas no momento da build, garantindo carregamento instantaneo sem requisicoes adicionais.

## Rules

1. **Exporte `generateStaticParams` com esse nome exato** — o Next.js so reconhece essa convencao, qualquer variacao e silenciosamente ignorada
2. **Retorne um array de objetos com as mesmas keys dos parametros dinamicos** — se a rota e `[slug]`, cada objeto precisa ter `{ slug: "valor" }`, porque o Next mapeia por nome
3. **Use geracao estatica apenas para paginas criticas** — produtos em destaque, landing pages, top 20 mais acessados, porque cada pagina aumenta o tempo de build
4. **Nunca gere estaticamente catalogos inteiros** — 1000 produtos = build extremamente lento, porque cada pagina executa todas as chamadas API durante a build
5. **A funcao pode ser async** — faca fetch de dados reais para determinar quais paginas gerar, porque hardcodar slugs nao escala
6. **A API precisa estar acessivel durante a build** — se a API roda no mesmo projeto Next, o servidor precisa estar rodando em paralelo durante `next build`

## How to write

### generateStaticParams basico

```typescript
// app/product/[slug]/page.tsx
export async function generateStaticParams() {
  const response = await api('/products/featured')
  const products: Product[] = await response.json()

  return products.map((product) => ({
    slug: product.slug,
  }))
}
```

### generateStaticParams com valor hardcoded (raro, apenas para testes)

```typescript
export function generateStaticParams() {
  return [
    { slug: 'moletom-never-stop-learning' },
    { slug: 'camiseta-wildcats-2022' },
  ]
}
```

## Example

**Before (sem geracao estatica):**
```typescript
// app/product/[slug]/page.tsx
// Primeiro usuario aguarda carregamento completo
// Pagina so entra em cache apos primeiro acesso
export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  return <ProductDetails product={product} />
}
```

**After (com geracao estatica):**
```typescript
// app/product/[slug]/page.tsx
export async function generateStaticParams() {
  const response = await api('/products/featured')
  const products: Product[] = await response.json()

  return products.map((product) => ({
    slug: product.slug,
  }))
}

// Paginas dos produtos em destaque ja estao cacheadas na build
// Primeiro usuario tem acesso instantaneo
export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  return <ProductDetails product={product} />
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Produtos em destaque / featured | Gerar estaticamente |
| Top 10-20 paginas mais acessadas | Gerar estaticamente |
| Catalogo inteiro (100+ itens) | NAO gerar, deixar cache sob demanda |
| Pagina com dados que mudam a cada minuto | NAO gerar, usar revalidate |
| Landing pages fixas | Gerar estaticamente |
| API no mesmo projeto Next | Garantir servidor rodando durante build |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Gerar todos os produtos de um e-commerce | Gerar apenas featured/top acessados |
| Hardcodar slugs manualmente em producao | Buscar slugs via API no generateStaticParams |
| Rodar `next build` sem API acessivel | Garantir API rodando antes do build |
| Retornar objetos sem a key do parametro dinamico | Mapear exatamente `{ slug: product.slug }` |
| Nomear a funcao diferente | Usar exatamente `generateStaticParams` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-geracao-estatica-na-build/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-geracao-estatica-na-build/references/code-examples.md)
