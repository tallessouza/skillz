# Code Examples: Listando Produtos com Knex.js

## Exemplo 1: Select basico tipado

```typescript
// O instrutor comecou com um select simples, sem filtro
const products = await knex<ProductRepository>("products").select()
return response.json(products)
```

Resultado no Insomnia: retorna todos os produtos cadastrados na ordem de insercao.

## Exemplo 2: Adicionando orderBy

```typescript
const products = await knex<ProductRepository>("products")
  .select()
  .orderBy("name")

return response.json(products)
```

Antes: Executivo de Frango Grelhado aparecia por ultimo (inserido depois).
Depois: Executivo aparece primeiro (E vem antes na ordem alfabetica).

## Exemplo 3: Filtro opcional com whereLike (versao final)

```typescript
async index(request: Request, response: Response) {
  const { name } = request.query

  const products = await knex<ProductRepository>("products")
    .select()
    .whereLike("name", `%${name ?? ""}%`)
    .orderBy("name")

  return response.json(products)
}
```

Testes no Insomnia:
- `?name=batata` → retorna apenas o prato com "batata" no nome
- `?name=EZ` → retorna "Executivo..." (match parcial)
- Sem parametro → retorna todos os produtos

## Exemplo 4: Variacoes para outros cenarios

### Filtro por multiplos campos

```typescript
async index(request: Request, response: Response) {
  const { name, category } = request.query

  const products = await knex<ProductRepository>("products")
    .select()
    .whereLike("name", `%${name ?? ""}%`)
    .whereLike("category", `%${category ?? ""}%`)
    .orderBy("name")

  return response.json(products)
}
```

### Filtro com ordenacao customizada

```typescript
// Ordenar por preco decrescente
const products = await knex<ProductRepository>("products")
  .select()
  .whereLike("name", `%${name ?? ""}%`)
  .orderBy("price", "desc")
```

### Filtro com selecao de colunas

```typescript
// Retornar apenas nome e preco
const products = await knex<ProductRepository>("products")
  .select("name", "price")
  .whereLike("name", `%${name ?? ""}%`)
  .orderBy("name")
```

## Demonstracao da tipagem (do instrutor)

```typescript
// SEM tipo — TypeScript nao ajuda
const products = await knex("products").select()
products[0]. // ← nenhuma sugestao aparece

// COM tipo — autocomplete funcional
const products = await knex<ProductRepository>("products").select()
products[0]. // ← aparece: name, price, description, etc.
```

O instrutor enfatizou: "Essa e a vantagem da tipagem" — sem ela, voce perde a principal feature do TypeScript ao trabalhar com Knex.