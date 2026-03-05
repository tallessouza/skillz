---
name: rs-saas-nextjs-rbac-rota-membros-org
description: "Applies patterns for building organization members listing routes in Fastify/Prisma APIs. Use when user asks to 'list members', 'get organization members', 'create members endpoint', 'fetch users from org', or builds any route that joins related entities and flattens nested objects. Enforces select+join pattern, destructuring rename for conflicting IDs, and Zod response schemas. Make sure to use this skill whenever creating API routes that return joined/nested data flattened into a single object. Not for frontend components, authentication flows, or database migrations."
---

# Rota de Listagem de Membros da Organizacao

> Ao criar rotas que retornam dados de entidades relacionadas, achatar objetos aninhados em um unico nivel e renomear campos conflitantes explicitamente.

## Rules

1. **Selecione apenas campos necessarios no Prisma** — use `select` explicito em vez de retornar tudo, porque reduz payload e evita expor dados sensiveis
2. **Use join via select no relacionamento** — `select: { user: { select: { id, name, email, avatarUrl } } }` em vez de `include`, porque `include` traz todos os campos
3. **Achate objetos aninhados com destructuring** — transforme `{ role, user: { name } }` em `{ role, name }`, porque o frontend nao precisa saber da estrutura do banco
4. **Renomeie IDs conflitantes na desestruturacao** — quando duas entidades tem `id`, renomeie com prefixo: `userId`, porque spread sobrescreve silenciosamente
5. **Ordene resultados por campo semantico** — `orderBy: { role: 'asc' }` agrupa roles iguais, porque facilita visualizacao sem logica extra no frontend
6. **Valide response com Zod incluindo refinamentos** — `z.string().email()`, `z.string().url().nullable()`, porque documenta a API e valida output

## How to write

### Rota de listagem com join e flatten

```typescript
app.withTypeProvider<ZodTypeProvider>().register(auth).get(
  '/organizations/:slug/members',
  {
    schema: {
      tags: ['Members'],
      summary: 'Get all organization members',
      params: z.object({ slug: z.string() }),
      response: {
        200: z.object({
          members: z.array(z.object({
            id: z.string().uuid(),
            userId: z.string().uuid(),
            role: roleSchema,
            name: z.string().nullable(),
            email: z.string().email(),
            avatarUrl: z.string().url().nullable(),
          })),
        }),
      },
    },
  },
  async (request) => {
    const { slug } = request.params
    const { membership, organization } = await request.getUserMembership(slug)
    const { cannot } = getUserPermissions(membership.userId, membership.role)

    if (cannot('get', 'User')) {
      throw new UnauthorizedError('You are not allowed to see organization members.')
    }

    const members = await prisma.member.findMany({
      select: {
        id: true,
        role: true,
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      where: { organizationId: organization.id },
      orderBy: { role: 'asc' },
    })

    const membersWithRoles = members.map(({ user, ...member }) => {
      const { id: userId, ...userData } = user
      return { ...userData, ...member, userId }
    })

    return { members: membersWithRoles }
  },
)
```

## Example

**Before (objeto aninhado, IDs conflitantes):**
```typescript
const members = await prisma.member.findMany({
  include: { user: true },
  where: { organizationId: organization.id },
})
// Resultado: { id: 'member-1', role: 'ADMIN', user: { id: 'user-1', name: 'Jo', ... } }
return { members }
```

**After (achatado, IDs renomeados):**
```typescript
const members = await prisma.member.findMany({
  select: {
    id: true,
    role: true,
    user: { select: { id: true, name: true, email: true, avatarUrl: true } },
  },
  where: { organizationId: organization.id },
  orderBy: { role: 'asc' },
})

const membersWithRoles = members.map(({ user, ...member }) => {
  const { id: userId, ...userData } = user
  return { ...userData, ...member, userId }
})
// Resultado: { id: 'member-1', userId: 'user-1', role: 'ADMIN', name: 'Jo', ... }
return { members: membersWithRoles }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Duas entidades com campo `id` no mesmo objeto | Renomeie com prefixo da entidade: `userId`, `memberId` |
| Relacionamento 1:1 no retorno | Achate com destructuring + spread |
| Relacionamento 1:N no retorno | Mantenha como array aninhado |
| Campo nullable (name, avatar) | Declare `.nullable()` no Zod |
| Campo com formato especifico | Use refinamento: `.email()`, `.url()`, `.uuid()` |
| Listagem precisa de agrupamento visual | `orderBy` pelo campo de agrupamento |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `include: { user: true }` | `select: { user: { select: { campos } } }` |
| `return { members }` com objetos aninhados | Achate com `.map()` antes de retornar |
| `{ ...user, ...member }` sem tratar ID | Renomeie `id` conflitante antes do spread |
| `orderBy: { createdAt: 'desc' }` para listagem de membros | `orderBy: { role: 'asc' }` para agrupar por funcao |
| Response schema sem tipos refinados | Use `.email()`, `.url()`, `.uuid()`, `.nullable()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-membros-da-organizacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-membros-da-organizacao/references/code-examples.md)
