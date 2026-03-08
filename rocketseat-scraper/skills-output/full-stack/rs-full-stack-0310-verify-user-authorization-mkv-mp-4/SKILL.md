---
name: rs-full-stack-verify-user-authorization
description: "Enforces role-based authorization middleware pattern when building Express APIs with protected routes. Use when user asks to 'protect a route', 'add authorization', 'check user permissions', 'restrict access by role', or 'create middleware for roles'. Applies flexible array-based role checking, AppError exceptions with 401 status, and middleware chaining before controllers. Make sure to use this skill whenever implementing route-level access control in Express. Not for authentication (login/JWT), database permissions, or frontend route guards."
---

# Middleware de Autorização por Perfil (Role-Based Authorization)

> Crie middlewares de autorização que recebem um array de perfis permitidos, verificam se o usuário está logado e se seu perfil está entre os autorizados, lançando exceção 401 caso contrário.

## Rules

1. **Receba roles como array, nunca string única** — `role: string[]` porque rotas frequentemente aceitam múltiplos perfis e novos perfis surgem ao longo da vida da aplicação
2. **Verifique duas condições: autenticação E autorização** — primeiro se `request.user` existe, depois se o perfil está no array, porque são falhas distintas (não logado vs sem permissão)
3. **Use `includes()` para verificar pertencimento** — `role.includes(request.user.role)` porque é declarativo e funciona com qualquer quantidade de perfis
4. **Lance AppError com status 401** — `throw new AppError("unauthorized", 401)` porque middlewares de tratamento de exceção já capturam e formatam a resposta
5. **Retorne uma função middleware** — o padrão é higher-order function que retorna `(req, res, next)`, porque o array de roles é configuração por rota
6. **Posicione entre autenticação e controller** — na cadeia de middlewares da rota: `authenticate → verifyAuthorization → controller`

## How to write

### Middleware de autorização

```javascript
const { AppError } = require("../utils/AppError")

function verifyUserAuthorization(role) {
  return (request, response, next) => {
    if (!request.user || !role.includes(request.user.role)) {
      throw new AppError("unauthorized", 401)
    }

    return next()
  }
}

module.exports = verifyUserAuthorization
```

### Uso nas rotas

```javascript
const verifyUserAuthorization = require("../middleware/verify-user-authorization")

// Apenas employee pode criar refunds
router.post(
  "/refunds",
  ensureAuthenticated,
  verifyUserAuthorization(["employee"]),
  createRefundController
)

// Múltiplos perfis podem acessar
router.get(
  "/reports",
  ensureAuthenticated,
  verifyUserAuthorization(["manager", "employee"]),
  listReportsController
)
```

## Example

**Before (role como string, inflexível):**
```javascript
function verifyRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(401).json({ error: "unauthorized" })
    }
    next()
  }
}
// Só aceita um perfil por rota
router.post("/refunds", verifyRole("employee"), controller)
```

**After (array de roles, com verificação de login):**
```javascript
function verifyUserAuthorization(role) {
  return (request, response, next) => {
    if (!request.user || !role.includes(request.user.role)) {
      throw new AppError("unauthorized", 401)
    }
    return next()
  }
}
// Flexível: aceita múltiplos perfis
router.post(
  "/refunds",
  ensureAuthenticated,
  verifyUserAuthorization(["employee"]),
  createRefundController
)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Rota acessível por apenas um perfil | Passe array com um elemento: `["manager"]` |
| Rota acessível por múltiplos perfis | Passe todos no array: `["manager", "employee"]` |
| Novo perfil surge no sistema | Adicione ao array das rotas relevantes, sem alterar o middleware |
| Usuário não está logado | O middleware já barra com a verificação `!request.user` |
| Precisa de autorização granular (por recurso) | Crie middleware específico, não sobrecarregue este |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `verifyRole("employee")` (string) | `verifyUserAuthorization(["employee"])` (array) |
| `res.status(401).json(...)` no middleware | `throw new AppError("unauthorized", 401)` |
| Verificar só o perfil sem checar login | `if (!request.user \|\| !role.includes(...))` |
| Hardcodar perfis dentro do middleware | Receber perfis como parâmetro do array |
| Colocar autorização dentro do controller | Separar em middleware dedicado antes do controller |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre higher-order functions, flexibilidade de arrays e fluxo de middlewares
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações