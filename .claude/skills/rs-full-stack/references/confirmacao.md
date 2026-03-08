---
name: rs-full-stack-confirmacao
description: "Enforces confirmation page pattern with route guard using React Router state when building post-submission flows. Use when user asks to 'create a confirmation page', 'redirect after form submit', 'protect a route from direct access', 'guard navigation state', or 'prevent direct URL access to a page'. Applies useNavigate with state, useLocation state check, and Navigate component redirect. Make sure to use this skill whenever implementing post-form-submission flows or route protection based on navigation origin. Not for authentication guards, role-based access control, or server-side redirects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-routing
  tags: [react-router, route-guard, useNavigate, useLocation, confirmation-page, navigation-state]
---

# Página de Confirmação com Guard de Rota

> Redirecione após submit passando estado na navegação e proteja a página de confirmação contra acesso direto via URL.

## Rules

1. **Passe estado na navegação após submit** — use `navigate('/confirm', { state: { fromSubmit: true } })`, porque isso marca a origem da navegação como legítima
2. **Verifique o estado na página de destino** — use `useLocation().state?.fromSubmit`, porque sem essa verificação qualquer usuário acessa a página digitando a URL
3. **Redirecione com o componente Navigate** — retorne `<Navigate to="/" />` antes do render principal, porque é a forma declarativa do React Router para redirecionamento
4. **Registre a rota no layout de rotas** — adicione a rota `/confirm` no mesmo grupo de rotas do formulário, porque rotas não registradas resultam em 404

## How to write

### Navegação com estado após submit

```tsx
import { useNavigate } from "react-router-dom"

function RefundPage() {
  const navigate = useNavigate()

  function onSubmit(data: FormData) {
    // processar dados...
    navigate("/confirm", { state: { fromSubmit: true } })
  }

  return <form onSubmit={handleSubmit(onSubmit)}>{/* campos */}</form>
}
```

### Guard na página de confirmação

```tsx
import { Navigate, useLocation } from "react-router-dom"

export function Confirm() {
  const location = useLocation()

  if (!location.state?.fromSubmit) {
    return <Navigate to="/" />
  }

  return <h1>Solicitação enviada</h1>
}
```

### Registro da rota

```tsx
// No arquivo de rotas
<Route path="/" element={<Layout />}>
  <Route path="refund" element={<Refund />} />
  <Route path="confirm" element={<Confirm />} />
</Route>
```

## Example

**Before (sem proteção — acesso direto permitido):**
```tsx
// Qualquer usuário digita /confirm na URL e vê a página
export function Confirm() {
  return <h1>Solicitação enviada</h1>
}

// No formulário, navegação sem estado
navigate("/confirm")
```

**After (com guard de estado):**
```tsx
// Página protegida — só acessível via submit
export function Confirm() {
  const location = useLocation()

  if (!location.state?.fromSubmit) {
    return <Navigate to="/" />
  }

  return <h1>Solicitação enviada</h1>
}

// No formulário, navegação com estado
navigate("/confirm", { state: { fromSubmit: true } })
```

## Heuristics

| Situação | Faça |
|----------|------|
| Página só deve ser acessada após ação do usuário | Passe estado via `navigate` e verifique com `useLocation` |
| Usuário acessa URL diretamente sem estado | Redirecione para a raiz com `<Navigate to="/" />` |
| Múltiplas origens legítimas para a mesma página | Adicione flags diferentes no estado (`fromSubmit`, `fromPayment`) |
| Precisa passar dados para a página de confirmação | Inclua no objeto `state` junto com o flag |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `navigate("/confirm")` sem estado | `navigate("/confirm", { state: { fromSubmit: true } })` |
| Verificar estado sem optional chaining | `location.state?.fromSubmit` (state pode ser null) |
| `window.location.href = "/confirm"` | `navigate("/confirm", { state })` (preserva SPA) |
| `useEffect` para redirecionar | `if (!state) return <Navigate />` antes do render |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Pagina de confirmacao acessivel via URL direta | Guard de estado ausente | Adicionar verificacao `if (!location.state?.fromSubmit) return <Navigate to="/" />` |
| `location.state` retorna null | Navegacao feita sem passar state | Usar `navigate("/confirm", { state: { fromSubmit: true } })` |
| Rota `/confirm` retorna 404 | Rota nao registrada no layout | Adicionar `<Route path="confirm" element={<Confirm />} />` |
| TypeError ao acessar `state.fromSubmit` | Acessando sem optional chaining | Usar `location.state?.fromSubmit` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre route guards com estado e o componente Navigate
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações