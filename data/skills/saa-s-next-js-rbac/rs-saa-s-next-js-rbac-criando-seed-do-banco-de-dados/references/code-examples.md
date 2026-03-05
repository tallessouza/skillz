# Code Examples: Seed do Banco de Dados

## Exemplo completo do seed da aula

```typescript
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.project.deleteMany()
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 1)

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@acme.com',
      avatarUrl: 'https://github.com/username.png',
      passwordHash,
    },
  })

  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const anotherUser2 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  // Org 1: User como ADMIN
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
            { userId: anotherUser2.id, role: 'MEMBER' },
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
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
          ],
        },
      },
    },
  })

  // Org 2: User como MEMBER
  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'MEMBER' },
            { userId: anotherUser.id, role: 'ADMIN' },
            { userId: anotherUser2.id, role: 'MEMBER' },
          ],
        },
      },
      projects: {
        createMany: {
          data: Array.from({ length: 3 }, () => ({
            name: faker.lorem.words(5),
            slug: faker.lorem.slug(5),
            description: faker.lorem.paragraph(),
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: faker.helpers.arrayElement([
              user.id,
              anotherUser.id,
              anotherUser2.id,
            ]),
          })),
        },
      },
    },
  })

  // Org 3: User como BILLING
  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'BILLING' },
            { userId: anotherUser.id, role: 'ADMIN' },
            { userId: anotherUser2.id, role: 'MEMBER' },
          ],
        },
      },
      projects: {
        createMany: {
          data: Array.from({ length: 3 }, () => ({
            name: faker.lorem.words(5),
            slug: faker.lorem.slug(5),
            description: faker.lorem.paragraph(),
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: faker.helpers.arrayElement([
              user.id,
              anotherUser.id,
              anotherUser2.id,
            ]),
          })),
        },
      },
    },
  })

  console.log('Database seeded!')
}

seed().then(() => prisma.$disconnect())
```

## package.json — configuracao do seed

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Comandos uteis

```bash
# Rodar o seed
pnpm prisma db seed

# Verificar dados no Prisma Studio
pnpm prisma studio

# Reset completo (drop + migrate + seed)
pnpm prisma migrate reset
```

## Variacao: gerando N projetos com Array.from

Em vez de copiar/colar objetos de projeto, use `Array.from`:

```typescript
projects: {
  createMany: {
    data: Array.from({ length: 3 }, () => ({
      name: faker.lorem.words(5),
      slug: faker.lorem.slug(5),
      description: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: faker.helpers.arrayElement(memberIds),
    })),
  },
},
```

## Variacao: seed com transacao para atomicidade

```typescript
async function seed() {
  await prisma.$transaction(async (tx) => {
    await tx.project.deleteMany()
    await tx.member.deleteMany()
    await tx.organization.deleteMany()
    await tx.user.deleteMany()

    // ... creates dentro da transacao
  })
}
```