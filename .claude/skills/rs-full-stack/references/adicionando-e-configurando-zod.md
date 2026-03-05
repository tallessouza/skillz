---
name: rs-full-stack-adicionando-e-configurando-zod
description: "Enforces Zod validation patterns in Express/Fastify error handlers when building Node.js APIs. Use when user asks to 'add validation', 'configure zod', 'handle validation errors', 'create error middleware', or 'validate request data'. Applies ZodError instance checking, error.format() for structured responses, and proper 400 status codes. Make sure to use this skill whenever setting up Zod in an API or writing error-handling middleware that includes validation. Not for frontend form validation, database schema validation, or non-Zod validation libraries."
---

# Configurando Zod para Validacao em APIs

> Integre ZodError no error handler da API para retornar erros de validacao estruturados com status 400.

## Rules

1. **Importe ZodError junto com z** — `import { z, ZodError } from "zod"`, porque o tratamento de erro precisa da classe para instanceof check
2. **Verifique ZodError ANTES do erro generico** — a ordem no error handler importa: AppError → ZodError → erro generico, porque ZodError e mais especifico
3. **Use error.format() para formatar** — nunca retorne o ZodError bruto, porque `format()` estrutura os erros por campo de forma legivel
4. **Retorne status 400 para validacao** — erros de validacao sao erros do cliente, nao do servidor
5. **Nomeie a propriedade como `issues`** — padrao consistente com a nomenclatura do proprio Zod
6. **Fixe a versao do Zod** — `zod@3.23.8` ou a versao exata do projeto, porque breaking changes entre versoes sao comuns

## How to write

### Error handler com ZodError

```typescript
import { z, ZodError } from "zod"
import { AppError } from "@/utils/AppError"

function errorHandler(error, request, response, next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "validationError",
      issues: error.format(),
    })
  }

  return response.status(500).json({ message: "Internal server error" })
}
```

## Example

**Before (sem tratamento de ZodError):**
```typescript
function errorHandler(error, request, response, next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  // ZodError cai aqui como 500 — errado
  return response.status(500).json({ message: "Internal server error" })
}
```

**After (com ZodError tratado):**
```typescript
function errorHandler(error, request, response, next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "validationError",
      issues: error.format(),
    })
  }

  return response.status(500).json({ message: "Internal server error" })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Middleware de erro ja existe com AppError | Adicione o bloco ZodError logo abaixo do AppError |
| Projeto novo sem error handler | Crie com os 3 blocos: AppError → ZodError → generico |
| Precisa de erros flat (array simples) | Use `error.flatten()` em vez de `error.format()` |
| Validacao em rota especifica | Deixe o throw propagar ate o error handler central |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `catch (e) { res.json(e) }` | Deixe propagar para o error handler central |
| `error.message` direto do ZodError | `error.format()` para erros estruturados |
| `status(500)` para erro de validacao | `status(400)` — e erro do cliente |
| `import Zod from "zod"` | `import { z, ZodError } from "zod"` |
| Tratar ZodError depois do catch generico | ZodError ANTES do fallback 500 |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ordem de instanceof e format vs flatten
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-adicionando-e-configurando-zod/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-adicionando-e-configurando-zod/references/code-examples.md)
