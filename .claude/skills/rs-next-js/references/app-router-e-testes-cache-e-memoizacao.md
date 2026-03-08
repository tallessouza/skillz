---
name: rs-nextjs-app-router-cache-e-memoizacao
description: "Enforces correct cache and memoization strategies when writing Next.js App Router data fetching code. Use when user asks to 'fetch data', 'make API calls', 'configure cache', 'use revalidate', 'optimize requests', or 'avoid duplicate fetches' in Next.js. Applies rules: distinguish memoization (React, same page) from cache (Next.js, cross-page), use force-cache/no-store/revalidate correctly per use case. Make sure to use this skill whenever writing fetch calls in Next.js Server Components. Not for client-side fetching, React Query, SWR, or non-Next.js frameworks."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [cache, memoization, revalidate, force-cache, no-store, data-fetching]
---

# Cache & Memoization no Next.js App Router

> Toda chamada fetch em Server Components deve ter uma estrategia de cache explicita baseada na natureza dos dados: estaticos, periodicos ou tempo-real.

## Rules

1. **Memoization e do React, Cache e do Next** — memoization evita fetch duplicado na mesma pagina; cache persiste dados entre paginas e usuarios, porque confundir os dois leva a estrategias erradas
2. **Memoization e automatica** — se o mesmo fetch (mesma URL, mesmos params) acontece 2x no carregamento da mesma pagina, React deduplica automaticamente, porque Server Components ja fazem isso sem configuracao
3. **Memoization nao cruza paginas** — navegar de /home para /product refaz o fetch mesmo que a URL seja identica, porque sao fluxos de renderizacao distintos
4. **Defina cache explicitamente em todo fetch** — use `force-cache`, `no-store`, ou `next: { revalidate: N }`, porque o comportamento padrao pode mudar entre versoes do Next
5. **Dados personalizados por usuario = no-store** — se o retorno muda por sessao/usuario (recomendacoes, carrinho, dashboard), use `no-store`, porque cachear dados personalizados serve dados errados para outros usuarios
6. **Dados compartilhados e estaveis = revalidate** — produtos em destaque, categorias, posts de blog usam `next: { revalidate: N }`, porque poupa o backend sem sacrificar frescor dos dados
7. **Calcule revalidate pelo dominio** — produtos em destaque podem ser 1h (`60 * 60`), precos podem ser 5min (`60 * 5`), porque o tempo deve refletir a frequencia real de mudanca dos dados

## How to write

### Fetch com revalidate (dados compartilhados)

```typescript
// Dados que mudam pouco — revalidar a cada 1 hora
const response = await fetch('https://api.example.com/products/featured', {
  next: { revalidate: 60 * 60 }, // 1 hora em segundos
})
const products = await response.json()
```

### Fetch sem cache (dados em tempo real)

```typescript
// Dados personalizados ou que mudam a cada acesso
const response = await fetch('https://api.example.com/recommendations', {
  cache: 'no-store',
})
const recommendations = await response.json()
```

### Fetch com cache permanente (dados imutaveis)

```typescript
// Dados que nunca mudam (ou mudam via deploy)
const response = await fetch('https://api.example.com/categories', {
  cache: 'force-cache',
})
const categories = await response.json()
```

## Example

**Before (sem estrategia de cache):**
```typescript
// Nenhuma configuracao — comportamento implicito e fragil
export default async function Home() {
  const response = await fetch('http://localhost:3333/products/featured')
  const products = await response.json()
  return <ProductList products={products} />
}
```

**After (com estrategia explicita):**
```typescript
export default async function Home() {
  const response = await fetch('http://localhost:3333/products/featured', {
    next: { revalidate: 60 * 60 }, // 1h — dados compartilhados, mudam pouco
  })
  const products = await response.json()
  return <ProductList products={products} />
}
```

## Heuristics

| Situacao | Estrategia |
|----------|-----------|
| Mesmo fetch 2x na mesma pagina | Nao faca nada — React memoiza automaticamente |
| Dados compartilhados entre usuarios | `next: { revalidate: N }` com N baseado no dominio |
| Dados personalizados por usuario | `cache: 'no-store'` |
| Dados que so mudam no deploy | `cache: 'force-cache'` |
| Duvida sobre qual usar | Comece com `revalidate` e ajuste |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Fetch sem nenhuma opcao de cache | Defina `cache` ou `next.revalidate` explicitamente |
| `no-store` em dados compartilhados estaveis | `next: { revalidate: 3600 }` |
| `force-cache` em dados personalizados | `cache: 'no-store'` |
| `revalidate: 1` achando que e "tempo real" | `cache: 'no-store'` para tempo real de verdade |
| Memoization manual com Map/cache em Server Components | Confie na deduplicacao automatica do React |

## Troubleshooting

### Dados cacheados nao atualizam apos mutacao
**Symptom:** Apos criar/editar/deletar, a listagem mostra dados antigos
**Cause:** Cache do Next.js serve a versao antiga da pagina
**Fix:** Usar `revalidatePath('/caminho')` ou `revalidateTag('tag')` na server action apos a mutacao. Verificar que o path passado corresponde exatamente a rota da listagem

### fetch retorna dados stale em producao
**Symptom:** Dados frescos em desenvolvimento mas desatualizados em producao
**Cause:** Em producao, Next.js aplica cache agressivo por padrao em fetch requests
**Fix:** Adicionar `{ cache: 'no-store' }` ao fetch para desabilitar cache, ou usar `{ next: { revalidate: N } }` para ISR

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-cache-e-memoizacao/references/deep-explanation.md) — O instrutor Diego faz uma distincao fundamental:
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-cache-e-memoizacao/references/code-examples.md) — // app/(store)/(home)/page.tsx
