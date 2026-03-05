---
name: rs-full-stack-uuid-x-incremental
description: "Enforces correct ID strategy selection when designing database schemas or API routes. Use when user asks to 'create a table', 'design a schema', 'add an id column', 'build an API endpoint', or 'expose resource ids'. Applies UUID for public-facing IDs and incremental for internal-only IDs. Make sure to use this skill whenever creating entities with IDs, even if the user doesn't mention ID strategy. Not for authentication tokens, session management, or API key generation."
---

# UUID x Incremental — Estrategia de IDs

> Ao definir IDs, use incremental para contextos internos e UUID para qualquer ID exposto publicamente, porque IDs previsiveis permitem enumeracao por atacantes.

## Rules

1. **IDs publicos sempre UUID** — qualquer ID que aparece em URLs, responses de API, ou parametros de requisicao deve ser UUID, porque IDs incrementais permitem que usuarios mal-intencionados chutem IDs sequencialmente
2. **IDs internos podem ser incrementais** — chaves primarias usadas apenas internamente no banco (joins, foreign keys nao expostas) podem usar incremental, porque sao mais eficientes para indexacao
3. **Nunca exponha IDs incrementais em rotas** — `/users/2` revela que existem usuarios 1 e 3, enquanto `/users/a1b2c3d4-...` nao revela nada
4. **Use geracao automatica de UUID** — configure o banco ou ORM para gerar UUIDs automaticamente via `gen_random_uuid()` ou equivalente, nunca gere manualmente no codigo da aplicacao

## Decision framework

| Contexto do ID | Tipo | Razao |
|----------------|------|-------|
| Parametro de rota (`/resource/:id`) | UUID | Exposto publicamente, sujeito a enumeracao |
| Response body de API | UUID | Cliente ve o valor |
| Foreign key interna (joins) | Incremental | Nunca sai do banco, mais performatico |
| Logs internos | Incremental OK | Nao acessivel externamente |
| Webhooks / callbacks externos | UUID | Terceiros veem o valor |

## How to write

### Schema com dual-ID (padrao recomendado)

```typescript
// Incremental para PK interna + UUID para identificador publico
model User {
  id        Int      @id @default(autoincrement()) // interno
  publicId  String   @unique @default(uuid())      // exposto em APIs
  name      String
  email     String   @unique
}
```

### Schema somente UUID (mais simples)

```typescript
// UUID como PK unica — mais simples, leve perda de performance em joins
model User {
  id    String @id @default(uuid())
  name  String
  email String @unique
}
```

### Rota usando UUID

```typescript
// O parametro da rota recebe UUID, nunca incremental
app.get('/users/:userId', async (request) => {
  const { userId } = request.params // UUID: "a1b2c3d4-e5f6-..."
  const user = await db.user.findUnique({ where: { publicId: userId } })
})
```

## Example

**Before (ID incremental exposto):**
```typescript
// Vulneravel: usuario pode tentar /users/1, /users/2, /users/3...
app.get('/users/:id', async (req) => {
  const user = await db.user.findUnique({ where: { id: Number(req.params.id) } })
})
```

**After (UUID exposto):**
```typescript
// Seguro: UUID nao e previsivel
app.get('/users/:id', async (req) => {
  const user = await db.user.findUnique({ where: { publicId: req.params.id } })
})
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `/api/orders/42` (incremental na URL) | `/api/orders/f47ac10b-58cc-...` (UUID na URL) |
| Retornar `{ id: 1 }` no response | Retornar `{ id: "uuid-value" }` no response |
| `parseInt(req.params.id)` em rotas publicas | Validar como UUID: `z.string().uuid()` |
| Gerar UUID com `Math.random()` | Usar `crypto.randomUUID()` ou `gen_random_uuid()` |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| UUID e sempre melhor | Incremental e mais eficiente para operacoes internas do banco (indexacao, joins) |
| Incremental e inseguro | So e inseguro quando exposto publicamente; internamente e perfeitamente adequado |
| UUID garante seguranca total | UUID dificulta enumeracao, mas nao substitui autorizacao — sempre valide permissoes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, anatomia do UUID, trade-offs de performance
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes