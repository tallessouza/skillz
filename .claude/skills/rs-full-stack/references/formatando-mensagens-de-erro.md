---
name: rs-full-stack-formatando-mensagens-de-erro
description: "Enforces standardized Zod validation error handling in Node.js REST APIs. Use when user asks to 'handle validation errors', 'format Zod errors', 'create error handler', 'add error middleware', or 'validate request body'. Applies pattern: catch ZodError by instanceof, return 400 with message + formatted issues. Make sure to use this skill whenever building error handling middleware in APIs that use Zod. Not for generic try/catch, HTTP client errors, or frontend form validation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-error-handling
  tags: [node-js, zod, error-handling, validation, rest-api]
---

# Formatando Mensagens de Erro do Zod

> Capture erros do Zod com instanceof ZodError e retorne status 400 com message padronizada e issues formatados via error.format().

## Rules

1. **Verifique instanceof ZodError no error handler global** — porque erros de validação do Zod não são instâncias de AppError e precisam de tratamento específico
2. **Retorne status 400 (Bad Request)** — porque erro de validação é culpa do cliente, não do servidor
3. **Padronize a resposta com `message` e `issues`** — porque o front-end precisa de uma estrutura previsível para exibir erros
4. **Use `error.format()` para os issues** — porque o método format() do Zod agrupa erros por campo com `_errors` array, facilitando exibição por campo
5. **Adicione `return` após responder** — porque sem return o código continua executando handlers abaixo desnecessariamente
6. **Ordene: AppError primeiro, ZodError segundo, genérico por último** — porque a ordem do instanceof importa para capturar o erro mais específico

## How to write

### Error handler global com ZodError

```typescript
import { ZodError } from "zod"
import { AppError } from "./app-error"

// No error handler global do server (Fastify/Express)
app.setErrorHandler((error, request, response) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    })
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation error",
      issues: error.format(),
    })
  }

  return response.status(500).json({
    message: "Internal server error",
  })
})
```

## Example

**Before (erro genérico sem tratamento do Zod):**
```typescript
app.setErrorHandler((error, request, response) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  // ZodError cai aqui — retorna 500 com mensagem crua
  return response.status(500).json({ message: "Internal server error" })
})
```

**After (com tratamento específico do Zod):**
```typescript
app.setErrorHandler((error, request, response) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation error",
      issues: error.format(),
    })
  }

  return response.status(500).json({ message: "Internal server error" })
})
```

**Resposta formatada quando price recebe string ao invés de number:**
```json
{
  "message": "Validation error",
  "issues": {
    "price": {
      "_errors": ["Expected number, received string"]
    }
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Zod parse/safeParse falha em route handler | Deixe o erro propagar até o error handler global |
| Múltiplos campos inválidos | `format()` já agrupa por campo automaticamente |
| Precisa de mensagens em português | Configure mensagens custom no schema Zod, não no handler |
| API pública com contrato definido | Mantenha `message` + `issues` como padrão em toda API |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `catch (e) { res.status(500).json({ error: e }) }` | `if (error instanceof ZodError) { res.status(400).json({ message: "Validation error", issues: error.format() }) }` |
| `error.message` direto do Zod como resposta | `error.format()` para resposta estruturada por campo |
| Status 500 para erro de validação | Status 400 (Bad Request) |
| Error handler sem `return` entre condições | `return response.status(...)` em cada branch |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| ZodError retorna 500 em vez de 400 | `instanceof ZodError` nao esta no error handler | Adicione o check antes do handler generico de 500 |
| `error.format()` retorna objeto vazio | Nenhum campo falhou na validacao (erro pode ser de outro tipo) | Verifique que o erro e realmente ZodError com `instanceof` |
| Handler continua executando apos responder | Falta `return` antes de `response.status(...)` | Adicione `return` em cada branch do error handler |
| Import do ZodError falha | Import incorreto do pacote zod | Use `import { ZodError } from "zod"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre instanceof chain e format() do Zod
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variações e cenários