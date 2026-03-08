---
name: rs-full-stack-tratamento-de-excecoes
description: "Enforces Express API error handling patterns with AppError class, express-async-errors, and Zod validation. Use when user asks to 'handle errors', 'create error middleware', 'add exception handling', 'validate request body', or 'throw custom errors' in Express APIs. Applies AppError class pattern, centralized error middleware with instanceof checks, and structured Zod validation responses. Make sure to use this skill whenever building Express APIs that need error handling or input validation. Not for frontend error boundaries, React error handling, or non-Express frameworks."
---

# Tratamento de Exceções em API Express

> Centralize todo tratamento de erro em um único middleware que diferencia erros de negócio (AppError), erros de validação (ZodError) e erros inesperados.

## Rules

1. **Use express-async-errors** — importe no topo do app para capturar erros em rotas async sem try/catch manual, porque Express não captura rejeições de promises por padrão
2. **Crie uma classe AppError** — com `message` (obrigatório) e `statusCode` (padrão 400), porque erros de negócio precisam de status HTTP específico
3. **Middleware de erro sempre no final** — registre com `app.use(errorHandling)` DEPOIS de todas as rotas, porque Express executa middlewares na ordem de registro
4. **Diferencie por instanceof** — verifique `AppError`, depois `ZodError`, depois fallback genérico, porque cada tipo de erro tem formato de resposta diferente
5. **Retorne estrutura consistente** — sempre inclua `message` no JSON de resposta, porque o cliente precisa de formato previsível
6. **ZodError retorna issues separadas** — use `error.format()` no campo `issues` e `message: "Validation error"`, porque múltiplos campos podem falhar simultaneamente

## How to write

### Classe AppError

```typescript
// src/utils/AppError.ts
export class AppError {
  message: string
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}
```

### Middleware de erro

```typescript
// src/middlewares/error-handling.ts
import { ErrorRequestHandler } from "express"
import { AppError } from "@/utils/AppError"
import { ZodError } from "zod"

export const errorHandling: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message })
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      issues: error.format(),
    })
  }

  return res.status(500).json({ message: error.message })
}
```

### Registro no app

```typescript
// src/app.ts
import "express-async-errors"
import express from "express"
import { errorHandling } from "@/middlewares/error-handling"

const app = express()

// ... rotas aqui ...

app.use(errorHandling) // SEMPRE depois das rotas
```

## Example

**Before (erro não tratado):**
```typescript
app.get("/users/:id", async (req, res) => {
  const user = await findUser(req.params.id)
  if (!user) {
    // Erro silencioso ou crash da aplicação
    res.status(404).json({ error: "not found" })
    return
  }
  res.json(user)
})
```

**After (com AppError):**
```typescript
import { AppError } from "@/utils/AppError"

app.get("/users/:id", async (req, res) => {
  const user = await findUser(req.params.id)
  if (!user) {
    throw new AppError("User not found", 404)
  }
  res.json(user)
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Erro de regra de negócio | `throw new AppError("mensagem", statusCode)` |
| Validação de input | Use Zod schema `.parse()` — o middleware captura automaticamente |
| Erro inesperado (banco, rede) | Deixe cair no fallback 500 |
| statusCode omitido no AppError | Assume 400 (Bad Request) |
| Precisa de detalhes do erro Zod | Use `error.format()` em `issues` |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| try/catch em cada rota | Instale express-async-errors e use middleware central |
| `res.status(400).send("erro")` em cada rota | `throw new AppError("erro")` |
| Retornar erro Zod cru como message | Estruture com `message: "Validation error"` + `issues` |
| Registrar middleware de erro antes das rotas | Registre DEPOIS de todas as rotas |
| Usar `next(error)` manualmente em rotas async | express-async-errors faz isso automaticamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre a arquitetura de erro, fluxo do middleware e decisões de design
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cenários de teste