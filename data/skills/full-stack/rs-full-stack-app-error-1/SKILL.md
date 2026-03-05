---
name: rs-full-stack-app-error-1
description: "Enforces AppError class pattern to differentiate client errors from server errors in Node.js/Express APIs. Use when user asks to 'handle errors', 'create error handling', 'add validation errors', 'throw exceptions in controllers', or 'setup error middleware'. Applies custom error class with message and statusCode, instanceof checking in global handler. Make sure to use this skill whenever building REST API error handling or exception middleware. Not for frontend error boundaries, logging infrastructure, or monitoring setup."
---

# AppError — Diferenciando Erros de Cliente vs Servidor

> Toda exceção na API deve ser classificada: erro do cliente (4xx) ou erro interno do servidor (5xx), usando uma classe AppError dedicada.

## Rules

1. **Crie uma classe AppError separada da classe Error nativa** — porque a classe nativa não carrega statusCode, impossibilitando diferenciar tipos de erro no handler global
2. **StatusCode padrão deve ser 400** — porque a maioria das exceções lançadas manualmente são validações de input do cliente (bad request)
3. **Use `instanceof AppError` no error handler global** — porque é a única forma confiável de distinguir erros conhecidos (cliente) de erros inesperados (servidor)
4. **Erros que NÃO são AppError recebem status 500** — porque representam falhas internas não previstas, nunca exponha detalhes internos ao cliente
5. **Lance AppError nos controllers, nunca Error genérico** — porque Error genérico sempre cai no 500, perdendo a distinção semântica

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

### Error handler global no server

```typescript
import { AppError } from "./utils/AppError"

// No middleware de erro (após as rotas)
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  // Erro interno genérico — nunca expor detalhes
  return response.status(500).json({ message: "Internal Server Error" })
})
```

### Lançando AppError no controller

```typescript
import { AppError } from "../utils/AppError"

// Erro de cliente (400 por padrão)
throw new AppError("O campo nome é obrigatório")

// Erro de cliente com status específico
throw new AppError("Produto não encontrado", 404)
```

## Example

**Before (sem distinção de erros):**
```typescript
// Controller
throw new Error("Nome é obrigatório")

// Handler — TUDO vira 500
app.use((error, req, res, next) => {
  return res.status(500).json({ message: error.message })
})
```

**After (com AppError):**
```typescript
// Controller
throw new AppError("Nome é obrigatório") // → 400

// Handler — distingue cliente vs servidor
app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message })
  }
  return res.status(500).json({ message: "Internal Server Error" })
})
```

## Heuristics

| Situação | Ação |
|----------|------|
| Validação de input falhou | `throw new AppError("mensagem")` — usa 400 padrão |
| Recurso não encontrado | `throw new AppError("mensagem", 404)` |
| Erro inesperado (bug, DB fora) | Deixe cair no catch genérico → 500 |
| Erro de autenticação | `throw new AppError("mensagem", 401)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `throw new Error("campo inválido")` no controller | `throw new AppError("campo inválido")` |
| `res.status(400).json(...)` direto no controller sem throw | `throw new AppError(...)` e deixe o handler global tratar |
| `catch (e) { res.status(500)... }` em cada rota | Um único error handler global com `instanceof AppError` |
| Status 500 para erros de validação | AppError com 400 (padrão) para erros do cliente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre a separação cliente vs servidor
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações