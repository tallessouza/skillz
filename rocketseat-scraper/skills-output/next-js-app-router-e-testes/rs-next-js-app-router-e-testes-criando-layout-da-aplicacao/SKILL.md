---
name: rs-nextjs-app-router-layout-structure
description: "Enforces Next.js App Router layout and route group patterns when structuring applications. Use when user asks to 'create a layout', 'organize routes', 'add loading states', 'structure next.js app', or 'create route groups'. Applies rules: parenthesized route groups for logical grouping without URL impact, separate layouts per route group, isolated loading.tsx per route segment. Make sure to use this skill whenever scaffolding or restructuring a Next.js App Router project. Not for API routes, middleware, or server actions."
---

# Estrutura de Layout no Next.js App Router

> Organize rotas em grupos com parenteses para isolar layouts e loading states sem afetar a URL.

## Rules

1. **Use route groups com parenteses para agrupar rotas** — `(store)`, `(auth)`, `(admin)`, porque parenteses nao adicionam segmentos na URL e permitem layouts independentes por grupo
2. **Nunca coloque layout especifico no layout raiz** — o `app/layout.tsx` raiz aplica a TODAS as paginas; estruturas como header/footer de loja vao no layout do route group, porque paginas como login nao devem herdar o header da loja
3. **Isole loading.tsx por rota usando route groups** — crie `(home)/loading.tsx` e `(home)/page.tsx` juntos, porque um loading.tsx solto numa pasta afeta TODAS as subrotas daquela pasta
4. **Mantenha um padrao de casing consistente** — se arquivos do App Router usam lowercase (`page.tsx`, `layout.tsx`), use lowercase para todos os componentes tambem (`header.tsx`), porque consistencia dentro do projeto importa mais que preferencia pessoal
5. **Layout e nada mais que um componente que recebe children** — retorne `children` envolto na estrutura desejada, sem logica complexa no layout

## How to write

### Route group structure

```
app/
├── layout.tsx              # Layout RAIZ (minimo, aplica a tudo)
├── (store)/
│   ├── layout.tsx          # Layout da loja (header, nav)
│   ├── (home)/
│   │   ├── page.tsx        # Home (localhost:3000)
│   │   └── loading.tsx     # Loading APENAS da home
│   └── search/
│       ├── page.tsx        # Search (localhost:3000/search)
│       └── loading.tsx     # Loading APENAS do search
└── (auth)/
    ├── layout.tsx          # Layout de auth (sem header da loja)
    └── login/
        └── page.tsx
```

### Layout de route group

```typescript
import { ReactNode } from 'react'
import { Header } from '@/components/header'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}
```

### Loading isolado por rota

```typescript
// app/(store)/(home)/loading.tsx
export default function HomeLoading() {
  return <p>Carregando home...</p>
}

// app/(store)/search/loading.tsx
export default function SearchLoading() {
  return <p>Carregando busca...</p>
}
```

## Example

**Before (loading vaza para outras rotas):**
```
app/
├── layout.tsx
├── page.tsx          # Home
├── loading.tsx       # Afeta home E search!
└── search/
    └── page.tsx
```

**After (loading isolado com route groups):**
```
app/
├── layout.tsx
└── (store)/
    ├── layout.tsx
    ├── (home)/
    │   ├── page.tsx
    │   └── loading.tsx   # So afeta home
    └── search/
        ├── page.tsx
        └── loading.tsx   # So afeta search
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Todas as paginas compartilham header | Crie layout no route group, nao no raiz |
| Pagina de login/auth sem header | Crie route group `(auth)` com layout proprio |
| Loading generico (spinner) para todas as paginas | Um loading.tsx no route group basta |
| Loading diferente por pagina (skeleton) | Isole cada page em sub-route-group com seu loading |
| Pasta com parenteses | Lembre: nao afeta URL, so agrupa arquivos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Header no `app/layout.tsx` raiz | Header no `app/(store)/layout.tsx` |
| `loading.tsx` solto na raiz do route group | `loading.tsx` dentro de sub-route-group junto da page |
| `app/store/page.tsx` (sem parenteses) | `app/(store)/(home)/page.tsx` (com parenteses) |
| Logica de dados no layout | Logica de dados na page, layout so estrutura |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
