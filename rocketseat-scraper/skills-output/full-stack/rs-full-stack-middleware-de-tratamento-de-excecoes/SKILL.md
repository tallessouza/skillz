---
name: rs-full-stack-middleware-tratamento-excecoes
description: "Enforces Express error handling middleware pattern with custom AppError class when building Node.js APIs. Use when user asks to 'handle errors', 'create error middleware', 'add error handling', 'throw custom errors', or 'setup express error handler'. Applies pattern: custom AppError class with message+statusCode, centralized error-handling middleware, express-async-errors for async support. Make sure to use this skill whenever creating Express APIs or adding error handling to existing routes. Not for frontend error boundaries, React error handling, or non-Express frameworks like Fastify/NestJS."
---

# Middleware de Tratamento de Exceções

> Centralize todo tratamento de erros em um único middleware Express, usando uma classe AppError para distinguir erros intencionais de erros inesperados.

## Rules

1. **Crie uma classe AppError separada** — em `src/utils/AppError.ts`, porque permite distinguir erros lançados intencionalmente (com statusCode controlado) de erros inesperados do sistema
2. **StatusCode padrão é 400** — no construtor do AppError, defina `statusCode = 400` como valor default, porque a maioria dos erros de negócio são bad requests
3. **Use `instanceof` para identificar erros conhecidos** — no middleware, verifique `error instanceof AppError` antes de responder, porque erros conhecidos têm mensagem e status controlados
4. **Erros desconhecidos retornam 500** — se não for `instanceof AppError`, retorne status 500 com `error.message`, porque são erros internos não previstos
5. **Instale `express-async-errors`** — importe antes de qualquer rota, porque Express não captura rejeições de promises por padrão
6. **Registre o middleware DEPOIS das rotas** — `app.use(errorHandling)` deve vir após todas as rotas, porque Express executa error handlers na ordem de registro

## How to write

### Classe AppError

```typescript
// src/utils/AppError.ts
class AppError {
  message: string
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}

export { AppError }
```

### Middleware de error handling

```typescript
// src/middlewares/error-handling.ts
import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

function errorHandling(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    })
  }

  return response.status(500).json({
    message: error.message,
  })
}

export { errorHandling }
```

### Registro no app

```typescript
// src/app.ts
import "express-async-errors"
import express from "express"
import { errorHandling } from "./middlewares/error-handling"

const app = express()

// ... rotas aqui ...

// Tratamento de exceções (DEPOIS das rotas)
app.use(errorHandling)
```

## Example

**Before (erro não tratado — app crasha):**
```typescript
app.post("/users", async (request, response) => {
  const { email } = request.body
  if (!email) {
    throw new Error("Email is required") // Express não captura sem express-async-errors
  }
})
```

**After (com AppError + middleware):**
```typescript
import { AppError } from "../utils/AppError"

app.post("/users", async (request, response) => {
  const { email } = request.body
  if (!email) {
    throw new AppError("Email is required") // Capturado, retorna 400
  }
  // Erro inesperado qualquer → capturado, retorna 500
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Validação de input do usuário | `throw new AppError("mensagem", 400)` |
| Recurso não encontrado | `throw new AppError("mensagem", 404)` |
| Sem permissão | `throw new AppError("mensagem", 401)` |
| Erro inesperado do sistema | Deixe o middleware capturar com 500 |
| Rotas async | Instale `express-async-errors` na versão 3.1.1 |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `try/catch` em cada rota individualmente | Middleware centralizado + `express-async-errors` |
| `response.status(500).json(...)` dentro da rota | `throw new AppError("mensagem", statusCode)` |
| Retornar erro sem statusCode controlado | Usar AppError com statusCode padrão 400 |
| Registrar middleware de erro ANTES das rotas | Registrar DEPOIS de todas as rotas |
| Usar `Error` nativo para erros de negócio | Usar `AppError` para diferenciar de erros do sistema |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação de erros conhecidos vs desconhecidos, papel do express-async-errors
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e anotações