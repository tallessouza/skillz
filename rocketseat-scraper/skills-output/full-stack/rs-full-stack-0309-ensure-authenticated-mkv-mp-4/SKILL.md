---
name: rs-full-stack-ensure-authenticated
description: "Enforces JWT authentication middleware patterns when protecting Express routes with token verification. Use when user asks to 'protect routes', 'add authentication middleware', 'verify JWT token', 'ensure authenticated', 'guard routes', or 'extract user from token'. Applies patterns: Bearer token extraction from headers, verify with jsonwebtoken, extend Express Request type, apply middleware globally with app.use positioning. Make sure to use this skill whenever implementing route protection or JWT verification in Express. Not for session-based auth, OAuth flows, or token generation/login logic."
---

# Middleware ensureAuthenticated com JWT

> Proteja rotas criando um middleware que extrai e valida o Bearer token do header, injeta o usuario no request e controla acesso pela posicao do app.use.

## Rules

1. **Extraia o token do header Authorization** — use `request.headers.authorization` e faca split no espaco para separar "Bearer" do token, porque o formato padrao e `Bearer <token>`
2. **Lance erro especifico quando token ausente** — use AppError com mensagem "JWT token not found" e status 401, porque erros genericos dificultam debug do cliente
3. **Valide com verify do jsonwebtoken** — passe o token e o secret do authConfig, tipando o retorno com uma interface TokenPayload, porque garante type-safety no destructuring
4. **Injete usuario no request** — atribua `request.user = { id, role }` apos validacao, porque qualquer controller subsequente precisa saber quem fez a requisicao
5. **Estenda a tipagem do Express** — crie `src/types/express.d.ts` com declaration merging na interface Request, porque TypeScript nao conhece a propriedade `user` nativamente
6. **Controle acesso pela posicao do app.use** — rotas declaradas ACIMA do middleware nao exigem token, rotas ABAIXO exigem, porque Express executa middlewares na ordem de declaracao

## How to write

### Middleware de autenticacao

```typescript
import { verify } from "jsonwebtoken"
import { authConfig } from "@/config/auth"
import { AppError } from "@/utils/AppError"
import { Request, Response, NextFunction } from "express"

interface TokenPayload {
  role: string
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError("JWT token not found", 401)
    }

    const [, token] = authHeader.split(" ")

    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload

    request.user = { id: user_id, role }

    return next()
  } catch {
    throw new AppError("Invalid JWT token", 401)
  }
}
```

### Extensao de tipo do Express

```typescript
// src/types/express.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      id: string
      role: string
    }
  }
}
```

### Aplicacao nas rotas por posicao

```typescript
// routes/index.ts
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated"

// Rotas publicas (ACIMA do middleware)
routes.post("/users", createUser)
routes.post("/sessions", createSession)

// Middleware de autenticacao
routes.use(ensureAuthenticated)

// Rotas privadas (ABAIXO do middleware)
routes.post("/refunds", createRefund)
routes.get("/refunds", listRefunds)
```

## Example

**Before (rota desprotegida):**
```typescript
routes.post("/users", createUser)
routes.post("/sessions", createSession)
routes.post("/refunds", createRefund) // qualquer um acessa
```

**After (com ensureAuthenticated):**
```typescript
routes.post("/users", createUser)
routes.post("/sessions", createSession)

routes.use(ensureAuthenticated) // barreira de autenticacao

routes.post("/refunds", createRefund) // apenas autenticados
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota publica (login, cadastro) | Declare ACIMA do `routes.use(ensureAuthenticated)` |
| Todas as rotas privadas | Declare ABAIXO do middleware global |
| Apenas uma rota especifica privada | Passe como segundo argumento: `routes.get("/x", ensureAuthenticated, controller)` |
| Precisa do user_id no controller | Acesse `request.user.id` — ja injetado pelo middleware |
| Token expirado ou invalido | O catch generico lanca "Invalid JWT token" com 401 |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `req.headers["authorization"]` sem split | `const [, token] = authHeader.split(" ")` — separe Bearer do token |
| Ignorar tipagem do request.user | Crie `express.d.ts` com declaration merging |
| Colocar middleware depois das rotas privadas | Posicione `routes.use(ensureAuthenticated)` ANTES das rotas protegidas |
| Hardcodar o secret no middleware | Importe de `authConfig.jwt.secret` centralizado |
| Retornar `response.status(401)` no middleware | Lance `AppError` e deixe o error handler global tratar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Bearer token, declaration merging e posicionamento de middleware
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes