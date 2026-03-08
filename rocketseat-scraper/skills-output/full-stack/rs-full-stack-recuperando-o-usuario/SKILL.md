---
name: rs-full-stack-recuperando-o-usuario
description: "Enforces secure user retrieval and password validation patterns when implementing authentication endpoints with Prisma, Zod, and bcrypt. Use when user asks to 'create login route', 'implement authentication', 'validate credentials', 'build sessions controller', or 'compare passwords'. Applies rules: validate input with Zod schema, retrieve user with findFirst, compare hashed passwords with bcrypt.compare, return generic error messages without revealing which field failed. Make sure to use this skill whenever building login/session endpoints or credential validation logic. Not for registration, JWT token generation, or authorization middleware."
---

# Recuperando o Usuário na Autenticação

> Ao validar credenciais, nunca revele qual campo está incorreto — retorne sempre a mesma mensagem genérica para e-mail e senha inválidos.

## Rules

1. **Valide inputs com Zod antes de qualquer operação no banco** — crie um `bodySchema` com `z.object()` contendo `email` (string + email) e `password` (string + min 6), porque rejeitar cedo evita queries desnecessárias
2. **Use `findFirst` para buscar por e-mail** — não `findUnique`, porque `findFirst` permite filtros compostos sem exigir campo `@unique` no schema Prisma
3. **Verifique existência do usuário antes de comparar senha** — se `user` é null, lance erro imediatamente, porque `bcrypt.compare` com null causa crash
4. **Use `bcrypt.compare` para validar senha** — nunca compare strings diretamente, porque a senha no banco está hasheada
5. **Retorne mensagem genérica idêntica para ambos os erros** — "E-mail ou senha inválidos" tanto para usuário não encontrado quanto para senha errada, porque mensagens específicas facilitam enumeração de contas
6. **Use status 401 para credenciais inválidas** — não 400 ou 403, porque 401 (Unauthorized) é o código semanticamente correto para falha de autenticação

## How to write

### Schema de validação

```typescript
import { z } from "zod"

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
```

### Recuperação e validação no controller

```typescript
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { compare } from "bcrypt"

async create(request, response) {
  const { email, password } = bodySchema.parse(request.body)

  const user = await prisma.user.findFirst({
    where: { email },
  })

  if (!user) {
    throw new AppError("E-mail ou senha inválidos", 401)
  }

  const passwordMatched = await compare(password, user.password)

  if (!passwordMatched) {
    throw new AppError("E-mail ou senha inválidos", 401)
  }

  // Usuário autenticado — próximo passo: gerar token
}
```

## Example

**Before (inseguro — revela qual campo falhou):**
```typescript
async create(request, response) {
  const { email, password } = request.body

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new AppError("Usuário não encontrado", 404)
  }

  if (password !== user.password) {
    throw new AppError("Senha incorreta", 400)
  }
}
```

**After (com esta skill aplicada):**
```typescript
async create(request, response) {
  const { email, password } = bodySchema.parse(request.body)

  const user = await prisma.user.findFirst({ where: { email } })

  if (!user) {
    throw new AppError("E-mail ou senha inválidos", 401)
  }

  const passwordMatched = await compare(password, user.password)

  if (!passwordMatched) {
    throw new AppError("E-mail ou senha inválidos", 401)
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Login endpoint | Sempre valide com Zod + compare com bcrypt |
| Erro de credencial | Sempre mensagem genérica, nunca especifique o campo |
| Busca por e-mail | Use `findFirst` com `where: { email }` |
| Senha no banco | Sempre está hasheada — use `bcrypt.compare`, nunca `===` |
| Status code de auth | 401 para credenciais inválidas |

## Anti-patterns

| Nunca escreva | Escreva isto |
|---------------|-------------|
| `"Usuário não encontrado"` | `"E-mail ou senha inválidos"` |
| `"Senha incorreta"` | `"E-mail ou senha inválidos"` |
| `password === user.password` | `await compare(password, user.password)` |
| `request.body` direto sem validar | `bodySchema.parse(request.body)` |
| `throw new AppError("...", 404)` para login | `throw new AppError("...", 401)` |
| `findUnique({ where: { email } })` | `findFirst({ where: { email } })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre segurança em autenticação e por que nunca revelar qual campo falhou
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e testes no Insomnia