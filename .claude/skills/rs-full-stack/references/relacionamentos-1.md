---
name: rs-full-stack-relacionamentos-1
description: "Enforces Prisma ORM relationship patterns when defining database schemas with foreign keys and relations. Use when user asks to 'create a relationship', 'add foreign key', 'connect tables', 'define one-to-many', or 'setup Prisma schema relations'. Applies rules: always define both sides of relation, use @relation with fields/references, handle migration failures from existing invalid data. Make sure to use this skill whenever creating or modifying Prisma schema relationships. Not for raw SQL migrations, query building, or non-Prisma ORMs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: prisma-orm
  tags: [prisma, relationships, foreign-key, one-to-many, orm, schema]
---

# Relacionamentos no Prisma ORM

> Sempre defina relacionamentos nos dois lados do schema para garantir integridade referencial e permitir navegacao bidirecional.

## Rules

1. **Defina ambos os lados da relacao** — o modelo filho tem o campo `@relation(fields: [...], references: [...])` e o modelo pai tem o campo de array, porque o Prisma exige a declaracao bidirecional para compilar o schema
2. **Use `@relation` com fields e references explícitos** — `fields` aponta para a foreign key no modelo atual, `references` aponta para a primary key do modelo referenciado, porque isso torna a integridade referencial explicita
3. **Normalize dados existentes antes de migrar** — registros com foreign keys invalidas bloqueiam a migration, porque o banco rejeita constraints sobre dados inconsistentes
4. **Diferencie one-to-one de one-to-many pelo array** — `Question[]` (array) = one-to-many, `Question` (sem array) = one-to-one, porque o tipo do campo define a cardinalidade
5. **Reinicie o Prisma Studio apos mudancas no schema** — alteracoes estruturais nao aparecem no Studio sem reiniciar, porque ele cacheia o schema na inicializacao

## How to write

### One-to-many relationship

```prisma
model User {
  id        String     @id @default(uuid())
  name      String
  questions Question[] // lado pai: array indica one-to-many
}

model Question {
  id      String @id @default(uuid())
  title   String
  userId  String @map("user_id")
  user    User   @relation(fields: [userId], references: [id]) // lado filho
}
```

### Migration apos adicionar relacao

```bash
npx prisma migrate dev --name add-relations
```

## Example

**Before (sem relacionamento — permite dados inconsistentes):**

```prisma
model User {
  id   String @id @default(uuid())
  name String
}

model Question {
  id     String @id @default(uuid())
  title  String
  userId String @map("user_id") // sem restricao, aceita qualquer valor
}
```

**After (com relacionamento — integridade garantida):**

```prisma
model User {
  id        String     @id @default(uuid())
  name      String
  questions Question[] // navegacao: user.questions
}

model Question {
  id     String @id @default(uuid())
  title  String
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id])
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Migration falha por violacao de FK | Delete registros invalidos primeiro, depois re-execute a migration |
| Precisa ver relacionamentos visualmente | Use `npx prisma studio` e clique nos campos de relacao |
| Mudou schema e Studio nao reflete | Pare e reinicie o Prisma Studio |
| Um usuario tem muitas perguntas | Use `Question[]` (array) no modelo User |
| Um perfil pertence a um usuario | Use `Profile` (sem array) para one-to-one |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Deixar FK sem `@relation` | Sempre adicione `@relation(fields, references)` |
| Definir relacao so em um modelo | Defina nos dois modelos (pai e filho) |
| Migrar sem limpar dados invalidos | Normalize dados antes de `migrate dev` |
| Usar string literal como FK sem validacao | Deixe o Prisma enforcar a constraint |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Migration falha com erro de FK | Dados existentes referenciam IDs inexistentes | Delete registros invalidos antes de rodar `migrate dev` |
| Prisma Studio nao mostra nova relacao | Studio cacheia schema na inicializacao | Pare e reinicie o Prisma Studio |
| Erro "Both sides of the relation must be defined" | Relacao declarada em apenas um modelo | Adicione o campo de relacao no outro modelo tambem |
| Tipo do campo FK nao bate com PK | Tipos incompativeis entre modelos | Use o mesmo tipo (String, Int) em ambos os lados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre integridade referencial e cardinalidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-relacionamentos-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-relacionamentos-1/references/code-examples.md)
