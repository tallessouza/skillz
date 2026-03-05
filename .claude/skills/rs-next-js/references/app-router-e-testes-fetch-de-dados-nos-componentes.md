---
name: rs-nextjs-app-router-fetch-dados-componentes
description: "Applies Server Component data fetching patterns when writing Next.js App Router code. Use when user asks to 'fetch data', 'load API data', 'create a page with data', 'server component', 'SSR data loading', or builds any Next.js page that needs initial data. Enforces async component patterns, server-side fetch, and SEO-aware data loading. Make sure to use this skill whenever generating Next.js App Router components that need data. Not for client-side interactions, event handlers, or useEffect-based fetching."
---

# Fetch de Dados nos Server Components

> Em Next.js App Router, carregue dados iniciais diretamente no componente async do servidor — o HTML so chega ao usuario depois que os dados estao prontos.

## Rules

1. **Componentes que precisam de dados iniciais sao async** — use `async function` no componente e `await` no fetch, porque o servidor aguarda a resolucao antes de enviar o HTML
2. **Fetch acontece no servidor, nao no browser** — a requisicao HTTP parte do servidor Node do Next, porque isso garante que o HTML ja chega com dados pre-populados
3. **Use apenas para dados iniciais** — dados que precisam estar disponiveis assim que o componente aparece em tela, porque dados carregados por acao do usuario (clique, submit) usam outra estrategia
4. **Dados pre-populados melhoram SEO** — mecanismos de busca recebem HTML com dados ja renderizados, porque robos nao aguardam JavaScript carregar dados async no client
5. **Cuidado com o tempo de resposta** — todo `await` no componente atrasa a entrega do HTML ao usuario, porque o servidor so responde depois que todas as operacoes async finalizam

## How to write

### Componente async com fetch

```typescript
// app/page.tsx — Server Component (padrao no App Router)
export default async function Home() {
  const response = await fetch('https://api.example.com/products')
  const products = await response.json()

  return (
    <main>
      <h1>Produtos</h1>
      {products.map((product: any) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </main>
  )
}
```

### Multiplos fetches no mesmo componente

```typescript
export default async function Dashboard() {
  const [usersRes, ordersRes] = await Promise.all([
    fetch('https://api.example.com/users'),
    fetch('https://api.example.com/orders'),
  ])

  const users = await usersRes.json()
  const orders = await ordersRes.json()

  return (
    <main>
      <section>{users.length} usuarios</section>
      <section>{orders.length} pedidos</section>
    </main>
  )
}
```

## Example

**Before (SPA tradicional — dados carregados no client):**
```typescript
'use client'
import { useEffect, useState } from 'react'

export default function UserProfile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('https://api.github.com/users/diego3g')
      .then(res => res.json())
      .then(setUser)
  }, [])

  if (!user) return <p>Carregando...</p>

  return <pre>{JSON.stringify(user, null, 2)}</pre>
}
```

**After (Server Component — dados ja no HTML):**
```typescript
export default async function UserProfile() {
  const response = await fetch('https://api.github.com/users/diego3g')
  const user = await response.json()

  return <pre>{JSON.stringify(user, null, 2)}</pre>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados precisam estar visiveis no primeiro render | Server Component async com await fetch |
| Dados carregam apos acao do usuario (clique, scroll) | Client Component com useEffect ou event handler |
| Pagina precisa de SEO | Server Component — HTML ja vem com dados |
| Multiplas chamadas independentes | `Promise.all` para paralelizar e reduzir tempo total |
| Fetch demora muito e trava a pagina | Investigue Suspense/streaming (proximo passo) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `'use client'` + `useEffect` para dados iniciais | Server Component async com fetch direto |
| Spinner como unica estrategia de loading | Dados pre-populados no servidor + Suspense para fallback |
| Fetch no client para dados que SEO precisa indexar | Fetch no servidor — HTML ja chega pronto |
| Varios `await` sequenciais independentes | `Promise.all([fetch1, fetch2])` para paralelizar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-fetch-de-dados-nos-componentes/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-fetch-de-dados-nos-componentes/references/code-examples.md)
