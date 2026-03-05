# Code Examples: Migration de Pedidos

## Exemplo completo da aula — Migration de orders

```typescript
import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary()
    table.integer("table_session_id").notNullable().references("id").inTable("table_sessions")
    table.integer("product_id").notNullable().references("id").inTable("products")
    table.integer("quantity").notNullable()
    table.decimal("price").notNullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("orders")
}
```

## Comando para criar a migration

```bash
npm run knex -- migrate:make create-orders
```

O Knex adiciona automaticamente um prefixo numerico (timestamp) ao nome do arquivo para controle de ordem de execucao.

## Comando para executar a migration

```bash
npm run knex -- migrate:latest
```

## Tabelas pre-existentes referenciadas

### Tabela products (ja criada anteriormente)

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    table.increments("id").primary()
    table.text("name").notNullable()
    table.decimal("price").notNullable()
    // ... outras colunas
  })
}
```

### Tabela table_sessions (ja criada anteriormente)

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("table_sessions", (table) => {
    table.increments("id").primary()
    table.integer("table_id").notNullable().references("id").inTable("tables")
    // ... outras colunas
  })
}
```

## Variacao: Calculando total dinamicamente na query

```typescript
// Ao buscar pedidos, calcule o total no SELECT
const orders = await knex("orders")
  .select(
    "orders.*",
    knex.raw("orders.quantity * orders.price as total")
  )
  .where("table_session_id", sessionId)
```

## Variacao: Inserindo pedido copiando preco do produto

```typescript
async function createOrder(sessionId: number, productId: number, quantity: number) {
  // Busca preco atual do produto
  const product = await knex("products").where("id", productId).first()

  // Salva com preco no momento do pedido
  const [order] = await knex("orders").insert({
    table_session_id: sessionId,
    product_id: productId,
    quantity,
    price: product.price, // Copia o preco atual
  }).returning("*")

  return order
}
```

## Variacao: Migration com onDelete cascade

```typescript
// Se quiser deletar pedidos quando a sessao for deletada
table.integer("table_session_id")
  .notNullable()
  .references("id")
  .inTable("table_sessions")
  .onDelete("CASCADE")
```

## Variacao: Preco em centavos (alternativa ao decimal)

```typescript
// Abordagem alternativa: armazenar em centavos como integer
table.integer("price_in_cents").notNullable()
// 7050 = R$70,50
// Vantagem: evita problemas de ponto flutuante
// Desvantagem: precisa converter na aplicacao
```

## Padrao de encadeamento no Knex

```typescript
// Cada coluna e uma chamada encadeada no objeto table
table.integer("column_name")  // tipo
  .notNullable()               // constraint
  .references("id")            // FK target column
  .inTable("other_table")      // FK target table
```