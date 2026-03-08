---
name: rs-full-stack-middleware-de-autorizacao-1
description: "Enforces role-based authorization middleware patterns in Express/Node.js APIs. Use when user asks to 'protect routes', 'add authorization', 'restrict access by role', 'create middleware for permissions', or 'check user role'. Applies pattern: higher-order function receiving allowed roles array, returning Express middleware that checks user.rule against permitted roles. Make sure to use this skill whenever implementing route-level access control in Express. Not for authentication (login/token), session management, or frontend route guards."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: express-authorization
  tags: [express, authorization, rbac, middleware, roles]
---

# Middleware de Autorização

> Autorização é uma camada separada da autenticação: primeiro verifica-se identidade, depois verifica-se permissão.

## Rules

1. **Separe autenticação de autorização** — são dois middlewares distintos aplicados em sequência, porque cada um tem responsabilidade única e podem ser combinados independentemente
2. **Use higher-order function para receber roles** — o middleware recebe um array de roles permitidas e retorna a função middleware real, porque uma rota pode ser acessada por múltiplos perfis
3. **Valide existência do usuário antes de checar role** — use operador OR para curto-circuito: `if (!req.user || !roles.includes(req.user.rule))`, porque o middleware de auth pode ser opcional em alguns contextos
4. **Retorne 401 Unauthorized quando barrado** — não 403 Forbidden, porque o padrão aqui é "não autorizado" com status code 401
5. **Ordem dos middlewares é lei** — authenticate primeiro, authorize depois, porque autorização depende dos dados que autenticação injeta no request
6. **Aplique granularmente** — prefira autorização por rota específica em vez de grupo, porque diferentes rotas do mesmo recurso frequentemente têm permissões diferentes (listar = todos, criar = admin/sale)

## How to write

### Middleware de autorização (higher-order function)

```typescript
import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

function VerifyUserAuthorization(roles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.rule)) {
      throw new AppError("Unauthorized", 401)
    }

    return next()
  }
}

export { VerifyUserAuthorization }
```

### Aplicação em rota específica

```typescript
import { VerifyUserAuthorization } from "../middlewares/VerifyUserAuthorization"

// Ordem: authenticate → authorize → controller
productsRoutes.post(
  "/",
  EnsureAuthenticated,
  VerifyUserAuthorization(["sale", "admin"]),
  productsController.create
)

// Rota sem autorização — qualquer autenticado acessa
productsRoutes.get("/", EnsureAuthenticated, productsController.index)
```

### Aplicação em grupo de rotas

```typescript
// Aplica autorização em TODAS as rotas abaixo
productsRoutes.use(VerifyUserAuthorization(["sale", "admin"]))
productsRoutes.post("/", productsController.create)
productsRoutes.put("/:id", productsController.update)
```

## Example

**Before (sem autorização, qualquer autenticado acessa tudo):**
```typescript
productsRoutes.post("/", EnsureAuthenticated, productsController.create)
productsRoutes.get("/", EnsureAuthenticated, productsController.index)
```

**After (autorização granular por rota):**
```typescript
productsRoutes.post(
  "/",
  EnsureAuthenticated,
  VerifyUserAuthorization(["sale", "admin"]),
  productsController.create
)
productsRoutes.get("/", EnsureAuthenticated, productsController.index)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota de leitura pública (listagem) | Só autenticação, sem autorização |
| Rota de escrita (create/update/delete) | Autenticação + autorização com roles específicas |
| Todas as rotas de um recurso são restritas | Use `router.use(VerifyUserAuthorization([...]))` antes das rotas |
| Rota acessível por múltiplos perfis | Passe array: `["sale", "admin", "manager"]` |
| Precisa do role do usuário no controller | Acesse `request.user.rule` (já injetado pelo middleware de auth) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Checar role dentro do controller | Usar middleware de autorização separado |
| `if (user.role === "admin" \|\| user.role === "sale")` no controller | `VerifyUserAuthorization(["admin", "sale"])` como middleware |
| Colocar authorize antes de authenticate | Sempre authenticate primeiro, authorize depois |
| Retornar 403 para falta de role | Retornar 401 Unauthorized |
| Hardcodar um único role como string | Sempre receber array de roles |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Sempre retorna 401 mesmo com role correta | `request.user.rule` nao corresponde ao array de roles | Verifique se o campo e `rule` ou `role` e se o valor e case-sensitive |
| `request.user` e `undefined` | Middleware de autenticacao nao executou antes | Garanta a ordem: `authenticate` antes de `authorize` |
| Rota publica sendo bloqueada | Middleware de autorizacao aplicado globalmente | Use middleware local apenas nas rotas que precisam |
| Higher-order function nao retorna middleware | Esqueceu de retornar a funcao interna | Verifique que `VerifyUserAuthorization` retorna `(req, res, next) => {}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação auth/authz, padrão higher-order function e granularidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações