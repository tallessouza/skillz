---
name: rs-saas-nextjs-rbac-seed-db
description: "Generates Prisma database seed files with Faker for pre-populating test data. Use when user asks to 'create a seed', 'populate database', 'seed the database', 'generate test data', or 'pre-populate with fake data'. Applies patterns: clean-then-seed, role-diverse users, realistic relationships with randomized ownership, nested creates for related models. Make sure to use this skill whenever creating seed files for Prisma projects. Not for production data migration, fixtures for unit tests, or factory patterns in test suites."
---

# Seed do Banco de Dados com Prisma

> Ao criar seeds, gere dados que cubram todos os cenarios de permissao e roles, com relacionamentos realistas entre entidades.

## Rules

1. **Limpe antes de popular** — delete all dependents first (`deleteMany` em ordem de dependencia), porque seeds devem ser idempotentes
2. **Crie usuarios com roles variadas** — admin, member, billing em organizacoes diferentes para o mesmo usuario, porque facilita testar permissoes sem trocar de conta
3. **Use Faker para dados realistas** — `faker.lorem.words()`, `faker.internet.email()`, `faker.image.avatarGitHub()`, porque dados realistas revelam bugs que dados triviais escondem
4. **Reduza rounds de hash no seed** — `hash(password, 1)` em vez do padrao, porque seed nao precisa de seguranca e executa muito mais rapido
5. **Randomize ownership** — `faker.helpers.arrayElement([user1.id, user2.id])` para distribuir donos de projetos, porque simula cenarios reais
6. **Conexao separada sem logs** — crie um `new PrismaClient()` sem configuracao de log, porque o seed nao precisa poluir o console com queries

## How to write

### Estrutura basica do seed

```typescript
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  // 1. Limpar banco (ordem de dependencia)
  await prisma.project.deleteMany()
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  // 2. Hash com round baixo para velocidade
  const passwordHash = await hash('123456', 1)

  // 3. Usuario principal (login de teste)
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@acme.com',
      avatarUrl: 'https://github.com/username.png',
      passwordHash,
    },
  })

  // 4. Usuarios secundarios com Faker
  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  // 5. Organizacao com members e projects nested
  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'ADMIN' },
            { userId: anotherUser.id, role: 'MEMBER' },
          ],
        },
      },
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user.id, anotherUser.id]),
            },
          ],
        },
      },
    },
  })

  console.log('Database seeded!')
}

seed().then(() => prisma.$disconnect())
```

### Configuracao no package.json

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Example

**Before (seed fragil e incompleto):**
```typescript
const user = await prisma.user.create({
  data: { name: 'test', email: 'test@test.com', passwordHash: await hash('123456', 6) },
})
await prisma.organization.create({
  data: { name: 'org', slug: 'org', ownerId: user.id },
})
```

**After (seed completo para testes de permissao):**
```typescript
await prisma.organization.deleteMany()
await prisma.user.deleteMany()

const passwordHash = await hash('123456', 1)

const user = await prisma.user.create({
  data: { name: 'John Doe', email: 'john@acme.com', passwordHash },
})
const anotherUser = await prisma.user.create({
  data: { name: faker.person.fullName(), email: faker.internet.email(), passwordHash },
})

// Org onde user eh admin
await prisma.organization.create({
  data: {
    name: 'Acme Inc (Admin)', slug: 'acme-admin', ownerId: user.id,
    members: { createMany: { data: [
      { userId: user.id, role: 'ADMIN' },
      { userId: anotherUser.id, role: 'MEMBER' },
    ]}},
    projects: { createMany: { data: Array.from({ length: 3 }, () => ({
      name: faker.lorem.words(5), slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(), avatarUrl: faker.image.avatarGitHub(),
      ownerId: faker.helpers.arrayElement([user.id, anotherUser.id]),
    }))}},
  },
})

// Org onde user eh member (mesma estrutura, role diferente)
// Org onde user eh billing (mesma estrutura, role diferente)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto tem RBAC/permissoes | Crie orgs separadas com o mesmo usuario em roles diferentes |
| `createMany` nao retorna dados | Use `create` individual quando precisar do ID retornado |
| Muitos projetos por org | Use `Array.from({ length: N })` com Faker para gerar em lote |
| Seed demora muito | Reduza bcrypt rounds para 1, use `createMany` onde possivel |
| Campo referencia mudou de nome | Rode `prisma migrate dev` para atualizar o schema |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `hash('123456', 6)` no seed | `hash('123456', 1)` — velocidade sobre seguranca em seed |
| Seed sem `deleteMany` no inicio | Sempre limpe na ordem correta de dependencias |
| Todos usuarios com mesma role | Varie roles: admin, member, billing |
| Dados hardcoded para tudo | Use Faker para dados secundarios, hardcode so o usuario principal |
| `createMany` quando precisa do retorno | Use `create` individual e capture o resultado |
| Uma org so para testar permissoes | Crie uma org por role que o usuario principal ocupa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
