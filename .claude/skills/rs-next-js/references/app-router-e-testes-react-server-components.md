---
name: rs-nextjs-app-router-react-server-components
description: "Enforces correct usage of React Server Components and Client Components in Next.js App Router. Use when user asks to 'create a component', 'add interactivity', 'use onClick', 'add useState', 'build a page in Next.js', or any Next.js component work. Applies rules: default to Server Component, use 'use client' only when interactivity needed, understand hydration process, never send unnecessary JS to browser. Make sure to use this skill whenever writing Next.js App Router components. Not for Pages Router, API routes, or non-Next.js React projects."

metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [next-js, react-server-components, client-components, use-client, hydration, performance]
---

# React Server Components no Next.js App Router

> Todo componente no Next.js App Router e Server Component por padrao — so adicione 'use client' quando interatividade com o usuario for necessaria.

## Rules

1. **Server Component e o padrao** — todo componente sem `'use client'` e um Server Component, porque o Next.js cria o HTML no servidor Node e envia apenas HTML puro ao navegador, sem JavaScript associado
2. **Use Client Component apenas para interatividade** — so adicione `'use client'` quando o componente precisa ouvir eventos (`onClick`, `onChange`), usar hooks de estado (`useState`, `useReducer`), ou hooks de efeito (`useEffect`), porque JavaScript desnecessario no navegador prejudica performance
3. **Client Component tambem renderiza no servidor primeiro** — declarar `'use client'` NAO significa que o componente deixa de ser criado no servidor; o HTML inicial e gerado no Node, depois hidratado com JavaScript no navegador
4. **console.log em Server Component aparece no terminal Node** — nunca no navegador, porque o codigo executa apenas no servidor
5. **console.log em Client Component aparece em ambos** — no Node (render inicial) e no navegador (apos hidratacao), porque o componente e criado duas vezes
6. **Hidratacao e o processo de tornar HTML interativo** — o Next envia HTML seco e depois adiciona JavaScript apenas nos Client Components, convertendo HTML estatico em HTML interativo

## How to write

### Server Component (padrao — sem diretiva)

```typescript
// Nenhuma diretiva necessaria — Server Component por padrao
// console.log aparece APENAS no terminal do Node
export default function ProductPage({ params }: { params: { slug: string } }) {
  console.log(params) // aparece no terminal, NAO no navegador

  return (
    <div>
      <h1>Produto: {params.slug}</h1>
      <p>Conteudo estatico renderizado no servidor</p>
    </div>
  )
}
```

### Client Component (apenas quando precisa de interatividade)

```typescript
'use client'

// Agora este componente sera hidratado no navegador
export function AddToCartButton() {
  function handleAddToCart() {
    console.log('adicionou ao carrinho') // aparece no navegador
  }

  return (
    <button onClick={handleAddToCart}>
      Adicionar ao carrinho
    </button>
  )
}
```

### Composicao correta — isolar interatividade

```typescript
// page.tsx — Server Component (padrao)
import { AddToCartButton } from './add-to-cart-button'

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Produto: {params.slug}</h1>
      <p>Descricao do produto</p>
      {/* Apenas o botao envia JavaScript ao navegador */}
      <AddToCartButton />
    </div>
  )
}
```

## Example

**Before (erro comum — tudo como Client Component):**

```typescript
'use client' // ERRADO: pagina inteira como Client Component

export default function ProductPage({ params }) {
  return (
    <div>
      <h1>{params.slug}</h1>
      <p>Descricao estatica que nao precisa de JS</p>
      <button onClick={() => console.log('add')}>Comprar</button>
    </div>
  )
}
```

**After (com esta skill aplicada):**

```typescript
// page.tsx — Server Component (padrao, sem 'use client')
import { BuyButton } from './buy-button'

export default function ProductPage({ params }) {
  return (
    <div>
      <h1>{params.slug}</h1>
      <p>Descricao estatica que nao precisa de JS</p>
      <BuyButton />
    </div>
  )
}
```

```typescript
// buy-button.tsx — Client Component (apenas o necessario)
'use client'

export function BuyButton() {
  return <button onClick={() => console.log('add')}>Comprar</button>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente so exibe dados | Server Component (padrao) |
| Componente usa onClick, onChange, onSubmit | Client Component (`'use client'`) |
| Componente usa useState, useEffect, useReducer | Client Component (`'use client'`) |
| Pagina com UM botao interativo | Extraia o botao como Client Component, mantenha a pagina como Server Component |
| console.log para debug no servidor | Use em Server Component, olhe o terminal Node |
| console.log para debug no navegador | Use em Client Component dentro de um event handler |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `'use client'` em toda pagina | Isole apenas o trecho interativo como Client Component |
| Achar que Client Component nao renderiza no servidor | Client Component renderiza no Node primeiro, depois hidrata no navegador |
| Colocar event handler em Server Component | Extraia para um Client Component separado |
| Enviar pagina inteira como Client Component por causa de um botao | Componha: Server Component pai + Client Component filho isolado |
| Esperar console.log de Server Component no navegador | Olhe o terminal onde `npm run dev` esta rodando |

## Troubleshooting

### Erro ao usar hooks em Server Component
**Symptom:** Erro "useState/useEffect is not a function" ou "Hooks can only be called inside a Client Component"
**Cause:** Tentativa de usar hooks React (useState, useEffect, useSession) em um componente sem a diretiva "use client"
**Fix:** Adicionar `"use client"` no topo do arquivo OU extrair a parte interativa para um componente-folha separado com "use client"

### Server Component nao consegue ser async apos adicionar "use client"
**Symptom:** Erro ao usar `async function Component()` com `"use client"`
**Cause:** Client Components nao suportam async/await — essa e uma restricao fundamental do React
**Fix:** Remover "use client" e usar async/await direto (Server Component), ou manter "use client" e buscar dados via hooks (useEffect, React Query)

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-react-server-components/references/deep-explanation.md) — Quando o usuario acessa qualquer pagina de uma aplicacao Next.js (App Router), o que acontece e:
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-react-server-components/references/code-examples.md) — // app/catalog/product/[...data]/page.tsx — Server Component (padrao)
