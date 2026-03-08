---
name: rs-full-stack-role-do-usuario
description: "Enforces role-based conditional routing patterns when implementing user authentication flows, rendering different routes per user role, or handling session-based navigation. Use when user asks to 'route by role', 'render based on user type', 'switch between admin and user views', 'handle session redirect', or 'implement role-based access'. Applies switch case routing, session validation, and default auth redirect. Make sure to use this skill whenever building multi-role UIs or conditional route rendering. Not for backend RBAC, API middleware authorization, or database-level permissions."
---

# Role-Based Conditional Routing

> Renderize rotas dinamicamente com base no perfil (role) do usuario, usando switch case para decisao limpa e redirecionamento para autenticacao como fallback padrao.

## Rules

1. **Use switch case para decisao de rota por role** — `switch(session.user.role)` com `return` em cada caso, porque if/else encadeado fica ilegivel com 3+ roles
2. **Retorne componentes de rota diretamente** — cada `case` retorna o componente de rotas do perfil (`<EmployeeRoutes />`, `<ManagerRoutes />`), porque isso elimina variaveis intermediarias
3. **Use `default` para redirecionar a autenticacao** — quando nenhum role corresponde ou sessao nao existe, retorne as rotas de auth, porque usuario sem sessao valida deve sempre ir para login
4. **Trate sessao inexistente com optional chaining** — `session?.user?.role`, porque a sessao pode ser `undefined` quando usuario nao esta logado
5. **Encapsule a logica de rota em funcao nomeada** — crie uma funcao `Route()` com R maiusculo que retorna o componente, porque funcoes que retornam JSX seguem convencao de componente React

## How to write

### Switch case para rotas por role

```tsx
function Route() {
  switch (session?.user?.role) {
    case "employee":
      return <EmployeeRoutes />
    case "manager":
      return <ManagerRoutes />
    default:
      return <AuthRoutes />
  }
}
```

### Renderizacao no App

```tsx
function App() {
  return <Route />
}
```

## Example

**Before (decisao manual, estatica):**
```tsx
function App() {
  // Rota fixa, trocada manualmente
  return <ManagerRoutes />
}
```

**After (com this skill applied):**
```tsx
const session = {
  user: {
    role: "manager"
  }
}

function Route() {
  switch (session?.user?.role) {
    case "employee":
      return <EmployeeRoutes />
    case "manager":
      return <ManagerRoutes />
    default:
      return <AuthRoutes />
  }
}

function App() {
  return <Route />
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| 2 roles (employee/manager) | Switch case com default para auth |
| 3+ roles | Switch case escala naturalmente, adicione mais `case` |
| Sessao pode ser undefined | Optional chaining `session?.user?.role` |
| Role desconhecido ou ausente | `default` redireciona para login |
| Role com permissoes minimas | Pode criar case especifico ou cair no default |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `if (role === "employee") { ... } else if (role === "manager") { ... } else { ... }` | `switch(role) { case "employee": ... case "manager": ... default: ... }` |
| `return role === "manager" ? <ManagerRoutes /> : <EmployeeRoutes />` | Switch case quando ha 2+ roles + fallback auth |
| `session.user.role` sem verificar sessao | `session?.user?.role` com optional chaining |
| Trocar rota manualmente no codigo | Decisao dinamica via switch case no role |
| Variavel intermediaria `let component = ...` | `return` direto em cada case |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre switch case vs if/else, session handling e fluxo de autenticacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes para diferentes cenarios de roles