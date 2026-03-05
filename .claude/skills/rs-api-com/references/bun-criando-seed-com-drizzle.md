---
name: rs-api-com-bun-criando-seed-com-drizzle
description: "Generates database seed files using Drizzle ORM and FakerJS when user asks to 'create a seed', 'populate database', 'seed the database', 'generate test data', or 'create fake data'. Applies patterns: reset before insert, respect foreign key order, use .returning() for chained inserts, fixed credentials for test users. Make sure to use this skill whenever creating seed scripts for Drizzle projects. Not for migration files, schema definitions, or production data scripts."
---

# Criando Seed com Drizzle

> Ao criar um seed, resete o banco antes de inserir, respeite a ordem das foreign keys, e use dados fixos para usuarios de teste.

## Rules

1. **Sempre resete o banco antes de inserir** — delete todas as tabelas antes de popular, porque rodar o seed duas vezes com campos unique causa erro
2. **Respeite a ordem das foreign keys ao deletar** — delete primeiro as tabelas dependentes (restaurants) e depois as tabelas pai (users), porque constraints como `restrict` bloqueiam delecao de registros referenciados
3. **Nao use Promise.all para deletes dependentes** — execute sequencialmente com await, porque a ordem importa quando ha foreign keys
4. **Use email fixo para usuario de teste/login** — dados de autenticacao devem ser previsíveis para quem pega o projeto, porque o seed roda com FakerJS e geraria emails diferentes a cada execucao
5. **Use `.returning()` para obter IDs de inserts encadeados** — quando um insert depende do ID de outro, use returning ao inves de gerar o ID antes, porque o Drizzle retorna dados tipados
6. **Desestruture o array do returning** — Drizzle sempre retorna array mesmo para insert unico, use `const [variable] = await db.insert(...).returning(...)` para extrair o primeiro elemento
7. **Encerre com `process.exit()`** — o seed e um script standalone que precisa encerrar o processo ao final

## How to write

### Arquivo de conexao separado (connection.ts)

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env'
import * as schema from './schema'

const connection = postgres(env.DATABASE_URL)

export const db = drizzle(connection, { schema })
```

### Estrutura do seed (seed.ts)

```typescript
import { faker } from '@faker-js/faker'
import chalk from 'chalk'
import { users, restaurants } from './schema'
import { db } from './connection'

// 1. Reset — ordem importa (dependentes primeiro)
await db.delete(restaurants)
await db.delete(users)
console.log(chalk.yellow('✔ Database reset'))

// 2. Clientes com dados aleatorios
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

// 3. Manager com email fixo (para login de teste)
const [manager] = await db
  .insert(users)
  .values({
    name: faker.person.fullName(),
    email: 'admin@admin.com',
    role: 'manager',
  })
  .returning({ id: users.id })
console.log(chalk.yellow('✔ Created manager'))

// 4. Restaurante associado ao manager
await db.insert(restaurants).values({
  name: faker.company.name(),
  description: faker.lorem.paragraph(),
  managerId: manager.id,
})
console.log(chalk.yellow('✔ Created restaurant'))

console.log(chalk.greenBright('✔ Database seeded successfully'))
process.exit()
```

### Script no package.json

```json
{
  "scripts": {
    "seed": "bun seed"
  }
}
```

## Example

**Before (seed ingenuo que quebra na segunda execucao):**
```typescript
await db.insert(users).values({
  email: 'admin@admin.com',
  role: 'manager',
})
// Erro na 2a execucao: unique constraint violation
```

**After (com reset e returning):**
```typescript
await db.delete(restaurants)
await db.delete(users)

const [manager] = await db
  .insert(users)
  .values({ name: faker.person.fullName(), email: 'admin@admin.com', role: 'manager' })
  .returning({ id: users.id })

await db.insert(restaurants).values({
  name: faker.company.name(),
  description: faker.lorem.paragraph(),
  managerId: manager.id,
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tabela tem foreign key com `restrict` | Delete a tabela dependente ANTES da tabela pai |
| Usuario sera usado para login em testes | Email fixo, nome pode ser faker |
| Insert precisa do ID para outro insert | Use `.returning({ id: tabela.id })` |
| Insert unico retorna array | Desestruture: `const [item] = await ...` |
| Returning sem argumentos | Retorna todas as colunas do registro inserido |
| Conexao para seed/migrate | Pode usar `max: 1`, mas para app use pool padrao |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `Promise.all([db.delete(a), db.delete(b)])` com FK | `await db.delete(b); await db.delete(a)` |
| `const id = crypto.randomUUID()` para encadear inserts | `const [row] = await db.insert(...).returning({ id })` |
| `email: faker.internet.email()` para usuario de teste | `email: 'admin@admin.com'` (fixo) |
| Seed sem reset no inicio | `await db.delete(tabela)` para cada tabela |
| `const result = await db.insert(...).returning()` para insert unico | `const [item] = await db.insert(...).returning()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-criando-seed-com-drizzle/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-criando-seed-com-drizzle/references/code-examples.md)
