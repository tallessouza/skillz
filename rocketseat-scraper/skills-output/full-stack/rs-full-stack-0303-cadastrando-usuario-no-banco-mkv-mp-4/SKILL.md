---
name: rs-full-stack-cadastrando-usuario-no-banco
description: "Enforces user registration best practices with Prisma and Bcrypt when building signup endpoints, creating users in the database, hashing passwords, or checking for duplicate emails. Use when user asks to 'register a user', 'create signup route', 'hash password with bcrypt', 'check duplicate email', or 'save user to database'. Make sure to use this skill whenever implementing user creation flows with password storage. Not for login/authentication, session management, or JWT token generation."
---

# Cadastrando Usuário no Banco

> Antes de salvar um usuário, verifique duplicidade de e-mail e criptografe a senha — nunca armazene senha em texto plano.

## Rules

1. **Verifique e-mail duplicado antes de criar** — use `findFirst` com condição de e-mail, porque criar primeiro e tratar erro de unique constraint é menos legível e expõe detalhes internos
2. **Lance exceção customizada para duplicidade** — use `AppError` com mensagem em português para o front-end consumir diretamente, porque evita tradução no cliente
3. **Criptografe com bcrypt antes de salvar** — use `hash(password, 8)` com await, porque bcrypt retorna Promise e o salt round 8 é o mínimo aceitável para produção
4. **Instale tipagem como devDependency** — `@types/bcrypt -D`, porque tipagem não vai para produção
5. **Retorne status 201 sem body** — `res.status(201).end()`, porque criação bem-sucedida não precisa retornar o recurso inteiro
6. **Nunca retorne a senha (nem hash)** — exclua o campo password de qualquer resposta, porque vazamento de hash facilita ataques offline

## Steps

### Step 1: Verificar e-mail duplicado
```typescript
import prisma from "@/database/prisma"
import { AppError } from "@/utils/AppError"

const userWithSameEmail = await prisma.user.findFirst({
  where: { email }
})

if (userWithSameEmail) {
  throw new AppError("Já existe um usuário cadastrado com esse e-mail")
}
```

### Step 2: Criptografar a senha
```typescript
import { hash } from "bcrypt"

const hashedPassword = await hash(password, 8)
```

### Step 3: Criar o usuário no banco
```typescript
await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    role
  }
})

return res.status(201).end()
```

## Example

**Before (inseguro e sem validação):**
```typescript
app.post("/users", async (req, res) => {
  const { name, email, password, role } = req.body

  await prisma.user.create({
    data: { name, email, password, role }
  })

  return res.json({ message: "created" })
})
```

**After (com esta skill aplicada):**
```typescript
app.post("/users", async (req, res) => {
  const { name, email, password, role } = req.body

  const userWithSameEmail = await prisma.user.findFirst({
    where: { email }
  })

  if (userWithSameEmail) {
    throw new AppError("Já existe um usuário cadastrado com esse e-mail")
  }

  const hashedPassword = await hash(password, 8)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  })

  return res.status(201).end()
})
```

## Heuristics

| Situação | Ação |
|----------|------|
| Campo unique no schema (email) | Verificar duplicidade com `findFirst` antes de `create` |
| Senha recebida do usuário | Sempre `await hash(password, saltRounds)` antes de salvar |
| bcrypt retorna Promise | Sempre usar `await` — sem await retorna objeto Promise, não o hash |
| Mensagens de erro para o front-end | Escrever em português quando o front-end exibe diretamente |
| Criação bem-sucedida | Retornar 201 sem body |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| `prisma.user.create({ data: { password } })` (senha plana) | `hash(password, 8)` antes do create |
| `const h = hash(password, 8)` (sem await) | `const hashedPassword = await hash(password, 8)` |
| `return res.json(user)` (expõe hash) | `return res.status(201).end()` |
| `try { create } catch (unique error)` para duplicidade | `findFirst` + `throw AppError` antes do create |
| `@types/bcrypt` em dependencies | `npm i @types/bcrypt -D` (devDependency) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre bcrypt, salt rounds e fluxo de cadastro
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações