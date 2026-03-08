---
name: rs-full-stack-cadastrando-usuario-no-banco
description: "Enforces secure user registration patterns with Prisma ORM when creating users in the database. Use when user asks to 'register a user', 'create user endpoint', 'sign up route', 'save user to database', or 'cadastrar usuario'. Applies rules: validate duplicate emails before insert, use AppError for domain errors, never return password in API response, use destructuring with spread to exclude sensitive fields. Make sure to use this skill whenever building user creation endpoints with Prisma. Not for authentication flows, login, JWT tokens, or session management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: backend
  tags: [prisma, user-registration, security, password, validation, node-js]
---

# Cadastrando Usuário no Banco

> Ao cadastrar um usuário, valide unicidade antes de inserir e nunca retorne campos sensíveis na resposta da API.

## Rules

1. **Valide duplicidade antes de criar** — use `findFirst` com o campo único antes do `create`, porque o erro do banco é genérico e não comunica a regra de negócio
2. **Lance AppError para erros de domínio** — `throw new AppError("User with same email already exists")`, porque erros de domínio devem ser tratados pelo error handler global, não pelo controller
3. **Nunca retorne a senha na resposta** — mesmo criptografada, a senha não deve aparecer no JSON de resposta, porque expõe informação sensível desnecessariamente
4. **Use destructuring com spread para excluir campos** — `const { password: _, ...userWithoutPassword } = user`, porque é a forma idiomática de remover propriedades sem mutação
5. **Passe o hash, não a senha original** — no `create`, use `hashedPassword` no campo `password`, porque a senha em texto plano nunca deve tocar o banco
6. **Retorne o objeto direto, não encapsulado** — `return res.json(userWithoutPassword)` não `res.json({ user })`, porque simplifica o consumo da API

## How to write

### Verificação de email duplicado

```typescript
const userWithSameEmail = await prisma.user.findFirst({
  where: { email }
})

if (userWithSameEmail) {
  throw new AppError("User with same email already exists")
}
```

### Criação do usuário com Prisma

```typescript
const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword
  }
})
```

### Exclusão da senha por destructuring

```typescript
const { password: _, ...userWithoutPassword } = user

return response.status(201).json(userWithoutPassword)
```

## Example

**Before (senha exposta na resposta):**

```typescript
async create(request, response) {
  const { name, email, password } = request.body

  const hashedPassword = await hash(password, 8)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  })

  return response.json(user)
  // ❌ Retorna: { id, name, email, password: "$2a$08...", role, created_at }
}
```

**After (com validação e senha removida):**

```typescript
async create(request, response) {
  const { name, email, password } = request.body

  const userWithSameEmail = await prisma.user.findFirst({
    where: { email }
  })

  if (userWithSameEmail) {
    throw new AppError("User with same email already exists")
  }

  const hashedPassword = await hash(password, 8)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  })

  const { password: _, ...userWithoutPassword } = user

  return response.status(201).json(userWithoutPassword)
  // ✅ Retorna: { id, name, email, role, created_at, updated_at }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo deve ser único (email, CPF) | `findFirst` + `AppError` antes do `create` |
| Resposta contém campo sensível | Destructuring com `_` para descartar |
| Múltiplos campos sensíveis | Destructure todos: `{ password: _, token: __, ...safe } = obj` |
| Conflito de nome na destructuring | Renomeie com `: _` para evitar shadowing |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `return res.json(user)` (com senha) | `const { password: _, ...safe } = user; return res.json(safe)` |
| `delete user.password` (mutação) | Destructuring com spread (sem mutação) |
| `try { await prisma.create() } catch` (para duplicidade) | `findFirst` + `AppError` (validação explícita) |
| `res.json({ message: "ok" })` após criar | `res.status(201).json(userWithoutPassword)` |


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Password visible in API response** | Use destructuring to exclude it: `const { password: _, ...safe } = user` and return `safe`. |
| **Duplicate email not caught** | Add `findFirst({ where: { email } })` before `create` and throw `AppError` if a match is found. |
| **Hash not applied to password** | Ensure `hashedPassword` (from bcrypt `hash()`) is passed to the `password` field, not the raw input. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre segurança de resposta e padrão de validação
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações