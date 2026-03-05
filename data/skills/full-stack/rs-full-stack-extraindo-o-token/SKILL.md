---
name: rs-full-stack-extraindo-o-token
description: "Applies JWT token extraction pattern in Express middleware when building authentication. Use when user asks to 'create auth middleware', 'extract token from request', 'validate bearer token', 'ensure authenticated', or 'protect routes'. Enforces correct header parsing, bearer prefix removal, and early-return on missing token. Make sure to use this skill whenever implementing authentication middleware in Node/Express. Not for token generation, JWT signing/verification, or login flow implementation."
---

# Extraindo o Token da Requisição

> Extraia o token do header Authorization separando o prefixo Bearer e valide sua presença antes de prosseguir.

## Rules

1. **Extraia de `request.headers.authorization`** — o token chega pelo header Authorization, nunca por query string ou body, porque é o padrão HTTP para autenticação
2. **Valide presença antes de processar** — se `authHeader` não existe, lance erro 401 imediatamente, porque processar undefined causa crash silencioso
3. **Separe Bearer do token com split(' ')** — o header vem no formato `Bearer <token>`, use desestruturação para ignorar o prefixo e capturar apenas o token
4. **Use middleware dedicado** — crie `EnsureAuthenticated` em `src/middlewares/`, porque separar autenticação da lógica de negócio permite reutilização em qualquer rota
5. **Aplique o middleware por rota** — insira entre o path e o controller na definição da rota, porque nem toda rota precisa de autenticação

## How to write

### Middleware de extração

```typescript
import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

export function EnsureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError("JWT token não informado", 401)
  }

  const [, token] = authHeader.split(" ")

  // token extraído, pronto para verificação
  console.log(token)

  return next()
}
```

### Aplicação na rota

```typescript
import { EnsureAuthenticated } from "../middlewares/EnsureAuthenticated"

productsRoutes.post("/", EnsureAuthenticated, productsController.create)
```

## Example

**Before (token com prefixo Bearer misturado):**
```typescript
// Pega o header inteiro: "Bearer eyJhbGciOiJIUzI1..."
const token = request.headers.authorization
// token contém "Bearer " + o JWT, causando erro na verificação
```

**After (token limpo e isolado):**
```typescript
const authHeader = request.headers.authorization

if (!authHeader) {
  throw new AppError("JWT token não informado", 401)
}

const [, token] = authHeader.split(" ")
// token contém apenas "eyJhbGciOiJIUzI1..." pronto para jwt.verify()
```

## Heuristics

| Situação | Faça |
|----------|------|
| Rota pública (login, registro) | Não aplique o middleware |
| Rota que precisa identificar usuário | Aplique EnsureAuthenticated |
| Múltiplas rotas protegidas | Aplique no router inteiro com `router.use(EnsureAuthenticated)` |
| Token ausente | Retorne 401, nunca 403 (403 é para permissão insuficiente) |
| Header com formato inesperado | O split retorna array com 1 elemento — token será `undefined` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `req.query.token` | `req.headers.authorization` |
| `authHeader.replace("Bearer ", "")` | `const [, token] = authHeader.split(" ")` |
| Verificar token dentro do controller | Middleware separado antes do controller |
| `if (!token) return res.status(401).json(...)` dentro do controller | `throw new AppError("JWT token não informado", 401)` no middleware |
| Exportar como default | `export function EnsureAuthenticated` (named export) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o fluxo Bearer token e decisões de design
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações