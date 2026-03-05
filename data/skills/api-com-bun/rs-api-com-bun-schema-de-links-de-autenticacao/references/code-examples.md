# Code Examples: Schema de Links de Autenticação

## Schema completo da tabela authLinks

```typescript
// src/db/schema/auth-links.ts
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

## Export no index do schema

```typescript
// src/db/schema/index.ts
export * from './users'
export * from './auth-links'
// ... outros exports
```

## Comandos de migration

```bash
# Subir o banco de dados
docker compose up -d

# Gerar migration a partir do schema
bun generate

# Executar migrations no banco
bun migrate
```

## Migration gerada (exemplo)

```sql
CREATE TABLE IF NOT EXISTS "auth_links" (
  "id" text PRIMARY KEY NOT NULL,
  "code" text NOT NULL,
  "user_id" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "auth_links"
  ADD CONSTRAINT "auth_links_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;
```

## Estrutura das rotas (a serem implementadas nas próximas aulas)

```typescript
// Rota 1: Login — envia e-mail com magic link
// POST /auth/login
// Body: { email: string }
// Fluxo: busca user → cria authLink → envia email → retorna 200

// Rota 2: Callback — valida token e autentica
// GET /auth/callback?code=xxx
// Fluxo: busca authLink pelo code → valida → gera JWT → redireciona ao frontend
```

## Comparação: token no banco vs JWT

```typescript
// Token no banco (authLink.code) — usado UMA VEZ para validar o magic link
// Precisa estar no banco porque garante que FOI GERADO pela aplicação
const authLink = await db.insert(authLinks).values({
  code: createId(),
  userId: user.id,
}).returning()

// JWT — stateless, NÃO fica no banco
// Gerado DEPOIS que o magic link é validado
const token = jwt.sign({ userId: user.id }, secret)
```

## Variação: com expiração de link

```typescript
// Query para buscar authLink válido (não expirado)
const validLink = await db
  .select()
  .from(authLinks)
  .where(
    and(
      eq(authLinks.code, code),
      gte(authLinks.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // 7 dias
    )
  )
```