---
name: rs-full-stack-adicionando-zod
description: "Enforces Zod validation integration in Node.js APIs when adding input validation, handling validation errors in middleware, or formatting ZodError responses. Use when user asks to 'add validation', 'validate request body', 'handle validation errors', 'integrate Zod', or 'format error responses'. Applies pattern: install Zod, import ZodError, add instanceof check in error middleware, return formatted issues with status 400. Make sure to use this skill whenever adding request validation to Express/Node APIs. Not for Zod schema definition, frontend form validation, or non-Node.js environments."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [zod, error-handling, middleware, validation, express]
---

# Adicionando Zod ao Middleware de Exceções

> Integre ZodError no middleware de tratamento de exceções para retornar erros de validação formatados com status 400.

## Rules

1. **Importe ZodError, não Zod inteiro** — `import { ZodError } from 'zod'`, porque só a classe de erro é necessária no middleware
2. **Verifique com instanceof** — `error instanceof ZodError` antes de `instanceof AppError`, porque validação é mais específica que erros genéricos da aplicação
3. **Retorne status 400 para validação** — erros de Zod são sempre bad request, porque o cliente enviou dados inválidos
4. **Use error.format() para as issues** — retorna os problemas de validação estruturados e legíveis, porque o cliente precisa saber exatamente o que corrigir
5. **Mantenha a hierarquia de erros** — ZodError → AppError → erro genérico 500, porque cada camada tem tratamento específico

## How to write

### Middleware com Zod integrado

```javascript
import { ZodError } from 'zod'
import { AppError } from '../utils/AppError.js'

function errorHandler(error, request, response, next) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'validationError',
      issues: error.format()
    })
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message
    })
  }

  return response.status(500).json({
    message: 'Internal Server Error'
  })
}
```

## Example

**Before (sem tratamento de Zod):**
```javascript
function errorHandler(error, request, response, next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message
    })
  }

  return response.status(500).json({
    message: 'Internal Server Error'
  })
}
```

**After (com Zod integrado):**
```javascript
import { ZodError } from 'zod'
import { AppError } from '../utils/AppError.js'

function errorHandler(error, request, response, next) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'validationError',
      issues: error.format()
    })
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message
    })
  }

  return response.status(500).json({
    message: 'Internal Server Error'
  })
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Erro de validação de body/params/query | ZodError com status 400 |
| Erro de regra de negócio | AppError com statusCode customizado |
| Erro inesperado/desconhecido | Status 500 genérico |
| Precisa dos detalhes do erro de validação | Use `error.format()` para estruturar as issues |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `catch (e) { res.status(500).json(...) }` sem checar tipo | Verifique `instanceof ZodError` e `instanceof AppError` antes |
| `error.message` direto do ZodError | `error.format()` para issues estruturadas |
| Status 500 para erro de validação | Status 400 — é culpa do cliente |
| Zod check depois de AppError check | ZodError primeiro, depois AppError (mais específico antes) |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| ZodError não é capturado no middleware | `instanceof ZodError` está depois de outro catch genérico | Mova ZodError check para ANTES do AppError check |
| Erro 500 em vez de 400 para dados inválidos | Middleware não importou `ZodError` do pacote `zod` | Adicione `import { ZodError } from 'zod'` |
| `error.format()` retorna objeto vazio | Schema não tem validações encadeadas | Verifique se o schema tem `.min()`, `.positive()` etc. |
| Validação não dispara | `parse()` não foi chamado no request.body | Adicione `schema.parse(request.body)` na rota |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre hierarquia de erros e integração do Zod
- [code-examples.md](references/code-examples.md) — Exemplos de código expandidos com variações