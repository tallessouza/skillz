---
name: rs-full-stack-validando-tipo-de-dado
description: "Applies Zod schema validation patterns when writing Node.js/Express request handlers. Use when user asks to 'validate request body', 'add input validation', 'use Zod', 'parse request data', or 'create API endpoint with validation'. Enforces z.object schemas with parse, destructuring validated data, and proper error propagation. Make sure to use this skill whenever creating or modifying API route handlers that receive body data. Not for frontend form validation, database schema validation, or environment variable validation."
---

# Validacao de Dados com Zod

> Defina schemas Zod para cada request body e extraia dados validados via destructuring — nunca acesse propriedades do body diretamente.

## Rules

1. **Crie um schema para cada body** — `const bodySchema = z.object({...})` antes de acessar qualquer dado, porque valida tipo E estrutura de uma vez
2. **Use `parse`, nao acesso direto** — `bodySchema.parse(request.body)` em vez de `request.body.name`, porque parse lanca excecao automatica com mensagem descritiva
3. **Destructure do resultado do parse** — `const { name, price } = bodySchema.parse(request.body)`, porque isso garante que so dados validados sao usados
4. **Tipos Zod correspondem aos tipos JS** — `z.string()` para textos, `z.number()` para numeros, `z.boolean()` para booleanos, porque Zod rejeita tipos errados automaticamente (ex: string onde espera number)
5. **Deixe o Zod lancar a excecao** — nao faca `if (!name)` manualmente quando Zod ja valida, porque o error handler global captura ZodError com detalhes completos
6. **Aproveite a tipagem automatica** — o retorno de `parse()` tem tipos TypeScript inferidos do schema, porque elimina necessidade de tipar manualmente

## How to write

### Schema + parse + destructuring

```typescript
import { z } from "zod"

const bodySchema = z.object({
  name: z.string(),
  price: z.number(),
})

// No handler:
const { name, price } = bodySchema.parse(request.body)
```

### Schema fora do handler (reutilizavel)

```typescript
const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
})

app.post("/products", (request, reply) => {
  const { name, price } = createProductBodySchema.parse(request.body)
  // name e price ja validados e tipados
})
```

## Example

**Before (validacao manual verbosa):**

```typescript
app.post("/products", (request, reply) => {
  const { name, price } = request.body

  if (!name) {
    return reply.status(400).send({ message: "Name is required" })
  }
  if (typeof name !== "string") {
    return reply.status(400).send({ message: "Name must be a string" })
  }
  if (!price) {
    return reply.status(400).send({ message: "Price is required" })
  }
  if (typeof price !== "number") {
    return reply.status(400).send({ message: "Price must be a number" })
  }

  // ... logica
})
```

**After (com Zod):**

```typescript
import { z } from "zod"

app.post("/products", (request, reply) => {
  const bodySchema = z.object({
    name: z.string(),
    price: z.number(),
  })

  const { name, price } = bodySchema.parse(request.body)
  // Se tipo errado, Zod lanca excecao automaticamente
  // name: string, price: number — tipados pelo schema
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota recebe body JSON | Crie `bodySchema` com `z.object()` |
| Rota recebe params (id) | Crie `paramsSchema` com `z.object({ id: z.string() })` |
| Rota recebe query string | Crie `querySchema` com `z.object({...})` |
| Precisa de valor opcional | Use `z.string().optional()` |
| Precisa de valor com default | Use `z.number().default(0)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `const { name } = request.body` (sem validar) | `const { name } = bodySchema.parse(request.body)` |
| `if (typeof name !== "string")` manual | `z.string()` no schema |
| `if (!price \|\| !name)` encadeado | `z.object({ name: z.string(), price: z.number() })` |
| `request.body as { name: string }` (type assertion) | `bodySchema.parse(request.body)` (validacao real) |
| Try/catch custom por campo | Error handler global que captura ZodError |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que Zod substitui validacao manual, como excecoes propagam
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes