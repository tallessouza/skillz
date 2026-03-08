---
name: rs-saas-next-rbac-shutdown-org
description: "Enforces correct pattern for DELETE routes with CASL permission checking in Fastify APIs. Use when user asks to 'create a delete route', 'shutdown endpoint', 'remove resource route', 'delete with permissions', or 'CASL ability destructuring'. Applies bind fix for destructured CASL methods and 204 response pattern. Make sure to use this skill whenever creating delete/shutdown endpoints or destructuring CASL ability objects. Not for frontend components, GET routes, or database schema design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: api-routes
  tags: [saas, fastify, api, routes, prisma, nextjs, casl, rbac, zod, organization]
---

# Rota Delete com Verificacao de Permissoes (CASL + Fastify)

> Ao criar rotas DELETE com verificacao de permissao CASL, sempre use `.bind(ability)` ao desestruturar metodos `can`/`cannot`, porque a desestruturacao perde a referencia ao `this` interno.

## Rules

1. **Sempre use `.bind()` ao desestruturar ability** — `const cannot = ability.cannot.bind(ability)`, porque `can` e `cannot` usam `this` internamente e perdem a referencia quando desestruturados de um objeto
2. **DELETE retorna 204 sem body** — rotas de exclusao retornam status 204 (No Content), sem dados no response
3. **Reutilize verificacao de permissao da rota Update** — a logica de permissao de delete e identica a de update: buscar membership, organization, e verificar ability
4. **Nao inclua body no schema de DELETE** — diferente de PUT/POST, rotas DELETE nao recebem body, apenas params (slug)

## How to write

### Rota DELETE com permissao

```typescript
// Rota de shutdown/delete segue o mesmo padrao de verificacao da rota update
app.withTypeProvider<ZodTypeProvider>().register(auth).delete(
  '/organizations/:slug',
  {
    schema: {
      tags: ['Organizations'],
      summary: 'Shutdown organization',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
      }),
      response: {
        204: z.null(),
      },
    },
  },
  async (request, reply) => {
    const { slug } = request.params
    const userId = await request.getCurrentUserId()
    const { membership, organization } = await request.getUserMembership(slug)

    const { cannot } = getUserPermissions(userId, membership.role)

    if (cannot('delete', 'Organization')) {
      throw new UnauthorizedError('You are not allowed to shutdown this organization.')
    }

    await prisma.organization.delete({
      where: { id: organization.id },
    })

    return reply.status(204).send()
  }
)
```

### Fix do bind para CASL

```typescript
// ERRADO: desestruturar perde o this
const { can, cannot } = ability  // cannot() vai dar "cannot read properties of undefined"

// CORRETO: bind preserva o this
const can = ability.can.bind(ability)
const cannot = ability.cannot.bind(ability)
```

## Example

**Before (bug — cannot read properties of undefined reading 'can'):**
```typescript
export function getUserPermissions(userId: string, role: Role) {
  const ability = defineAbilityFor({ id: userId, role })
  return ability  // desestruturacao no caller perde this
}

// No caller:
const { cannot } = getUserPermissions(userId, membership.role)
cannot('delete', 'Organization')  // ERRO: this e undefined
```

**After (com bind):**
```typescript
export function getUserPermissions(userId: string, role: Role) {
  const ability = defineAbilityFor({ id: userId, role })
  return {
    can: ability.can.bind(ability),
    cannot: ability.cannot.bind(ability),
  }
}

// No caller:
const { cannot } = getUserPermissions(userId, membership.role)
cannot('delete', 'Organization')  // Funciona: this referencia ability
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criando rota DELETE | Copie estrutura da rota UPDATE, remova body e troque permissao para `delete` |
| Desestruturando metodos de objeto com `this` | Use `.bind(objeto)` antes de desestruturar |
| Response de delete bem-sucedido | Retorne 204 sem body |
| Erro de "cannot read properties of undefined" em CASL | Verifique se `can`/`cannot` foram desestruturados sem bind |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `const { can, cannot } = ability` | `const can = ability.can.bind(ability)` |
| `return reply.status(200).send({ deleted: true })` | `return reply.status(204).send()` |
| Duplicar toda logica de verificacao de permissao | Reutilizar pattern de getUserMembership + getUserPermissions |
| Body schema em rota DELETE | Apenas params schema com slug |

## Troubleshooting

### Rota retorna 404
**Symptom:** Endpoint nao encontrado mesmo apos definir a rota
**Cause:** Rota nao foi registrada com `app.register()` no server.ts
**Fix:** Adicione `app.register(nomeDaRota)` no arquivo do servidor

### Permissao retorna resultado inesperado
**Symptom:** `ability.can()` retorna valor incorreto
**Cause:** A role do usuario nao esta mapeada corretamente ou o subject nao tem __typename
**Fix:** Verifique que `defineAbilityFor` recebe o usuario com role correta e que objetos tem `__typename`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
