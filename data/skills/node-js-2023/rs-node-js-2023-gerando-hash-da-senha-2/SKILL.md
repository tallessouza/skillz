---
name: rs-node-js-2023-hash-senha
description: "Enforces password hashing with bcryptjs before storing in database. Use when user asks to 'create user registration', 'save password', 'implement signup', 'store credentials', or any authentication flow that persists passwords. Applies bcryptjs hash with salt rounds, never stores plaintext passwords. Make sure to use this skill whenever implementing any user creation or password storage logic. Not for password comparison/verification, session management, or JWT token generation."
---

# Gerando Hash da Senha

> Nunca salvar senhas em plaintext — sempre aplicar hash com bcryptjs antes de persistir no banco de dados.

## Rules

1. **Sempre fazer hash antes de salvar** — use `hash()` do bcryptjs antes de qualquer `create()` ou `insert()` no banco, porque senhas em plaintext sao uma vulnerabilidade critica
2. **Use bcryptjs (nao bcrypt)** — bcryptjs e a implementacao JavaScript pura, mais recomendada no ecossistema Node.js, porque nao requer compilacao nativa
3. **Use 8 salt rounds como padrao** — 8 e o padrao do bcryptjs, equilibra seguranca e performance, porque cada round adicional dobra o tempo de computacao
4. **Nunca armazene o salt separadamente** — bcryptjs embute o salt no hash resultante, porque o formato `$2a$08$...` ja contem tudo necessario para verificacao
5. **Await a funcao hash** — `hash()` retorna uma Promise, porque o processo de hashing e computacionalmente intensivo e deve ser async

## How to write

### Hash na criacao de usuario

```typescript
import { hash } from 'bcryptjs'

// Antes de salvar no banco, gerar o hash
const hashedPassword = await hash(password, 8)

await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
  },
})
```

### Em um controller NestJS

```typescript
import { hash } from 'bcryptjs'

@Post('/accounts')
async create(@Body() body: CreateAccountDto) {
  const { name, email, password } = body

  const hashedPassword = await hash(password, 8)

  await this.prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })
}
```

## Example

**Before (vulneravel):**
```typescript
await prisma.user.create({
  data: {
    name,
    email,
    password, // plaintext — NUNCA fazer isso
  },
})
```

**After (com hash):**
```typescript
import { hash } from 'bcryptjs'

const hashedPassword = await hash(password, 8)

await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
  },
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Criando usuario novo | Sempre hash antes de salvar |
| Salt rounds em producao | 8 e suficiente, 10 para apps de alta seguranca |
| Performance importa muito | Nao reduza abaixo de 8, otimize outras partes |
| Precisando comparar senha depois | Use `compare()` do bcryptjs (nao refaca hash) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `password: body.password` (direto no create) | `password: await hash(body.password, 8)` |
| `hash(password, 'mySaltString')` (salt fixo) | `hash(password, 8)` (salt rounds numerico) |
| `const hashed = hash(password, 8)` (sem await) | `const hashed = await hash(password, 8)` |
| `import bcrypt from 'bcrypt'` (nativo) | `import { hash } from 'bcryptjs'` (JS puro) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
