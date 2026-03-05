---
name: rs-saas-nextjs-rbac-cascades-db
description: "Enforces correct cascade delete and set-null strategies on Prisma foreign key relations. Use when user asks to 'configure cascades', 'fix delete errors', 'setup onDelete', 'handle referential integrity', or encounters foreign key constraint errors on delete. Applies rules: cascade for owned children, setNull for optional cross-references, always migrate after changes. Make sure to use this skill whenever defining Prisma relations with onDelete behavior. Not for query optimization, indexing, or Prisma Client runtime usage."
---

# Cascades no Banco de Dados com Prisma

> Toda relacao com foreign key deve declarar explicitamente sua estrategia de onDelete — cascade para filhos dependentes, setNull para referencias opcionais.

## Rules

1. **Filhos dependentes usam cascade** — `onDelete: Cascade` em convites, membros e projetos de uma organizacao, porque deletar a organizacao sem deletar filhos causa erro de constraint
2. **Referencias opcionais usam setNull** — `onDelete: SetNull` quando o campo e opcional (ex: `author` de um convite), porque o registro pode existir sem a referencia
3. **Campos setNull devem ser opcionais** — se usa `onDelete: SetNull`, o campo deve ser declarado como `String?` (opcional), porque setNull em campo obrigatorio causa erro
4. **Accounts seguem o usuario** — `onDelete: Cascade` na relacao account-user, porque accounts nao fazem sentido sem o usuario
5. **Sempre rode migrate apos alterar cascades** — `npx prisma migrate dev`, porque alteracoes em onDelete geram ALTER TABLE nas foreign keys
6. **Use transactions para operacoes compostas** — ao resetar senha, use `prisma.$transaction()` para update + delete do token, porque garante atomicidade

## How to write

### Cascade em filhos de organizacao

```prisma
model Invite {
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  author         User?        @relation(fields: [authorId], references: [id], onDelete: SetNull)
}

model Member {
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Project {
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  owner          User         @relation(fields: [ownerId], references: [id], onDelete: SetNull)
}
```

### Transaction para reset de senha

```typescript
await prisma.$transaction([
  prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  }),
  prisma.token.delete({
    where: { id: tokenId },
  }),
])
```

## Example

**Before (sem cascade — erro ao deletar organizacao):**
```prisma
model Invite {
  organization   Organization @relation(fields: [organizationId], references: [id])
}
```

**After (com cascade — deleta filhos automaticamente):**
```prisma
model Invite {
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  author         User?        @relation(fields: [authorId], references: [id], onDelete: SetNull)
}
```

## Heuristics

| Situacao | Estrategia |
|----------|-----------|
| Registro nao faz sentido sem o pai | `onDelete: Cascade` |
| Registro pode existir sem a referencia | `onDelete: SetNull` (campo opcional) |
| Referencia e informativa (quem criou) | `onDelete: SetNull` |
| Registro de autenticacao (account, session) | `onDelete: Cascade` |
| Alterou onDelete no schema | Rodar `prisma migrate dev` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Omitir onDelete em relacoes | Declarar explicitamente Cascade ou SetNull |
| SetNull em campo obrigatorio (`String`) | Tornar o campo opcional (`String?`) |
| Deletar token de reset em operacao separada | Usar `prisma.$transaction()` |
| Alterar cascades sem migrar | Rodar `npx prisma migrate dev` apos mudancas |
| Deletar registros filhos manualmente antes do pai | Configurar cascade e deixar o banco resolver |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-ajustes-nos-cascades-do-banco-de-dados/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-ajustes-nos-cascades-do-banco-de-dados/references/code-examples.md)
