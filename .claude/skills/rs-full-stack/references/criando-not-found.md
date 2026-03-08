---
name: rs-full-stack-criando-not-found
description: "Generates a styled 404 Not Found page with React Router catch-all route and Tailwind CSS centering. Use when user asks to 'create a 404 page', 'handle not found route', 'add catch-all route', 'page not found', or 'missing route handler'. Applies React Router wildcard path pattern with full-screen centered layout using Tailwind. Make sure to use this skill whenever setting up routing that needs a fallback for unknown paths. Not for API error handling, server-side 404 responses, or error boundaries."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-router
  tags: [react, react-router, 404, not-found, tailwind]
---

# Criando Página Not Found

> Toda aplicação com rotas deve ter uma página Not Found como catch-all para caminhos inexistentes, evitando tela em branco.

## Prerequisites

- React Router configurado com `<Routes>` e `<Route>`
- Tailwind CSS disponível no projeto

## Steps

### Step 1: Criar o componente NotFound

Criar arquivo `src/pages/NotFound.tsx`:

```tsx
export function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-gray-100 font-semibold text-2xl mb-10">
          Ops! Essa página não existe 😢
        </h1>
        <a
          href="/"
          className="font-semibold text-center text-green-100 hover:text-green-200 transition is-linear"
        >
          Voltar para o início
        </a>
      </div>
    </div>
  )
}
```

### Step 2: Registrar rota catch-all no router

Adicionar como **última rota** dentro de `<Routes>`, porque o React Router avalia as rotas em ordem:

```tsx
import { NotFound } from "./pages/NotFound"

<Routes>
  {/* ... todas as rotas existentes ... */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Output format

```
src/
├── pages/
│   └── NotFound.tsx    # Componente da página 404
└── routes.tsx          # Route path="*" como última rota
```

## Heuristics

| Situação | Ação |
|----------|------|
| Rota `path="*"` não é a última | Mover para o final, porque o React Router avalia em ordem sequencial |
| Precisa de layout consistente | Envolver o NotFound no mesmo layout das outras páginas |
| SPA com basename | O catch-all já funciona dentro do basename automaticamente |
| Emoji no conteúdo | Copiar diretamente no JSX — React renderiza emoji Unicode sem problemas |

## Anti-patterns

| Nunca faça | Faça isso |
|------------|-----------|
| Deixar tela em branco para rotas inexistentes | Criar página NotFound com catch-all `path="*"` |
| Colocar `path="*"` antes de outras rotas | Colocar `path="*"` sempre como última rota |
| Usar `window.location.href = "/"` para voltar | Usar `<a href="/">` ou `<Link to="/">` do React Router |
| Centralizar com margin/padding manual | Usar `flex justify-center items-center` com `w-screen h-screen` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre catch-all routes e centralização com Tailwind
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Pagina 404 nao aparece para rotas invalidas | `path="*"` nao e a ultima rota | Mova `<Route path="*">` para o final dentro de `<Routes>` |
| Tela em branco sem erro | Componente NotFound nao importado | Verifique o import e o path do arquivo |
| Conteudo nao centraliza na tela | Faltou `w-screen h-screen` no container | Adicione `className="w-screen h-screen flex justify-center items-center"` |
| 404 aparece em todas as rotas | `path="*"` esta antes das rotas validas | Reordene para que `path="*"` seja a ultima rota |
| Link "Voltar" recarrega a pagina inteira | Usando `<a href="/">` em SPA | Substitua por `<Link to="/">` do React Router |