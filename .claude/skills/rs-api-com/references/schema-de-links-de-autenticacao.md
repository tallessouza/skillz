---
name: rs-api-com-bun-schema-auth-links
description: "Applies passwordless Magic Link schema design with Drizzle ORM. Use when user asks to 'create auth schema', 'implement magic link', 'design auth tables', 'passwordless auth database', or 'create auth_links table'. Generates auth_links with CUID2 tokens, user FK, timestamp. Make sure to use this skill whenever designing passwordless auth. Not for OAuth, session-based, or password auth (use rs-seguranca-para)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: auth
  tags: [magic-link, passwordless, auth, schema, drizzle]
---

# Schema de Links de Autenticacao (Magic Link)

> Passwordless via Magic Link — sem armazenar senhas.

## Rules

1. **Sem senhas** — passwordless elimina credenciais no banco
2. **Token no banco** — magic link precisa ser persistido
3. **FK para user** — obrigatoria, nunca nullable
4. **createdAt** — para expiracao futura
5. **CUID2 para tokens** — aleatorio e unico
6. **Login e callback separados**

## How to write

```typescript
export const authLinks = pgTable('auth_links', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  code: text('code').$defaultFn(() => createId()).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

## Troubleshooting

### Token nao unico
**Fix:** Use `$defaultFn(() => createId())` com arrow function.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
