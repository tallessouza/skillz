---
name: rs-nextjs-app-router-rotas-e-layouts
description: "Enforces Next.js App Router file-based routing and layout conventions when creating routes, pages, or layouts. Use when user asks to 'create a route', 'add a page', 'create a layout', 'setup Next.js routing', or 'add a new section to the app'. Applies conventions: page.tsx for routes, folder nesting for URL segments, layout.tsx for shared wrappers, root layout never deleted. Make sure to use this skill whenever scaffolding Next.js App Router pages or layouts. Not for API routes, middleware, or Pages Router projects."
---

# Rotas e Layouts no Next.js App Router

> Cada arquivo `page.tsx` dentro de uma pasta em `app/` gera automaticamente uma rota, e cada `layout.tsx` envolve todas as paginas daquela pasta e subpastas.

## Rules

1. **Roteamento e baseado em pastas** — crie uma pasta com o nome da rota e dentro dela um `page.tsx`, porque o Next usa o nome das pastas como segmentos da URL
2. **Nunca delete o root layout** — o `app/layout.tsx` e obrigatorio e envolve toda a aplicacao, porque sem ele o Next nao renderiza
3. **Layouts recebem `children`** — todo `layout.tsx` deve receber e renderizar `children`, porque e ali que o conteudo da pagina sera injetado
4. **Layouts sao herdados por subpastas** — um `layout.tsx` dentro de `app/admin/` afeta `app/admin/page.tsx` e `app/admin/login/page.tsx`, porque o Next encadeia layouts hierarquicamente
5. **Rotas aninhadas = pastas aninhadas** — `app/catalog/product/page.tsx` gera `/catalog/product`, porque cada pasta adiciona um segmento na URL
6. **Compartilhe UI via layout, nao duplicando codigo** — se algo aparece em todas as paginas de uma secao, coloque no `layout.tsx` daquela pasta, porque evita duplicacao e garante consistencia

## How to write

### Nova rota simples

```
app/
└── catalog/
    └── page.tsx       → gera /catalog
```

```tsx
// app/catalog/page.tsx
export default function Catalog() {
  return <h1>Catálogo</h1>
}
```

### Rota aninhada

```
app/
└── catalog/
    ├── page.tsx           → /catalog
    └── product/
        └── page.tsx       → /catalog/product
```

### Layout especifico para uma secao

```
app/
└── admin/
    ├── layout.tsx         → envolve todas as paginas de /admin/*
    ├── page.tsx           → /admin
    └── login/
        └── page.tsx       → /admin/login (herda o layout do admin)
```

```tsx
// app/admin/layout.tsx
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <p>Painel de administração</p>
    </div>
  )
}
```

## Example

**Before (estrutura plana sem convencoes):**
```
app/
├── page.tsx
├── catalog.tsx          ← ERRADO: nao gera rota
└── admin-login.tsx      ← ERRADO: nao gera rota
```

**After (com convencoes do App Router):**
```
app/
├── layout.tsx              ← root layout (nunca deletar)
├── page.tsx                ← /
├── catalog/
│   ├── page.tsx            ← /catalog
│   └── product/
│       └── page.tsx        ← /catalog/product
└── admin/
    ├── layout.tsx          ← layout compartilhado do admin
    ├── page.tsx            ← /admin
    └── login/
        └── page.tsx        ← /admin/login
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova pagina acessivel por URL | Crie pasta + `page.tsx` dentro dela |
| UI compartilhada em varias paginas de uma secao | Crie `layout.tsx` na pasta pai da secao |
| UI compartilhada em TODAS as paginas | Coloque no `app/layout.tsx` (root layout) |
| Rota com multiplos segmentos (ex: `/catalog/product`) | Aninhe pastas: `catalog/product/page.tsx` |
| Secao com layout proprio (admin, auth, dashboard) | Crie pasta da secao com seu proprio `layout.tsx` |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Criar arquivo solto `catalog.tsx` em `app/` | Criar `app/catalog/page.tsx` |
| Deletar `app/layout.tsx` | Manter sempre o root layout |
| Duplicar header/footer em cada `page.tsx` | Colocar no `layout.tsx` da secao ou no root |
| Layout sem renderizar `children` | Sempre usar `{children}` no JSX do layout |
| Colocar layout dentro de `page.tsx` | Separar em `layout.tsx` na mesma pasta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-rotas-e-layouts-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-rotas-e-layouts-mkv-mp-4/references/code-examples.md)
