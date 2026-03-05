---
name: rs-full-stack-middleware-de-autenticacao-3
description: "Enforces JWT authentication middleware patterns when building Express/Fastify APIs with token validation. Use when user asks to 'create middleware', 'validate token', 'authenticate request', 'protect route', or 'add auth to API'. Applies patterns: verify token with jsonwebtoken, extract user ID from sub claim, attach user to request, create custom Express typings. Make sure to use this skill whenever implementing authentication middleware or route protection in Node.js APIs. Not for frontend auth, OAuth flows, or session-based authentication."
---

# Middleware de Autenticação

> Extraia o ID do usuário do token JWT e injete na requisição para que todas as rotas protegidas saibam quem está fazendo a requisição.

## Rules

1. **Use `verify` do jsonwebtoken com a secret do app config** — porque validar o token sem a secret correta permite tokens forjados
2. **Extraia `sub` (subject) do token decodificado** — porque o `sub` é o claim padrão JWT para identificar o usuário, definido no momento da criação da sessão
3. **Injete o user na request antes de chamar next()** — `request.user = { id: String(sub) }`, porque as rotas seguintes precisam saber quem é o usuário sem decodificar o token novamente
4. **Crie tipagem personalizada em `src/types/express.d.ts`** — porque `request.user` não existe no tipo padrão do Express e o TypeScript vai reclamar
5. **Marque `user` como opcional na interface** — `user?: { id: string }`, porque nem todas as rotas passam pelo middleware de autenticação
6. **Converta o ID para string consistentemente** — `String(sub)`, porque o `sub` do JWT pode vir como number e a tipagem espera string

## How to write

### Middleware de autenticação

```typescript
import { verify } from "jsonwebtoken"
import { appConfig } from "@/config"

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return response.status(401).json({ message: "Token não informado" })
  }

  const [, token] = authHeader.split(" ")

  const { sub: userId } = verify(token, appConfig.jwt.secret)

  request.user = {
    id: String(userId),
  }

  return next()
}
```

### Tipagem personalizada do Express

```typescript
// src/types/express.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      id: string
    }
  }
}
```

### Uso nas rotas protegidas

```typescript
// Qualquer rota que usa o middleware consegue acessar o usuário
app.get("/products", ensureAuthenticated, (request, response) => {
  const userId = request.user?.id
  // userId identifica quem está fazendo a requisição
})
```

## Example

**Before (rota sem identificação do usuário):**
```typescript
app.get("/products", ensureAuthenticated, (request, response) => {
  // Não sabe quem é o usuário
  return response.json({ message: "Listando produtos" })
})
```

**After (com user injetado pelo middleware):**
```typescript
app.get("/products", ensureAuthenticated, (request, response) => {
  const userId = request.user?.id
  return response.json({ message: `Produtos do usuário ${userId}` })
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Rota precisa saber quem é o usuário | Use `request.user?.id` após o middleware |
| Token inválido ou expirado | `verify` lança exceção automaticamente — capture com try/catch ou error handler |
| Novo campo no user (ex: role) | Adicione em `express.d.ts` e no middleware |
| ID do usuário vem do banco como number | Converta com `String()` no middleware para manter consistência |
| Rota pública que não precisa de auth | Não aplique o middleware — `user` será `undefined` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `jwt.decode(token)` para validar | `verify(token, secret)` — decode não valida assinatura |
| `request.userId = sub` (prop avulsa) | `request.user = { id: String(sub) }` — objeto estruturado e tipado |
| Secret hardcoded no middleware | Importe do `appConfig` — centralizado e configurável |
| `sub` usado direto sem converter | `String(sub)` — garante tipo consistente |
| Tipagem com `any` no request | `declare namespace Express` com interface tipada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre JWT claims, subject, e merge de interfaces TypeScript
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-middleware-de-autenticacao-3/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-middleware-de-autenticacao-3/references/code-examples.md)
