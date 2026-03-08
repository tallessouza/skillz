---
name: rs-full-stack-criando-ensure-authenticated
description: "Enforces JWT authentication middleware pattern when building Express APIs with protected routes. Use when user asks to 'create auth middleware', 'protect routes', 'validate JWT token', 'add authentication to Express', or 'extend Express Request type'. Applies patterns: extract Bearer token from Authorization header, verify with jsonwebtoken, attach user to request, extend Express typings with declaration merging. Make sure to use this skill whenever implementing authentication guards or middleware in Express APIs. Not for OAuth flows, session-based auth, or frontend token storage."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: express-authentication
  tags: [express, jwt, middleware, authentication, typescript, declaration-merging]
---

# Criando ensureAuthenticated Middleware

> Intercepte cada requisicao protegida, valide o JWT, e injete os dados do usuario no objeto request antes de seguir.

## Rules

1. **Extraia o token do header Authorization** — use `request.headers.authorization` e faca split no espaco para separar "Bearer" do token, porque o formato padrao e `Bearer <token>`
2. **Valide ausencia de token antes de verificar** — lance `AppError` com status 401 se o header nao existe, porque tentar `verify` com undefined causa erro generico em vez de mensagem clara
3. **Use verify, nunca decode** — `verify()` valida assinatura e expiracao, `decode()` apenas le o payload sem validar, porque tokens falsificados passariam
4. **Tipe o payload com interface propria** — defina `TokenPayload` com `role` e `sub`, porque o retorno padrao do verify e `string | JwtPayload` generico
5. **Injete user no request** — adicione `request.user = { id, role }` para que controllers acessem dados do usuario sem re-decodificar o token
6. **Estenda a tipagem do Express com declaration merging** — crie `src/types/express.d.ts` com namespace Express e interface Request, porque TypeScript nao reconhece `request.user` nativamente

## How to write

### Middleware de autenticacao

```typescript
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"

interface TokenPayload {
  role: string
  sub: string
}

function ensureAuthenticated(
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

    const { role, sub: userId } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload

    request.user = {
      id: userId,
      role,
    }

    return next()
  } catch {
    throw new AppError("Invalid JWT token", 401)
  }
}

export { ensureAuthenticated }
```

### Declaration merging para Express Request

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

## Example

**Before (sem middleware, controller decodifica manualmente):**
```typescript
app.get("/orders", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]
  const decoded = verify(token!, SECRET) as any
  const userId = decoded.sub
  // logica duplicada em cada rota...
})
```

**After (com ensureAuthenticated):**
```typescript
app.get("/orders", ensureAuthenticated, (req, res) => {
  const userId = req.user!.id
  const userRole = req.user!.role
  // dados ja disponiveis, sem duplicacao
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Rota precisa saber quem e o usuario | Aplique `ensureAuthenticated` como middleware |
| Rota precisa verificar perfil (admin, customer) | Use `request.user.role` apos ensureAuthenticated |
| Token expirado ou invalido | O catch generico retorna 401 com "Invalid JWT token" |
| Header Authorization ausente | Retorna 401 com "JWT token not found" antes do verify |
| Novo campo no payload do token | Adicione na interface `TokenPayload` e em `express.d.ts` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `jwt.decode(token)` para autenticacao | `jwt.verify(token, secret)` com validacao de assinatura |
| `(req as any).user = ...` | Declaration merging com `express.d.ts` |
| Decodificar token em cada controller | Middleware unico que injeta `request.user` |
| `catch (error) { res.status(500) }` | `catch { throw new AppError("Invalid JWT token", 401) }` |
| Tipar payload como `any` | Interface `TokenPayload` com campos explicitos |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `request.user` mostra erro de tipo no TypeScript | Falta arquivo `express.d.ts` com declaration merging | Crie `src/types/express.d.ts` com namespace Express e interface Request estendida |
| Token valido retorna "Invalid JWT token" | Secret do verify diferente do usado na geracao do token | Verifique que `authConfig.jwt.secret` e o mesmo valor nos dois fluxos |
| Header Authorization nao chega ao middleware | Cliente nao envia header ou CORS bloqueia | Verifique o header no Insomnia/Postman e configure CORS no Express |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre declaration merging, fluxo Bearer token e catch generico
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes