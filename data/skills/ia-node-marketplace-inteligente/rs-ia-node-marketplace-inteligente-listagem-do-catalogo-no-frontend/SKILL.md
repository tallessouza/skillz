---
name: rs-ia-node-marketplace-listagem-catalogo-frontend
description: "Applies frontend catalog listing patterns using Axios, SWR, and Next.js when building product pages or integrating frontend with backend APIs. Use when user asks to 'list products', 'fetch catalog', 'integrate frontend with API', 'use SWR', or 'create product page with search'. Enforces Axios instance setup, SWR for state management, URL search params over React state for search, and CORS configuration. Make sure to use this skill whenever building e-commerce frontends or catalog UIs with Next.js. Not for backend API implementation, database queries, or cart/checkout logic."
---

# Listagem do Catalogo no Frontend

> Integrar frontend com backend usando Axios para requisicoes e SWR para gerenciamento de estado, mantendo o estado de pesquisa na URL ao inves do React state.

## Rules

1. **Crie uma instancia centralizada do Axios** — `axios.create({ baseURL })` em arquivo dedicado, porque evita repetir configuracao em cada requisicao
2. **Use SWR para buscar e cachear dados** — nunca useEffect + useState manual, porque SWR gerencia cache, revalidacao e estados de loading/error automaticamente
3. **Guarde estado de pesquisa em query parameters da URL** — `window.history.pushState` ao inves de `useState`, porque preserva o estado no navegador e permite compartilhar/voltar
4. **Habilite CORS no backend antes de integrar** — `app.enableCors()` no NestJS, porque o navegador bloqueia requisicoes cross-origin por padrao
5. **Divida valores monetarios por 100 no frontend** — precos armazenados como inteiros em centavos no banco, porque evita problemas de ponto flutuante
6. **Marque paginas com estado como `use client`** — SWR usa hooks do React, porque Next.js App Router assume server components por padrao

## How to write

### Instancia do Axios

```typescript
// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333",
});

export async function getCatalog(search?: string) {
  const { data } = await api.get<Product[]>("/catalog", {
    params: { search },
  });
  return data;
}
```

### Pagina de produtos com SWR e search params

```typescript
"use client";

import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { getCatalog } from "@/api";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const { data: products } = useSWR(
    ["catalog", search],
    () => getCatalog(search)
  );

  function handleSearch(value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("search", value);
    window.history.pushState({}, "", url);
  }

  return (
    <div>
      <input
        placeholder="Pesquisar produtos..."
        defaultValue={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {products?.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>R$ {(product.priceInCents / 100).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
```

### CORS no NestJS

```typescript
// main.ts
const app = await NestFactory.create(AppModule);
app.enableCors();
```

## Example

**Before (useState para pesquisa, fetch manual):**
```typescript
const [search, setSearch] = useState("");
const [products, setProducts] = useState([]);

useEffect(() => {
  fetch(`/api/catalog?search=${search}`)
    .then(res => res.json())
    .then(setProducts);
}, [search]);
```

**After (SWR + URL state):**
```typescript
const searchParams = useSearchParams();
const search = searchParams.get("search") ?? "";
const { data: products } = useSWR(["catalog", search], () => getCatalog(search));

function handleSearch(value: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("search", value);
  window.history.pushState({}, "", url);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estado que deve sobreviver a refresh da pagina | Query parameter na URL |
| Estado temporario de UI (modal aberto, hover) | useState normal |
| Dados do servidor que precisam de cache | SWR ou React Query |
| Requisicoes repetidas para mesma API | Instancia centralizada do Axios |
| Preco vindo do banco como inteiro | Dividir por 100 e formatar no frontend |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `useEffect` + `useState` para fetch | `useSWR` com funcao fetcher |
| `useState` para search que afeta URL | `useSearchParams` + `pushState` |
| `axios.get("http://localhost:3333/...")` direto | `api.get("/catalog")` via instancia |
| Ignorar CORS e debugar no console | `app.enableCors()` no backend |
| `fetch` sem tipagem | Axios com generics `api.get<Product[]>()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
