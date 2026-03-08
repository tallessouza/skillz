---
name: rs-full-stack-criando-a-rota-de-refund
description: "Enforces React Router route group separation pattern when creating new page routes, organizing route files by user role, or structuring multi-layout navigation. Use when user asks to 'create a new page', 'add a route', 'separate routes by role', 'organize navigation', or 'set up employee routes'. Applies pattern: one route file per user role/context, wildcard catch-all for NotFound, manual-then-dynamic route switching. Make sure to use this skill whenever adding new route groups to a React Router app. Not for API routes, server-side routing, or Next.js App Router."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-routing
  tags: [react, react-router, routes, navigation, role-based]
---

# Criando Rotas Separadas por Contexto no React Router

> Organize rotas em arquivos separados por contexto de usuário (auth, employee, admin), cada um com seu próprio catch-all para NotFound.

## Rules

1. **Um arquivo de rotas por contexto** — `auth-routes.tsx`, `employ-routes.tsx`, `admin-routes.tsx`, porque facilita trocar o grupo inteiro de rotas baseado no perfil do usuário
2. **Toda página nova começa com estrutura mínima** — componente funcional exportado com conteúdo placeholder, porque permite testar a rota antes de construir a interface
3. **Sempre inclua rota wildcard `*` para NotFound** — em cada grupo de rotas, porque o usuário pode acessar URLs inexistentes em qualquer contexto
4. **Troque rotas manualmente primeiro, dinamize depois** — renderize o grupo correto no index antes de implementar lógica de auth, porque foca na construção das interfaces sem complexidade prematura

## Steps

### Step 1: Criar a página

Crie o arquivo do componente em `src/pages/`.

```tsx
// src/pages/refund.tsx
export function Refund() {
  return <h1>Refund</h1>
}
```

### Step 2: Criar o arquivo de rotas do contexto

Crie um arquivo de rotas dedicado em `src/routes/`.

```tsx
// src/routes/employ-routes.tsx
import { Routes, Route } from "react-router-dom"

import { Refund } from "../pages/refund"
import { NotFound } from "../pages/not-found"

export function EmployRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Refund />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

### Step 3: Renderizar o grupo de rotas no index

Substitua o grupo de rotas ativo no ponto de entrada.

```tsx
// src/routes/index.tsx
import { EmployRoutes } from "./employ-routes"

// Por enquanto, troca manual — depois será dinâmico
// baseado no status de login e perfil do usuário
export function AppRoutes() {
  return <EmployRoutes />
}
```

## Output format

```
src/
├── pages/
│   └── refund.tsx          # Nova página
├── routes/
│   ├── auth-routes.tsx     # Rotas de autenticação (existente)
│   ├── employ-routes.tsx   # Rotas do funcionário (novo)
│   └── index.tsx           # Ponto de entrada que escolhe o grupo
```

## Heuristics

| Situação | Faça |
|----------|------|
| Novo perfil de usuário (admin, manager) | Crie novo arquivo `{perfil}-routes.tsx` |
| Página ainda não tem interface | Exporte componente com h1 placeholder |
| Precisa testar rota rapidamente | Troque manualmente no index, sem lógica de auth |
| Rota não existe no grupo | Wildcard `*` redireciona para NotFound |

## Anti-patterns

| Nunca faça | Faça isso |
|------------|-----------|
| Todas as rotas num único arquivo | Um arquivo de rotas por contexto de usuário |
| Grupo de rotas sem catch-all `*` | Sempre inclua `<Route path="*" element={<NotFound />} />` |
| Implementar lógica de auth antes das páginas | Primeiro construa as interfaces, depois dinamize as rotas |
| Página nova com toda a lógica de uma vez | Comece com estrutura mínima, itere depois |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Pagina mostra branco ao acessar rota | Componente da rota nao esta exportado ou importado corretamente | Verifique que o componente usa `export function` e o import no arquivo de rotas esta correto |
| Wildcard `*` nao funciona | Falta `<Route path="*" element={<NotFound />} />` no grupo | Adicione a rota catch-all como ultimo `<Route>` dentro de `<Routes>` |
| Rota nova nao aparece | Grupo de rotas errado renderizado no index | Verifique qual grupo esta ativo em `routes/index.tsx` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de rotas por contexto e estrategia de dinamizacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes