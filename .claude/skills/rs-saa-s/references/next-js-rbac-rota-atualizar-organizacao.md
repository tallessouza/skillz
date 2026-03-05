---
name: rs-saas-nextjs-rbac-rota-atualizar-org
description: "Applies CASL permission-checking pattern when building protected API routes in Next.js/Fastify SaaS apps. Use when user asks to 'create a protected route', 'check user permissions', 'update organization', 'verify authorization', or 'implement RBAC in route'. Enforces: model parsing with Zod before permission check, cannot() with object (never string), getUserPermissions abstraction, domain uniqueness excluding current entity. Make sure to use this skill whenever implementing routes that require authorization verification. Not for frontend permission checks, UI conditional rendering, or CASL package setup."
---

# Rota Protegida com Verificacao de Permissao (CASL)

> Toda rota que exige permissao deve: parsear models com Zod, verificar com cannot() passando objeto (nunca string), e abstrair em getUserPermissions.

## Rules

1. **Parse models antes de verificar permissao** — use `userSchema.parse()` e `organizationSchema.parse()` antes de chamar `defineAbilityFor`, porque o CASL precisa dos atributos (ABAC) para condicoes como "dono da organizacao"
2. **Sempre passe objeto no cannot(), nunca string** — `cannot('update', authOrganization)` nao `cannot('update', 'Organization')`, porque com string o CASL verifica permissao generica e ignora condicoes como ownerId
3. **Abstraia em getUserPermissions** — extraia a criacao do authUser + defineAbilityFor para `utils/get-user-permissions.ts`, porque toda rota protegida repete esse codigo
4. **Use slug na URL, id no banco** — slug fica visivel na URL e e indexado, mas updates usam id internamente, porque slugs podem mudar
5. **Exclua a propria entidade em validacoes de unicidade** — ao verificar dominio unico, adicione `id: { not: organization.id }` no WHERE, porque o proprio registro atual daria falso positivo
6. **Nao atualize slug automaticamente** — slug gerado na criacao nao deve mudar ao atualizar nome, porque links salvos como favoritos quebrariam

## How to write

### Verificacao de permissao em rota

```typescript
import { getUserPermissions } from '@/utils/get-user-permissions'
import { organizationSchema } from '@saas/auth'

// Dentro do handler da rota
const { membership, organization } = await getUserMembership(slug)
const { cannot } = getUserPermissions(userId, membership.role)

const authOrganization = organizationSchema.parse(organization)

if (cannot('update', authOrganization)) {
  throw new UnauthorizedError('You are not allowed to update this organization.')
}
```

### getUserPermissions (utils)

```typescript
import { defineAbilityFor, userSchema, type Role } from '@saas/auth'

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({ id: userId, role })
  const ability = defineAbilityFor(authUser)
  return ability
}
```

### Validacao de dominio excluindo entidade atual

```typescript
if (domain) {
  const organizationByDomain = await prisma.organization.findFirst({
    where: {
      domain,
      id: { not: organization.id },
    },
  })

  if (organizationByDomain) {
    throw new BadRequestError('Another organization with same domain already exists.')
  }
}
```

### Update sem alterar slug

```typescript
await prisma.organization.update({
  where: { id: organization.id },
  data: { name, domain, shouldAttachUsersByDomain },
})

return reply.status(204).send()
```

## Example

**Before (erro comum — string no cannot):**
```typescript
const { cannot } = defineAbilityFor(authUser)
if (cannot('update', 'Organization')) {
  // BUG: isso verifica permissao GENERICA
  // nunca entra no if porque o usuario PODE atualizar organizacoes dele
  throw new UnauthorizedError('...')
}
```

**After (com objeto — ABAC funciona):**
```typescript
const authOrganization = organizationSchema.parse(organization)
if (cannot('update', authOrganization)) {
  // CORRETO: CASL compara ownerId com userId
  throw new UnauthorizedError('...')
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota precisa verificar se usuario e dono | Parse organization com schema, passe objeto no cannot() |
| Campo unico sendo validado em update | Adicione `id: { not: entity.id }` no WHERE |
| Mesmo codigo de permissao em multiplas rotas | Extraia para getUserPermissions |
| findUnique com multiplas condicoes no WHERE | Use findFirst, porque findUnique so aceita indices unicos |
| Resposta de update sem body | Retorne status 204 com z.null() no schema |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `cannot('update', 'Organization')` | `cannot('update', authOrganization)` |
| `findUnique({ where: { domain, slug: { not } } })` | `findFirst({ where: { domain, id: { not } } })` |
| Permissao inline repetida em cada rota | `getUserPermissions(userId, role)` |
| Update que regenera slug do nome | Mantenha slug original, crie rota separada se necessario |
| `organizationSchema.parse({ id, ownerId })` quando objeto ja tem os campos | `organizationSchema.parse(organization)` — Zod extrai so o necessario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-atualizar-organizacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-atualizar-organizacao/references/code-examples.md)
