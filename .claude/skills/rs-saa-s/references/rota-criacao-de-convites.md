---
name: rs-saas-nextjs-rbac-criacao-convites
description: "Enforces invite creation patterns for SaaS multi-tenant applications. Use when user asks to 'create invite route', 'implement invitation system', 'add member invite', 'build invite endpoint', or any multi-tenant invite flow. Applies rules: auto-join domain blocking, duplicate invite prevention, existing member check, author tracking. Make sure to use this skill whenever building invite or membership features in SaaS apps. Not for authentication flows, user registration, or front-end invite acceptance UI."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: api-routes
  tags: [saas, fastify, api, routes, prisma, nextjs, invites, members]
---

# Rota de Criacao de Convites (SaaS Multi-Tenant)

> Antes de criar um convite, valide tres barreiras: dominio com auto-join, convite duplicado, e membro existente.

## Rules

1. **Bloqueie convites para dominios com auto-join** — se a organizacao tem `shouldAttachUsersByDomain` ativo e o dominio do e-mail coincide, rejeite o convite, porque o usuario ja sera associado automaticamente ao fazer login
2. **Impeca convites duplicados** — use indice unico `[email, organizationId]` e verifique antes de criar, porque dois convites para o mesmo e-mail na mesma org geram confusao
3. **Verifique membros existentes** — busque na tabela `member` se ja existe usuario com aquele e-mail na org, porque convidar quem ja e membro e erro de logica
4. **Body minimo: email + role** — nome nao entra no convite, porque se o usuario ja tem conta usa o nome dela, se nao tem vai informar ao criar conta
5. **Rastreie o autor** — grave `authorId` (quem convidou), nao `userId` generico, porque nomear pelo papel melhora legibilidade do schema

## How to write

### Validacao de dominio auto-join

```typescript
const [, domain] = email.split('@')

if (
  organization.shouldAttachUsersByDomain &&
  organization.domain === domain
) {
  throw new BadRequestError(
    `Users with ${domain} domain will join your organization automatically on login.`
  )
}
```

### Prevencao de convite duplicado

```typescript
const inviteWithSameEmail = await prisma.invite.findUnique({
  where: {
    email_organizationId: {
      email,
      organizationId: organization.id,
    },
  },
})

if (inviteWithSameEmail) {
  throw new BadRequestError(
    'Another invite with same e-mail already exists.'
  )
}
```

### Verificacao de membro existente

```typescript
const memberWithSameEmail = await prisma.member.findFirst({
  where: {
    organizationId: organization.id,
    user: { email },
  },
})

if (memberWithSameEmail) {
  throw new BadRequestError(
    'A member with this e-mail already belongs to your organization.'
  )
}
```

### Criacao final

```typescript
const invite = await prisma.invite.create({
  data: {
    organizationId: organization.id,
    email,
    role,
    authorId: userId,
  },
})

return reply.status(201).send({ inviteId: invite.id })
```

## Example

**Before (sem validacoes):**
```typescript
app.post('/organizations/:slug/invites', async (request, reply) => {
  const { email, role } = request.body
  const invite = await prisma.invite.create({
    data: { email, role, organizationId: org.id, userId: user.id },
  })
  return reply.send({ inviteId: invite.id })
})
```

**After (com as tres barreiras):**
```typescript
app.post('/organizations/:slug/invites', async (request, reply) => {
  const { email, role } = request.body
  const { membership, organization } = await request.getUserMembership(slug)
  // 1. Dominio auto-join
  const [, domain] = email.split('@')
  if (organization.shouldAttachUsersByDomain && organization.domain === domain) {
    throw new BadRequestError(`Users with ${domain} domain will join automatically.`)
  }
  // 2. Convite duplicado
  const existing = await prisma.invite.findUnique({
    where: { email_organizationId: { email, organizationId: organization.id } },
  })
  if (existing) throw new BadRequestError('Invite already exists.')
  // 3. Membro existente
  const member = await prisma.member.findFirst({
    where: { organizationId: organization.id, user: { email } },
  })
  if (member) throw new BadRequestError('Already a member.')
  // Criar
  const invite = await prisma.invite.create({
    data: { organizationId: organization.id, email, role, authorId: userId },
  })
  return reply.status(201).send({ inviteId: invite.id })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Org tem auto-join por dominio | Bloqueie convite para mesmo dominio |
| Precisa buscar por indice composto unico | Use `findUnique` com o nome do indice |
| Precisa buscar por relacao aninhada (user.email) | Use `findFirst` com `where` aninhado |
| Campo referencia um usuario com papel especifico | Nomeie pelo papel: `authorId`, nao `userId` |
| Body do convite | Apenas `email` e `role`, sem `name` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `userId` no campo de quem criou convite | `authorId` — descreve o papel |
| `findFirst` para busca por indice unico | `findUnique` com indice composto |
| Criar convite sem checar dominio auto-join | Validar dominio ANTES de criar |
| Aceitar `name` no body do convite | Omitir — nome vem da conta do usuario |
| Retornar `200` para criacao | Retornar `201` com `inviteId` |

## Troubleshooting

### Comportamento inesperado apos implementar
**Symptom:** Feature funciona parcialmente ou com erros intermitentes
**Cause:** Dependencia nao instalada ou configuracao incompleta
**Fix:** Verifique que todas as dependencias estao instaladas com `pnpm install` e que o servidor foi reiniciado

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
