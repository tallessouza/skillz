# Code Examples: Criando Seed com Drizzle

## Arquivo de conexao completo (db/connection.ts)

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env'
import * as schema from './schema'

const connection = postgres(env.DATABASE_URL)

export const db = drizzle(connection, { schema })
```

**Diferenca do migrate:** o migrate usa `postgres(env.DATABASE_URL, { max: 1 })` para limitar a uma conexao. O connection.ts da aplicacao nao tem essa restricao.

## Instalacao do FakerJS

```bash
bun add -D @faker-js/faker
```

Nota: instalar como devDependency (`-D`) porque o faker so e usado no seed, nao em producao.

## Seed completo (db/seed.ts)

```typescript
import { faker } from '@faker-js/faker'
import chalk from 'chalk'
import { users, restaurants } from './schema'
import { db } from './connection'

/**
 * Reset do banco — ordem importa por causa das foreign keys
 * Tabelas dependentes (restaurants) antes das tabelas pai (users)
 */
await db.delete(restaurants)
await db.delete(users)
console.log(chalk.yellow('✔ Database reset'))

/**
 * Clientes com dados aleatorios
 * role: 'customer' e o padrao, mas fica explicito para legibilidade
 */
await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
])
console.log(chalk.yellow('✔ Created customers'))

/**
 * Manager com email fixo — usado para login durante desenvolvimento
 * .returning() retorna os dados inseridos, tipados pelo Drizzle
 */
const [manager] = await db
  .insert(users)
  .values({
    name: faker.person.fullName(),
    email: 'admin@admin.com',
    role: 'manager',
  })
  .returning({ id: users.id })
console.log(chalk.yellow('✔ Created manager'))

/**
 * Restaurante associado ao manager via returning
 */
await db.insert(restaurants).values({
  name: faker.company.name(),
  description: faker.lorem.paragraph(),
  managerId: manager.id,
})
console.log(chalk.yellow('✔ Created restaurant'))

console.log(chalk.greenBright('✔ Database seeded successfully'))
process.exit()
```

## Package.json — script de seed

```json
{
  "scripts": {
    "migrate": "bun migrate",
    "seed": "bun seed"
  }
}
```

Execucao: `bun seed`

## Variacoes do .returning()

### Retornar todas as colunas
```typescript
const [user] = await db
  .insert(users)
  .values({ name: 'John', email: 'john@test.com' })
  .returning()
// user tem TODAS as colunas: id, name, email, role, createdAt, etc.
```

### Retornar campos especificos
```typescript
const [user] = await db
  .insert(users)
  .values({ name: 'John', email: 'john@test.com' })
  .returning({ id: users.id })
// user tem apenas: { id: string }
```

### Retornar com nome customizado
```typescript
const [user] = await db
  .insert(users)
  .values({ name: 'John', email: 'john@test.com' })
  .returning({ odentificador: users.id, correo: users.email })
// user tem: { identificador: string, correo: string }
```

## FakerJS — geradores usados na aula

```typescript
faker.person.fullName()    // Nome completo de pessoa
faker.internet.email()     // Email aleatorio
faker.company.name()       // Nome de empresa
faker.lorem.paragraph()    // Paragrafo de texto ficticio
```

## Ordem de delete com foreign keys

```typescript
// CORRETO — dependentes primeiro
await db.delete(restaurants)  // tem FK para users
await db.delete(users)        // tabela pai

// ERRADO — pode falhar com restrict
await db.delete(users)        // ERRO se restaurant referencia este user
await db.delete(restaurants)
```

## Alternativa: gerar ID antes do insert

O instrutor menciona mas NAO recomenda esta abordagem:

```typescript
// Alternativa (menos elegante)
import { randomUUID } from 'crypto'
const managerId = randomUUID()

await db.insert(users).values({
  id: managerId,  // ID gerado manualmente
  name: faker.person.fullName(),
  email: 'admin@admin.com',
  role: 'manager',
})

await db.insert(restaurants).values({
  managerId,  // usa o mesmo ID
})
```

A abordagem preferida e usar `.returning()` porque mantem o banco como fonte de verdade para geracao de IDs.