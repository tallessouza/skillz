---
name: rs-full-stack-tratando-excecoes-2
description: "Enforces Express error handling middleware patterns when building REST APIs with Node.js. Use when user asks to 'create an API', 'add error handling', 'handle exceptions', 'treat errors in Express', or 'build a REST endpoint'. Applies rules: global error middleware at end of stack, typed error parameters, friendly JSON error responses, never expose stack traces. Make sure to use this skill whenever creating Express routes or middleware, even if the user doesn't mention error handling. Not for frontend error boundaries, database error handling, or validation logic."
---

# Tratamento de Exceções no Express

> Capture todas as exceções com um middleware global no final da pilha de execução, devolvendo respostas JSON amigáveis em vez de stack traces.

## Rules

1. **Middleware de erro vai no final** — depois de todas as rotas e middlewares, porque somente nessa posição ele captura exceções de qualquer ponto anterior na pilha de execução
2. **Nunca exponha stack traces na resposta** — devolva `{ message }` em JSON, porque o frontend precisa de mensagens legíveis, não de caminhos de arquivo do servidor
3. **Use a mensagem do erro original** — acesse `error.message` para manter contexto específico do que falhou, porque mensagens genéricas dificultam debugging no frontend
4. **Tipe os parâmetros do middleware** — use `Request`, `Response` e `NextFunction` importados do Express, porque tipagem previne bugs silenciosos
5. **Parâmetros não utilizados recebem underscore** — use `_next` em vez de `next` quando não chamar a próxima função, porque evita warnings de variável não utilizada
6. **Retorne status 500 com JSON** — nunca deixe o Express devolver HTML de erro padrão, porque APIs REST devem responder consistentemente em JSON

## How to write

### Middleware global de erro

```typescript
import express, { Request, Response, NextFunction } from "express"

// Depois de TODAS as rotas e middlewares
app.use((error: any, request: Request, response: Response, _next: NextFunction) => {
  return response.status(500).json({ message: error.message })
})

// app.listen() vem DEPOIS do middleware de erro
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
```

### Imports separados do Express

```typescript
// Importe tipos separados na mesma linha — mais elegante que múltiplos imports
import express, { Request, Response, NextFunction } from "express"
```

## Example

**Before (sem tratamento — stack trace exposto):**
```typescript
const app = express()
app.use(express.json())
app.use(routes)

// Nenhum middleware de erro — exceções retornam HTML com stack trace
// Status 500 genérico, terminal poluído com mensagens de erro

app.listen(3333)
```

**After (com middleware de erro):**
```typescript
const app = express()
app.use(express.json())
app.use(routes)

// Captura QUALQUER exceção da pilha de execução acima
app.use((error: any, request: Request, response: Response, _next: NextFunction) => {
  return response.status(500).json({ message: error.message })
})

app.listen(3333)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo servidor Express sendo criado | Adicione middleware de erro antes do `app.listen()` |
| Erro lançado dentro de um controller | `throw new Error("mensagem descritiva")` — o middleware global captura |
| Parâmetro `next` não será usado | Prefixe com underscore: `_next` |
| Frontend precisa saber o erro | Devolva `{ message: error.message }` em JSON |
| Ordem dos middlewares | JSON parser → Rotas → Erro handler → Listen |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `app.use(errorHandler)` antes das rotas | `app.use(errorHandler)` depois de todas as rotas |
| `response.send(error)` (objeto inteiro) | `response.json({ message: error.message })` |
| `app.listen()` antes do error handler | `app.listen()` depois do error handler |
| `(err, req, res, next)` sem tipagem | `(error: any, request: Request, response: Response, _next: NextFunction)` |
| Deixar exceções sem tratamento | Sempre ter middleware global de captura |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre posicionamento na pilha e fluxo de exceções
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-tratando-excecoes-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-tratando-excecoes-2/references/code-examples.md)
