---
name: rs-node-js-2023-hash-senha-validacao
description: "Enforces password hashing with bcryptjs and email uniqueness validation when implementing user registration in Node.js. Use when user asks to 'create user registration', 'hash passwords', 'implement signup', 'validate unique email', or 'register endpoint'. Applies bcrypt hash with rounds, unique email check before insert, proper HTTP status codes. Make sure to use this skill whenever building authentication or user creation flows in Node.js. Not for login/session management, JWT tokens, or authorization middleware."
---

# Hash de Senha e Validação de Unicidade

> Sempre fazer hash da senha antes de persistir e validar unicidade de email antes de inserir usuario.

## Rules

1. **Nunca salve senha em texto puro** — use `bcryptjs` com `hash()`, porque senhas em plaintext vazam em qualquer breach do banco
2. **Use 6 rounds como padrão** — porque é o valor ótimo para operações infrequentes como cadastro; mais rounds = mais seguro mas mais pesado
3. **Ajuste rounds conforme frequência** — operações frequentes (muitas req/s) precisam de menos rounds para não sobrecarregar o servidor
4. **Valide email único ANTES de inserir** — use `findUnique` antes do `create`, porque o banco retorna erro 500 genérico se violar constraint unique
5. **Retorne 409 Conflict para duplicatas** — não 400 nem 500, porque 409 comunica semanticamente que o recurso já existe
6. **Hash é irreversível por design** — na autenticação futura, gere novo hash da senha informada e compare com o hash salvo

## How to write

### Hash de senha com bcryptjs

```typescript
import { hash } from 'bcryptjs'

const passwordHash = await hash(password, 6)

await prisma.user.create({
  data: {
    name,
    email,
    password_hash: passwordHash,
  },
})
```

### Validação de email único

```typescript
const userWithSameEmail = await prisma.user.findUnique({
  where: { email },
})

if (userWithSameEmail) {
  return reply.status(409).send()
}
```

## Example

**Before (sem hash, sem validação):**
```typescript
app.post('/users', async (request, reply) => {
  const { name, email, password } = request.body

  await prisma.user.create({
    data: { name, email, password_hash: password },
  })

  return reply.status(201).send()
})
```

**After (com hash e validação):**
```typescript
app.post('/users', async (request, reply) => {
  const { name, email, password } = request.body

  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWithSameEmail) {
    return reply.status(409).send()
  }

  const passwordHash = await hash(password, 6)

  await prisma.user.create({
    data: { name, email, password_hash: passwordHash },
  })

  return reply.status(201).send()
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Cadastro de usuário (operação infrequente) | 6 rounds de hash |
| Operação de alta frequência que precisa hash | Reduzir rounds (avaliar trade-off) |
| Campo com `@unique` no schema Prisma | Validar com `findUnique` antes do `create` |
| Registro duplicado detectado | Retornar 409 Conflict |
| Precisa verificar senha no login | `compare()` do bcryptjs, nunca tentar reverter o hash |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `password_hash: password` | `password_hash: await hash(password, 6)` |
| `create()` sem checar unicidade | `findUnique()` + check + `create()` |
| `reply.status(500)` para email duplicado | `reply.status(409).send()` |
| `hash(password, 20)` para cadastro comum | `hash(password, 6)` |
| Comparar strings de hash diretamente | Usar `compare()` do bcryptjs |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-hash-da-senha-e-validacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-hash-da-senha-e-validacao/references/code-examples.md)
