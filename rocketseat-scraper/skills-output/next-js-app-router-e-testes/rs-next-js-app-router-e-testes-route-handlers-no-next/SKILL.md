---
name: rs-nextjs-app-router-route-handlers
description: "Applies Next.js Route Handler patterns when creating API routes inside the app directory. Use when user asks to 'create an API route', 'add a route handler', 'build a BFF endpoint', 'return JSON from Next.js', or 'add server-side API to Next app'. Enforces route.ts conventions, Response.json() usage, and BFF-over-full-API philosophy. Make sure to use this skill whenever generating Next.js API routes or discussing backend-for-frontend patterns. Not for Express/Fastify standalone APIs, middleware, or Server Actions."
---

# Route Handlers no Next.js

> Criar rotas de API dentro do App Router usando arquivos `route.ts`, priorizando o padrao Backend for Frontend (BFF) em vez de APIs completas.

## Rules

1. **Use `route.ts` como convencao** — o arquivo deve se chamar exatamente `route.ts` (nao `api.ts`, nao `handler.ts`), porque o App Router reconhece apenas essa convencao
2. **Exporte funcoes nomeadas pelo metodo HTTP** — `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, porque o Next.js mapeia o nome da funcao exportada ao metodo HTTP correspondente
3. **Retorne sempre `Response.json()`** — nunca retorne valores primitivos diretamente, porque o Route Handler exige um objeto `Response` valido
4. **Organize rotas dentro de `app/api/`** — a convencao e criar uma pasta `api` na raiz do app directory, porque separa visualmente rotas de API de paginas
5. **Use Route Handlers para BFF, nao para APIs completas** — funcionalidades como login social, troca de tokens, e dados especificos do frontend pertencem aqui; APIs de dominio completo pertencem a um backend separado, porque acoplar backend ao frontend e um anti-padrao ja superado pela industria
6. **Estruture subpastas para subrotas** — `app/api/products/route.ts` para `/api/products`, `app/api/products/featured/route.ts` para `/api/products/featured`, porque o filesystem define o roteamento

## How to write

### Route Handler basico (GET)

```typescript
// app/api/products/route.ts
import data from '../data.json'

export async function GET() {
  return Response.json(data.products)
}
```

### Subrota com filtragem

```typescript
// app/api/products/featured/route.ts
import data from '../../data.json'

export async function GET() {
  const featuredProducts = data.products.filter(
    (product) => product.featured
  )
  return Response.json(featuredProducts)
}
```

### Route Handler com POST

```typescript
// app/api/products/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  // processar body
  return Response.json({ created: true }, { status: 201 })
}
```

## Example

**Before (erro comum — retorno primitivo):**
```typescript
export async function GET() {
  return 'Hello World' // ERRO: nao e um Response valido
}
```

**After (com esta skill aplicada):**
```typescript
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de login social (Google, GitHub) | Route Handler — envolve troca de tokens com credenciais sensiveis |
| Precisa de endpoint de busca para o frontend | Route Handler — dados especificos desta UI |
| Precisa de CRUD completo de dominio | Backend separado (Express, Fastify, Nest) |
| Precisa retornar dados para testes | Route Handler — simula API para desenvolvimento |
| Precisa de webhook de pagamento | Depende — se processa apenas para este frontend, Route Handler; se compartilhado, backend separado |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Retornar valor primitivo no handler | `return Response.json({ ... })` |
| Criar arquivo `api.ts` ou `handler.ts` | Criar `route.ts` (unica convencao reconhecida) |
| Construir API REST completa em Route Handlers | Separar backend em servico dedicado |
| Colocar `route.ts` na raiz do `app/` | Criar dentro de `app/api/` por convencao |
| Exportar funcao com nome customizado | Exportar com nome do metodo HTTP: `GET`, `POST`, etc |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
