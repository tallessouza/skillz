---
name: rs-next-js-roteamento-e-layouts
description: "Enforces Next.js App Router routing and layout patterns when structuring pages, creating route groups, or organizing components. Use when user asks to 'create a page', 'add a route', 'organize layouts', 'group routes', or 'structure a Next.js app'. Applies rules: route groups with parentheses, nested layouts, component placement (app/ vs components/), special file conventions. Make sure to use this skill whenever scaffolding Next.js App Router projects or adding new routes. Not for Pages Router, API routes, or server actions."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-routing-layouts
  tags: [next-js, app-router, routing, layouts, route-groups, nested-layouts, page-tsx, layout-tsx]
---

# Roteamento e Layouts no Next.js App Router

> Estruture rotas por pastas, layouts por encadeamento, e use route groups para organizar sem poluir a URL.

## Rules

1. **Somente arquivos especiais viram rotas** — `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` tem funcionalidade no App Router; qualquer outro arquivo dentro de `app/` e ignorado pelo roteador, porque o Next so reconhece nomes reservados
2. **Componentes reutilizaveis ficam em `components/`** — componentes usados em multiplas paginas vivem em `components/`; componentes especificos de um contexto de paginas podem ficar dentro de `app/`, porque o Next ignora arquivos que nao sao especiais
3. **Use route groups `(nome)` para agrupar sem afetar URL** — pastas com parenteses como `(dashboard)` ou `(auth)` agrupam rotas e permitem layouts distintos sem adicionar segmentos na URL, porque o Next remove parenteses do path
4. **Layouts encadeiam automaticamente** — cada `layout.tsx` em uma subpasta envolve todos os `page.tsx` e sub-layouts abaixo; use isso para adicionar headers, sidebars, providers por contexto, porque o Next compoe layouts de fora para dentro
5. **Layout root para providers globais** — `app/layout.tsx` e o unico lugar para providers que toda a aplicacao precisa (auth, React Query, theme), porque ele envolve todas as rotas
6. **Nao coloque tudo no layout root** — distribua responsabilidades de layout entre subpastas; cada grupo de rotas pode ter seu proprio layout, porque isso evita re-renders desnecessarios e mantem separacao de contextos

## How to write

### Estrutura de pastas com route groups

```
app/
├── layout.tsx              # Layout root (providers globais)
├── (auth)/
│   ├── layout.tsx          # Layout sem sidebar, minimalista
│   ├── sign-in/
│   │   └── page.tsx        # URL: /sign-in
│   └── sign-up/
│       └── page.tsx        # URL: /sign-up
├── (dashboard)/
│   ├── layout.tsx          # Layout com sidebar e header
│   ├── page.tsx            # URL: /
│   └── users/
│       └── page.tsx        # URL: /users
```

### Layout com children

```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header>Header do dashboard</header>
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  )
}
```

### Pagina simples

```tsx
// app/(dashboard)/users/page.tsx
export default function UsersPage() {
  return <h1>Lista de usuarios</h1>
}
```

## Example

**Before (tudo no layout root, sem agrupamento):**
```
app/
├── layout.tsx      # Header + Sidebar + Providers tudo aqui
├── sign-in/
│   └── page.tsx    # URL: /sign-in (tem sidebar desnecessaria)
├── dashboard/
│   └── page.tsx    # URL: /dashboard (dashboard na URL)
└── users/
    └── page.tsx    # URL: /users
```

**After (route groups com layouts separados):**
```
app/
├── layout.tsx          # Somente providers globais
├── (auth)/
│   ├── layout.tsx      # Layout limpo, sem sidebar
│   └── sign-in/
│       └── page.tsx    # URL: /sign-in
├── (dashboard)/
│   ├── layout.tsx      # Header + Sidebar
│   ├── page.tsx        # URL: /
│   └── users/
│       └── page.tsx    # URL: /users
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente usado em 3+ paginas | Colocar em `components/` |
| Componente usado so em paginas de um grupo | Colocar dentro do route group em `app/` |
| Rotas autenticadas vs publicas | Criar route groups `(auth)` e `(app)` com layouts distintos |
| Precisa de sidebar em algumas paginas | Layout no route group, nao no root |
| Provider global (auth, theme) | `app/layout.tsx` |
| Pasta so para organizar, sem afetar URL | Usar parenteses: `(nome)` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `app/dashboard/users/page.tsx` quando dashboard e so agrupamento | `app/(dashboard)/users/page.tsx` |
| Header + Sidebar + Providers tudo em `app/layout.tsx` | Distribuir layouts por route groups |
| Componente reutilizavel dentro de `app/(dashboard)/` | Mover para `components/` |
| Criar pasta `pages/` no App Router | Usar `app/` com `page.tsx` |
| Layout vazio so para ter a pasta | Remover layout se nao adiciona nada |

## Troubleshooting

### Pagina 404 ao navegar para rota existente
**Symptom:** Rota existe no codigo mas retorna 404
**Cause:** Arquivo nao esta na estrutura correta do App Router (`app/{rota}/page.tsx`) ou Pages Router (`pages/{rota}.tsx`)
**Fix:** Verificar que o arquivo se chama exatamente `page.tsx` (App Router) ou que o export default existe (Pages Router). Reiniciar o servidor de desenvolvimento

### Layout nao aplica na rota filha
**Symptom:** Layout do diretorio pai nao envolve a pagina filha
**Cause:** Arquivo `layout.tsx` ausente ou nao retorna `{children}` no JSX
**Fix:** Garantir que o layout recebe e renderiza `children` como prop. Verificar que o layout esta no nivel correto da hierarquia de pastas

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-roteamento-e-layouts-no-next-js/references/deep-explanation.md) — No antigo Pages Router, cada arquivo dentro de `pages/` automaticamente virava uma rota. Isso signif
- [code-examples.md](../../../data/skills/next-js/rs-next-js-roteamento-e-layouts-no-next-js/references/code-examples.md) — app/
