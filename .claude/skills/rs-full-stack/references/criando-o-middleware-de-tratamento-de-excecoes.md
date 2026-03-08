---
name: rs-full-stack-middleware-tratamento-excecoes
description: "Enforces Express error handling middleware pattern with custom AppError class and centralized exception handling. Use when user asks to 'create error handling', 'add middleware', 'handle exceptions', 'treat errors in API', or 'create AppError class'. Applies pattern: custom error class with statusCode + global error middleware that differentiates app errors from generic errors. Make sure to use this skill whenever building Express/Node APIs that need centralized error handling. Not for frontend error boundaries, logging systems, or validation libraries."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: express-error-handling
  tags: [express, middleware, error-handling, AppError, nodejs]
---

# Middleware de Tratamento de Exceções

> Centralize todo tratamento de erro em um middleware global que diferencia erros da aplicação (AppError) de erros genéricos.

## Rules

1. **Crie uma classe AppError separada** — em `utils/appError.ts`, porque permite identificar erros lançados intencionalmente via `instanceof`
2. **StatusCode padrão 400** — o construtor recebe `message` obrigatório e `statusCode` opcional com default 400, porque a maioria dos erros de aplicação são bad requests
3. **Middleware com 4 parâmetros** — `(error, request, response, _next)`, porque Express só reconhece como error middleware quando recebe exatamente 4 argumentos
4. **Diferencie por instanceof** — use `error instanceof AppError` para separar erros tratados de erros inesperados, porque erros da aplicação têm statusCode e mensagem controlados
5. **Erro genérico retorna 500** — se não for AppError, retorne status 500 com `error.message`, porque erros não previstos são server errors
6. **Registre o middleware após todas as rotas** — `app.use(errorHandling)` antes de `app.listen()`, porque middlewares de erro devem ser os últimos no pipeline

## How to write

### Classe AppError

```typescript
// utils/appError.ts
export class AppError {
  message: string
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}
```

### Error Handling Middleware

```typescript
// middlewares/error-handling.ts
import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/appError"

export function errorHandling(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  return response.status(500).json({ message: error.message })
}
```

### Registro no server

```typescript
// server.ts — após todas as rotas, antes do listen
app.use(errorHandling)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### Lançando erros no controller

```typescript
// Em qualquer controller, use next() para propagar
import { AppError } from "@/utils/appError"

export function myController(req: Request, res: Response, next: NextFunction) {
  try {
    // lógica...
    if (!found) throw new AppError("Recurso não encontrado", 404)
  } catch (error) {
    next(error) // propaga para o middleware de erro
  }
}
```

## Example

**Before (erro tratado inline em cada controller):**
```typescript
app.get("/orders", (req, res) => {
  try {
    const orders = getOrders()
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" })
    }
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
})
```

**After (com AppError + middleware centralizado):**
```typescript
app.get("/orders", (req, res, next) => {
  try {
    const orders = getOrders()
    if (!orders.length) throw new AppError("No orders found", 404)
    res.json(orders)
  } catch (error) {
    next(error)
  }
})
// middleware global trata tudo automaticamente
```

## Heuristics

| Situação | Faça |
|----------|------|
| Erro previsível (not found, validation) | `throw new AppError("msg", statusCode)` |
| Erro inesperado (crash, DB down) | Deixe o middleware pegar como erro genérico (500) |
| Controller com try/catch | Use `next(error)` no catch para propagar |
| Múltiplas camadas (service, repository) | Lance AppError em qualquer camada, o middleware captura |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `res.status(500).json(...)` em cada controller | `next(error)` e deixe o middleware tratar |
| Middleware de erro com 3 parâmetros | Sempre 4 parâmetros: `(error, req, res, next)` |
| `app.use(errorHandling)` antes das rotas | Registre após todas as rotas |
| `catch (error) { console.log(error) }` silencioso | `catch (error) { next(error) }` para propagar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre instanceof, camadas e pipeline Express
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Middleware de erro nao captura excecoes | Middleware registrado com 3 parametros em vez de 4 | Use exatamente 4 parametros: `(error, req, res, next)` |
| Erro retorna HTML em vez de JSON | Middleware de erro registrado antes das rotas | Mova `app.use(errorHandling)` para depois de todas as rotas |
| `instanceof AppError` sempre retorna false | AppError importado de caminho diferente | Verifique se o import aponta para o mesmo arquivo em todos os lugares |
| Erro nao propaga do controller | Usando `catch` sem `next(error)` | Substitua `catch (e) { res.status(500)... }` por `catch (e) { next(e) }` |
| Status code sempre 500 | Erro lancado como `new Error()` em vez de `new AppError()` | Use `throw new AppError("msg", statusCode)` para erros tratados |