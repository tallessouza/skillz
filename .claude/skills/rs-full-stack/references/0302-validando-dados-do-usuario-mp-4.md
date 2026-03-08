---
name: rs-full-stack-validando-dados-usuario
description: "Enforces Zod schema validation for Express request bodies when creating user registration endpoints, validating form inputs, or sanitizing API payloads. Use when user asks to 'validate request body', 'add input validation', 'create user registration', 'validate with Zod', or 'sanitize user input'. Applies Zod schemas with custom error messages, Prisma enum integration, string transforms (trim, toLowerCase), and min-length rules. Make sure to use this skill whenever building Express routes that receive user data. Not for frontend form validation, database constraints, or authentication logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [zod, validation, express, request-body, prisma-enum]
---

# Validação de Dados do Usuário com Zod

> Valide todos os dados de entrada com Zod schemas antes de qualquer operação, usando mensagens de erro claras e transforms para normalização.

## Rules

1. **Crie um bodySchema com z.object para cada rota que recebe dados** — porque validação centralizada no schema garante consistência e mensagens de erro automáticas
2. **Use transforms no schema (trim, toLowerCase)** — normalização acontece na validação, não espalhada pelo controller, porque evita dados duplicados por formatação
3. **Defina mensagens de erro em português para cada campo** — porque mensagens padrão do Zod são genéricas e não ajudam o usuário final
4. **Use z.nativeEnum com enums do Prisma** — porque restringe valores válidos à mesma fonte de verdade do banco de dados
5. **Defina .default() para campos com valor padrão** — porque o chamador não precisa enviar campos opcionais
6. **Importe express-async-errors no topo da aplicação** — porque sem ele, erros lançados pelo Zod dentro de async handlers não propagam para o error handler do Express

## How to write

### Schema de validação com Zod + Prisma enum

```typescript
import { z } from "zod"
import { UserRole } from "@prisma/client"

const bodySchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
  email: z.string().trim().email({ message: "E-mail inválido" }).toLowerCase(),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 dígitos" }),
  role: z.nativeEnum(UserRole).default(UserRole.EMPLOYEE),
})
```

### Uso no controller

```typescript
async create(request: Request, response: Response) {
  const { name, email, password, role } = bodySchema.parse(request.body)

  // name, email, password e role já estão validados e normalizados
  return response.json({ name, email, password, role })
}
```

### Import obrigatório no app

```typescript
import "express-async-errors" // DEVE estar no topo, antes das rotas
import express from "express"
```

## Example

**Before (sem validação):**
```typescript
async create(request: Request, response: Response) {
  const { name, email, password, role } = request.body
  // Dados podem vir vazios, email com maiúsculas, senha curta, role inexistente
  return response.json({ name, email, password, role })
}
```

**After (com Zod schema):**
```typescript
const bodySchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
  email: z.string().trim().email({ message: "E-mail inválido" }).toLowerCase(),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 dígitos" }),
  role: z.nativeEnum(UserRole).default(UserRole.EMPLOYEE),
})

async create(request: Request, response: Response) {
  const { name, email, password, role } = bodySchema.parse(request.body)
  return response.json({ name, email, password, role })
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo de texto obrigatório | `.string().trim().min(N, { message })` |
| Campo de e-mail | `.string().trim().email({ message }).toLowerCase()` |
| Campo com valores restritos | `.nativeEnum(PrismaEnum).default(valor)` |
| Senha ou PIN | `.string().min(N, { message })` |
| Campo opcional com fallback | `.string().optional().default("valor")` |
| Erros do Zod não aparecem na resposta | Verificar se `express-async-errors` está importado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `const { name } = request.body` (sem validação) | `const { name } = bodySchema.parse(request.body)` |
| `if (!name) throw new Error(...)` (validação manual) | `z.string().min(2, { message: "..." })` |
| `email.toLowerCase()` no controller | `.toLowerCase()` no schema |
| `role: z.string()` (aceita qualquer texto) | `role: z.nativeEnum(UserRole)` |
| Validação espalhada pelo controller | Schema único com `z.object({...})` |

## Troubleshooting

### Problem: Zod validation errors crash the Express server with unhandled promise rejection
- **Cause**: `express-async-errors` is not imported, so async errors thrown by `schema.parse()` are not caught by the Express error handler
- **Fix**: Add `import "express-async-errors"` at the top of your `app.ts`, before any route imports

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre express-async-errors, transforms no Zod e integração com Prisma enums
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e testes de validação