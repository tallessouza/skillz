---
name: rs-full-stack-recuperando-usuario
description: "Enforces secure user retrieval and password verification patterns when implementing authentication with Prisma and bcrypt. Use when user asks to 'implement login', 'authenticate user', 'verify credentials', 'recover user by email', or 'compare passwords'. Applies rules: generic error messages for auth failures, findFirst by email, bcrypt compare for password, 401 status for unauthorized. Make sure to use this skill whenever building authentication flows that query users from database. Not for registration, password reset, JWT token generation, or session management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [prisma, bcrypt, authentication, login, security, error-handling]
---

# Recuperando o Usuário na Autenticação

> Ao autenticar, recupere o usuário pelo e-mail com Prisma e compare senhas com bcrypt, sempre usando mensagens genéricas para não revelar qual campo está incorreto.

## Rules

1. **Use findFirst para buscar por e-mail** — `prisma.user.findFirst({ where: { email } })`, porque findFirst retorna null quando não encontra (sem exceção)
2. **Lance exceção genérica quando usuário não existe** — "E-mail ou senha inválido" com status 401, porque revelar que o e-mail não existe facilita ataques de enumeração
3. **Compare senhas com bcrypt.compare** — `compare(senhaRecebida, user.password)`, porque a senha no banco está hasheada e compare faz a verificação segura
4. **Use a mesma mensagem para senha incorreta** — exatamente a mesma string "E-mail ou senha inválido" com 401, porque mensagens diferentes revelam qual campo está errado
5. **Importe Prisma do módulo de database** — `import { prisma } from "@/database/prisma"`, porque centraliza a instância do client

## How to write

### Busca do usuário e verificação de senha

```typescript
import { prisma } from "@/database/prisma"
import { compare } from "bcrypt"
import { AppError } from "@/utils/AppError"

// No controller de autenticação (sessions)
const user = await prisma.user.findFirst({
  where: { email },
})

if (!user) {
  throw new AppError("E-mail ou senha inválido", 401)
}

const passwordMatch = await compare(password, user.password)

if (!passwordMatch) {
  throw new AppError("E-mail ou senha inválido", 401)
}
```

## Example

**Before (inseguro — revela informação):**
```typescript
const user = await prisma.user.findFirst({ where: { email } })

if (!user) {
  throw new AppError("Usuário não encontrado", 404)
}

const passwordMatch = await compare(password, user.password)

if (!passwordMatch) {
  throw new AppError("Senha incorreta", 401)
}
```

**After (com esta skill aplicada):**
```typescript
const user = await prisma.user.findFirst({ where: { email } })

if (!user) {
  throw new AppError("E-mail ou senha inválido", 401)
}

const passwordMatch = await compare(password, user.password)

if (!passwordMatch) {
  throw new AppError("E-mail ou senha inválido", 401)
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Usuário não encontrado no login | 401 com mensagem genérica (nunca 404) |
| Senha não bate | 401 com mesma mensagem genérica |
| Precisa comparar senha hasheada | `compare()` do bcrypt (nunca comparação direta) |
| Busca por campo único (email) | `findFirst` com `where` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `"Usuário não encontrado"` (no login) | `"E-mail ou senha inválido"` |
| `"Senha incorreta"` | `"E-mail ou senha inválido"` |
| `throw new AppError(..., 404)` (no login) | `throw new AppError(..., 401)` |
| `if (password === user.password)` | `if (!(await compare(password, user.password)))` |
| Mensagens diferentes para email/senha errados | Mesma mensagem genérica para ambos |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `Cannot find module 'bcrypt'` | Pacote não instalado | `npm i bcrypt && npm i -D @types/bcrypt` |
| `compare` retorna false mesmo com senha correta | Ordem dos argumentos invertida | Usar `compare(senhaDigitada, user.password)` — plana primeiro, hash depois |
| Erro revela se email existe ou não | Mensagens de erro diferentes para email/senha | Usar mesma mensagem "E-mail ou senha inválido" para ambos os casos |
| Status 404 no login quando usuário não existe | Usando 404 em vez de 401 | Sempre usar status 401 para falhas de autenticação |
| `findFirst` retorna null mas não lança erro | Comportamento esperado do Prisma | Verificar `if (!user)` manualmente e lançar AppError |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre segurança em autenticação e enumeração de usuários
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações