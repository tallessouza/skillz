# Code Examples: Seed de Produtos com Knex.js

## Exemplo da aula — Seed de produtos de restaurante

```typescript
import { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
  await knex("products").del()

  await knex("products").insert([
    { name: "Bruschetta de Tomate e Manjericão", price: 2590 },
    { name: "Carpaccio de Salmão com Alcaparras", price: 3490 },
    { name: "Sopa de Cebola Gratinada", price: 2890 },
    { name: "Salada Caesar com Frango Grelhado", price: 3190 },
    { name: "Tartar de Atum com Abacate", price: 3990 },
    { name: "Risoto de Funghi Porcini", price: 4290 },
    { name: "Filé Mignon ao Molho de Vinho Tinto", price: 5890 },
    { name: "Salmão Grelhado com Legumes", price: 5290 },
    { name: "Penne ao Molho Alfredo com Camarão", price: 4590 },
    { name: "Frango ao Molho Mostarda e Mel", price: 3890 },
    { name: "Tiramisù Clássico", price: 2490 },
    { name: "Petit Gâteau com Sorvete de Baunilha", price: 2790 },
    { name: "Cheesecake de Frutas Vermelhas", price: 2690 },
    { name: "Panna Cotta com Calda de Maracujá", price: 2390 },
    { name: "Mousse de Chocolate Belga", price: 2590 },
  ])
}
```

Campos: apenas `name` (string) e `price` (inteiro em centavos).

## Variação — Seed com proteção de ambiente

```typescript
import { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    console.warn("Seed bloqueado em produção")
    return
  }

  await knex("products").del()
  await knex("products").insert([
    { name: "Produto Exemplo", price: 1000 },
  ])
}
```

## Variação — Seed com dados de arquivo JSON externo

```typescript
import { Knex } from "knex"
import products from "../data/products.json"

export async function seed(knex: Knex): Promise<void> {
  await knex("products").del()
  await knex("products").insert(products)
}
```

## Variação — Seed para lookup table (sem deletar)

```typescript
import { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
  // Usa onConflict para não duplicar, mas também não apagar existentes
  await knex("categories").insert([
    { id: 1, name: "Entradas" },
    { id: 2, name: "Pratos Principais" },
    { id: 3, name: "Sobremesas" },
  ]).onConflict("id").ignore()
}
```

## Criação do seed via CLI

```bash
# Cria o arquivo de seed
npx knex seed:make insert_products

# Ou via npm script
npm run knex -- seed:make insert_products

# Executa todos os seeds
npx knex seed:run

# Ou via npm script
npm run knex -- seed:run
```