# Code Examples: Seed de Tabelas

## Exemplo base da aula — Seed de mesas

```typescript
// seeds/insert-tables.ts
import { tables } from "./schema"

export default async function seed(db) {
  await db.insert(tables).values([
    { tableNumber: 1 },
    { tableNumber: 2 },
    { tableNumber: 3 },
    { tableNumber: 4 },
    { tableNumber: 5 },
  ])
}
```

### Comandos utilizados na aula

```bash
# Criar o arquivo de seed
npm run connect-seed 2.make insert-tables

# Executar o seed
npm run connect-seed 2.run
```

## Variacao: Seed com mais campos

Se a tabela tivesse campos opcionais que voce quer definir:

```typescript
await db.insert(tables).values([
  { tableNumber: 1, capacity: 4, location: "indoor" },
  { tableNumber: 2, capacity: 2, location: "outdoor" },
  { tableNumber: 3, capacity: 6, location: "indoor" },
])
```

## Variacao: Seed de tabela dependente

Quando uma tabela referencia outra (ex: pedidos referenciam mesas):

```typescript
// seeds/insert-orders.ts — executa DEPOIS do seed de tables
import { orders, tables } from "./schema"
import { eq } from "drizzle-orm"

export default async function seed(db) {
  // Busca as mesas ja inseridas
  const existingTables = await db.select().from(tables)

  await db.insert(orders).values([
    { tableId: existingTables[0].id, status: "pending" },
    { tableId: existingTables[1].id, status: "preparing" },
  ])
}
```

## Variacao: Seed com limpeza previa

Para seeds idem-potentes (podem rodar multiplas vezes):

```typescript
export default async function seed(db) {
  // Limpa dados anteriores
  await db.delete(tables)

  // Insere novos
  await db.insert(tables).values([
    { tableNumber: 1 },
    { tableNumber: 2 },
    { tableNumber: 3 },
    { tableNumber: 4 },
    { tableNumber: 5 },
  ])
}
```

## Variacao: Gerando dados dinamicamente

Para quando precisa de muitos registros:

```typescript
export default async function seed(db) {
  const tableValues = Array.from({ length: 20 }, (_, i) => ({
    tableNumber: i + 1,
  }))

  await db.insert(tables).values(tableValues)
}
```