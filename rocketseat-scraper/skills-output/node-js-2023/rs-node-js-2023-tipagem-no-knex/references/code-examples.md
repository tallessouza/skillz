# Code Examples: Tipagem no Knex

## Exemplo completo: Arquivo de definicao

```typescript
// src/@types/knex.d.ts

// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string  // opcional porque nao tem notNullable() na migration
    }
  }
}
```

## Migration correspondente (referencia)

```typescript
// A migration que criou a tabela transactions
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.uuid('session_id').after('id').index()
    // session_id NAO tem .notNullable() -> opcional na interface
  })
}
```

## Usando nas rotas com autocomplete

```typescript
// src/routes/transactions.ts
import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { title, amount, type } = createTransactionBodySchema.parse(request.body)

    // Com a tipagem, o TypeScript:
    // 1. Sugere 'transactions' ao digitar o nome da tabela
    // 2. Valida que id, title, amount sao obrigatorios
    // 3. Permite omitir session_id (opcional)
    // 4. Rejeita campos que nao existem na interface
    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: request.cookies.sessionId,
    })

    return reply.status(201).send()
  })
}
```

## Adicionando uma nova tabela

```typescript
// Ao criar uma nova migration para 'users', adicione na interface:
declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
    // Nova tabela adicionada
    users: {
      id: string
      name: string
      email: string
      created_at: string
      avatar_url?: string  // opcional
    }
  }
}
```

## Mapeamento de tipos SQL para TypeScript

| Tipo na Migration (Knex) | Tipo na Interface (TS) | Exemplo |
|--------------------------|----------------------|---------|
| `table.uuid()` | `string` | `id: string` |
| `table.text()` | `string` | `title: string` |
| `table.decimal()` | `number` | `amount: number` |
| `table.integer()` | `number` | `quantity: number` |
| `table.timestamp()` | `string` | `created_at: string` |
| `table.boolean()` | `boolean` | `is_active: boolean` |
| `table.enum()` | union type | `status: 'active' \| 'inactive'` |

## Verificando o autocomplete

Apos criar o arquivo `knex.d.ts`:

1. Em qualquer arquivo que use `knex`, digite `knex('` e pressione `Ctrl+Space`
2. O editor deve sugerir `transactions` (e qualquer outra tabela declarada)
3. Apos selecionar a tabela, em `.insert({})` pressione `Ctrl+Space`
4. O editor deve listar todas as colunas com seus tipos
5. Campos obrigatorios aparecem sem `?`, opcionais com `?`