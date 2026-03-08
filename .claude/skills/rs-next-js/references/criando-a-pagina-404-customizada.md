---
name: rs-next-js-pagina-404-customizada
description: "Generates custom 404 Not Found pages in Next.js App Router projects. Use when user asks to 'create a 404 page', 'handle not found', 'custom error page', 'page not found', or 'not-found page in Next.js'. Applies App Router not-found.tsx convention, UX patterns like auto-focus search, and useRef/useEffect for usability. Make sure to use this skill whenever building error pages in Next.js App Router. Not for API error handling, server error pages (500), or Pages Router 404."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: error-pages
  tags: [next-js, 404, not-found, app-router, error-page, useRef, useEffect, UX]
---

# Pagina 404 Customizada no Next.js App Router

> Crie paginas 404 funcionais e com boa usabilidade usando a convencao `not-found.tsx` do App Router.

## Rules

1. **Use `not-found.tsx` na pasta `app/`** — `app/not-found.tsx` com `export default` e o componente, porque essa e a convencao do App Router para paginas 404
2. **Forneca navegacao util** — sempre inclua botao para home e busca, porque o usuario precisa de saida da pagina de erro
3. **Auto-focus no campo de busca via query param** — use `?search` na URL + `useRef` + `useEffect` para dar foco automatico no input, porque reduz friccao do usuario perdido
4. **Componente de busca usa `useSearchParams().has()`** — para detectar presenca do parametro e acionar o foco, porque e a forma idiomatica no App Router
5. **Estilize com proposito** — centralize o conteudo com flex, use icones descritivos e hierarquia visual clara, porque 404 e um ponto de recuperacao, nao um beco sem saida
6. **Funciona tanto em `app/` quanto em `pages/`** — mas a convencao e diferente em cada um; no App Router use `not-found.tsx`, no Pages Router use `pages/404.tsx`

## How to write

### Arquivo not-found.tsx

```typescript
// app/not-found.tsx
import Link from "next/link";
import { FileQuestion, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-16">
      <div className="flex flex-col items-center">
        <FileQuestion size={64} className="text-gray-500 mx-auto mb-6" />

        <div className="relative">
          <span className="text-8xl font-bold font-sans inline-block m-3 transform rotate-12 translate-y-2 -translate-x-1">4</span>
          <span className="text-8xl font-bold font-sans inline-block m-3">0</span>
          <span className="text-8xl font-bold font-sans inline-block m-3">4</span>
        </div>

        <p className="text-gray-500 mb-8">Pagina nao encontrada</p>

        <div className="flex justify-center gap-4 mt-6">
          <Link href="/">
            <Button variant="primary">Home</Button>
          </Link>
          <Link href="/blog?search">
            <Button variant="secondary">
              <Search size={16} /> Pesquisar Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Auto-focus no componente de busca

```typescript
"use client";
import { useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function SearchInput() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const hasQuery = !!searchParams.has("search");

  useEffect(() => {
    if (hasQuery) {
      inputRef.current?.focus();
    }
  }, [hasQuery]);

  return <input ref={inputRef} placeholder="Buscar..." />;
}
```

## Example

**Before (404 padrao do Next.js):**
```
// Nenhum arquivo not-found.tsx
// Usuario ve pagina generica "404 | This page could not be found"
// Sem navegacao, sem ajuda
```

**After (com esta skill):**
```typescript
// app/not-found.tsx com:
// - Icone visual (FileQuestion)
// - "404" estilizado com rotacao
// - Botao Home + Botao Pesquisar Posts
// - Link /blog?search que aciona auto-focus no input de busca
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto tem busca/search | Adicione botao de pesquisa no 404 com `?search` para auto-focus |
| Projeto simples sem busca | Botao Home + botao para pagina principal de conteudo |
| 404 especifico de rota | Crie `not-found.tsx` dentro da pasta da rota (ex: `app/blog/not-found.tsx`) |
| Precisa redirecionar programaticamente | Use `notFound()` de `next/navigation` dentro de Server Components |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deixar 404 padrao sem customizar | Crie `app/not-found.tsx` com navegacao util |
| Redirecionar automaticamente sem mostrar 404 | Mostre a pagina 404 com opcoes claras de navegacao |
| Usar `pages/404.tsx` no App Router | Use `app/not-found.tsx` |
| Criar 404 sem nenhum link de saida | Sempre forneca Home + pelo menos um link contextual |
| Usar `document.getElementById` para focus | Use `useRef` + `useEffect` |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-a-pagina-404-customizada/references/deep-explanation.md) — No App Router do Next.js, a pagina 404 e criada com o arquivo `not-found.tsx` na pasta `app/`. Basta
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-a-pagina-404-customizada/references/code-examples.md) — // app/not-found.tsx
