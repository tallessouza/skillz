---
name: rs-full-stack-middleware-global
description: "Enforces correct Express middleware patterns when building REST APIs with TypeScript. Use when user asks to 'create middleware', 'add global middleware', 'intercept requests', 'setup Express app', or 'configure route pipeline'. Applies rules: proper typing with Request/Response/NextFunction imports, mandatory next() call, correct middleware ordering before routes, app.use() for global application. Make sure to use this skill whenever creating or modifying Express middleware in TypeScript projects. Not for authentication logic, error handling middleware specifics, or database middleware implementation."
---

# Middleware Global no Express

> Middleware global intercepta todas as requisicoes e deve ser registrado ANTES das rotas com app.use().

## Rules

1. **Importe os tipos do Express** — use `Request`, `Response`, `NextFunction` do proprio express, porque a biblioteca ja disponibiliza tipagens prontas e isso ativa o IntelliSense do editor
2. **Sempre chame next()** — sem `return next()` a requisicao morre no middleware e nunca chega na rota, a menos que voce intencionalmente queira interromper
3. **Registre middleware global ANTES das rotas** — `app.use(myMiddleware)` deve vir antes de `app.get()`/`app.post()`, porque Express executa na ordem de registro
4. **Exporte funcoes nomeadas** — `export function myMiddleware(...)` facilita importacao e debug no stack trace
5. **Organize em pasta dedicada** — crie `src/middlewares/` para separar middlewares do resto da aplicacao
6. **Padronize nomenclatura de arquivos** — escolha `kebab-case` ou `camelCase` e mantenha consistencia no projeto inteiro

## How to write

### Middleware com tipagem completa

```typescript
// src/middlewares/my-middleware.ts
import { Request, Response, NextFunction } from "express"

export function myMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log("Passou pelo middleware!")
  return next()
}
```

### Registro global no servidor

```typescript
import express from "express"
import { myMiddleware } from "./middlewares/my-middleware"

const app = express()

// Middleware global — ANTES das rotas
app.use(myMiddleware)

// Rotas vem DEPOIS
app.get("/products", (request, response) => {
  return response.json({ products: [] })
})

app.post("/products", (request, response) => {
  return response.json({ message: "Created" })
})
```

## Example

**Before (middleware registrado depois — nao intercepta):**

```typescript
app.get("/products", listProducts)

// BUG: middleware registrado DEPOIS da rota — nao executa para GET /products
app.use(myMiddleware)

app.post("/products", createProduct)
// myMiddleware so executa para POST, nao para GET
```

**After (ordem correta):**

```typescript
app.use(myMiddleware) // Intercepta TODAS as rotas abaixo

app.get("/products", listProducts)
app.post("/products", createProduct)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Middleware deve afetar todas as rotas | `app.use(middleware)` antes de todas as rotas |
| Middleware deve afetar apenas uma rota | Use middleware local (proximo video) |
| Middleware precisa interromper a requisicao | Retorne `response.status(...)` sem chamar `next()` |
| Middleware so faz logging/tracking | Sempre chame `next()` no final |
| Varios middlewares globais | Registre na ordem desejada de execucao |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `function middleware(req: any, res: any, next: any)` | `function middleware(req: Request, res: Response, next: NextFunction)` |
| Registrar `app.use()` depois das rotas | Registrar `app.use()` antes das rotas |
| Esquecer de chamar `next()` | Sempre `return next()` no final |
| Criar middleware sem tipagem do Express | Importar `Request, Response, NextFunction` do express |
| Misturar kebab-case e camelCase nos arquivos | Escolher um padrao e manter |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ordem de execucao, tipagem e ciclo de vida do middleware
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-middleware-global/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-middleware-global/references/code-examples.md)
