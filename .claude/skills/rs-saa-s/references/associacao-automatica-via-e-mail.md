---
name: rs-saas-nextjs-rbac-auto-join-email
description: "Applies automatic organization association via email domain when implementing user registration in multi-tenant SaaS apps. Use when user asks to 'create account route', 'auto-join organization', 'associate user by email domain', 'implement signup with org matching', or 'multi-tenant registration'. Ensures new users are automatically linked to organizations whose domain matches their email. Make sure to use this skill whenever building registration flows in multi-tenant systems. Not for authentication, login, password recovery, or RBAC permission checks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: geral
  tags: [saas, prisma, nextjs]
---

# Associacao Automatica via E-mail

> Ao criar uma conta em app multi-tenant, verificar o dominio do e-mail e associar automaticamente o usuario a organizacoes que tenham aquele dominio configurado.

## Rules

1. **Extraia o dominio do e-mail com split no @** — `email.split('@')` e use o segundo elemento, porque o dominio e tudo apos o arroba
2. **Busque organizacoes com match de dominio E flag ativa** — consulte onde `domain = dominio` AND `shouldAttachUsersByDomain = true`, porque ambas condicoes sao necessarias para auto-join
3. **Use creates encadeados do Prisma** — passe `member_on` no create do usuario para criar o registro de membro atomicamente, porque evita inconsistencia entre tabelas
4. **Use `undefined` para campo opcional ausente** — quando nao ha organizacao para auto-join, passe `undefined` no campo `member_on`, porque o Prisma ignora campos `undefined`
5. **Use a role padrao do schema** — nao informe role explicitamente no auto-join, porque o default `MEMBER` ja esta definido no schema e e o correto para auto-join
6. **Execute apos validacao de email unico** — a logica de auto-join vem depois de confirmar que nao existe usuario com aquele email, porque o usuario precisa ser novo

## How to write

### Extrair dominio e buscar organizacao

```typescript
const [, domain] = email.split('@')

const autoJoinOrganization = await prisma.organization.findFirst({
  where: {
    domain,
    shouldAttachUsersByDomain: true,
  },
})
```

### Create encadeado com member_on

```typescript
const user = await prisma.user.create({
  data: {
    name,
    email,
    passwordHash,
    member_on: autoJoinOrganization
      ? {
          create: {
            organizationId: autoJoinOrganization.id,
          },
        }
      : undefined,
  },
})
```

## Example

**Before (sem auto-join):**
```typescript
const user = await prisma.user.create({
  data: {
    name,
    email,
    passwordHash,
  },
})
// Usuario criado sem nenhuma associacao
```

**After (com auto-join por dominio):**
```typescript
const [, domain] = email.split('@')

const autoJoinOrganization = await prisma.organization.findFirst({
  where: {
    domain,
    shouldAttachUsersByDomain: true,
  },
})

const user = await prisma.user.create({
  data: {
    name,
    email,
    passwordHash,
    member_on: autoJoinOrganization
      ? {
          create: {
            organizationId: autoJoinOrganization.id,
          },
        }
      : undefined,
  },
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App multi-tenant com dominios corporativos | Implemente auto-join na criacao de conta |
| Flag `shouldAttachUsersByDomain` nao existe no schema | Adicione antes de implementar auto-join |
| Multiplas organizacoes com mesmo dominio | `findFirst` retorna a primeira — considere `findMany` e associar a todas |
| Role de auto-join deve ser diferente de MEMBER | Passe `role` explicitamente no create |
| Organizacao sem dominio configurado | `findFirst` retorna null, `undefined` no member_on, sem efeito |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar usuario e depois fazer update para associar | Use create encadeado do Prisma (atomico) |
| `email.substring(email.indexOf('@'))` | `email.split('@')[1]` (mais limpo) |
| Hardcode da role no auto-join | Use o default do schema Prisma |
| Auto-join sem checar `shouldAttachUsersByDomain` | Sempre verifique a flag junto com o dominio |
| Buscar organizacao sem filtrar pela flag | Combine `domain` + `shouldAttachUsersByDomain: true` no where |

## Troubleshooting

### Erro de foreign key constraint
**Symptom:** Prisma lanca erro ao criar registro com referencia invalida
**Cause:** O ID referenciado nao existe na tabela relacionada
**Fix:** Verifique que o registro pai existe antes de criar o registro filho

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
