---
name: rs-api-com-bun-schema-auth-links
description: "Applies passwordless Magic Link authentication pattern when designing auth systems with Drizzle ORM and PostgreSQL. Use when user asks to 'create authentication', 'implement login', 'add magic link', 'passwordless auth', or 'design auth schema'. Generates auth_links table, login + callback route structure, and one-time token validation flow. Make sure to use this skill whenever building authentication without passwords in Node/Bun APIs. Not for OAuth/social login, session-based auth, or traditional email+password flows."
---

# Schema de Links de Autenticação (Magic Link)

> Autenticação passwordless via Magic Link: o usuário recebe um link no e-mail, clica, e está autenticado — sem armazenar senhas.

## Rules

1. **Nunca armazene senhas quando Magic Link é viável** — passwordless elimina credenciais sensíveis do banco, reduzindo superfície de ataque
2. **Salve o código de autenticação no banco** — diferente do JWT (stateless), o magic link token precisa ser persistido para validar que foi gerado pela aplicação
3. **Cada token pertence a um único usuário** — foreign key obrigatória para `users.id`, nunca nullable
4. **Salve `createdAt` no token** — permite expiração futura (ex: link válido por 1 semana) sem precisar alterar schema
5. **Use CUID2 ou UUID para tokens** — o código deve ser aleatório e único, nunca sequencial ou previsível
6. **Separe login e callback em rotas distintas** — login envia o e-mail, callback valida o token e gera JWT

## How to write

### Schema da tabela authLinks (Drizzle ORM)

```typescript
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { users } from './users'

export const authLinks = pgTable('auth_links', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  code: text('code')
    .$defaultFn(() => createId())
    .notNull(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### Estrutura de rotas de autenticação

```typescript
// POST /auth/login — recebe email, busca user, cria authLink, envia email
// GET /auth/callback?code=xxx — valida code, gera JWT, redireciona ao frontend
```

## Example

**Before (auth tradicional com senha):**
```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(), // credencial sensível
})
```

**After (passwordless com Magic Link):**
```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  // sem campo de senha
})

export const authLinks = pgTable('auth_links', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  code: text('code').$defaultFn(() => createId()).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

## Heuristics

| Situação | Ação |
|----------|------|
| App não precisa de login social complexo | Magic Link é a escolha mais simples |
| Precisa validar que o link veio da aplicação | Persistir token no banco (não usar apenas JWT) |
| Quer expiração de links | Usar `createdAt` + query com filtro temporal |
| Precisa de login via SMS/OTP | Mesmo padrão, mas `code` vira OTP numérico |
| Rodou migration após criar schema | `bun generate` → `bun migrate` |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| Token de auth sem foreign key para user | `userId.references(() => users.id).notNull()` |
| Token sequencial ou previsível | CUID2 ou UUID aleatório |
| Uma única rota para login + callback | Rota de login separada da rota de callback |
| Armazenar senha "por precaução" | Passwordless = zero senhas no banco |
| Magic link sem `createdAt` | Sempre salvar timestamp para expiração futura |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
