# Code Examples: Removendo Produtos

## Exemplo 1: Controller de remove completo

```typescript
async remove(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params

    // Verificação de existência antes de deletar
    const product = await knex<ProductRepository>("products")
      .select()
      .where({ id })
      .first()

    if (!product) {
      throw new AppError("Product not found")
    }

    // Só deleta se o produto existe
    await knex<ProductRepository>("products").delete().where({ id })

    return response.json()
  } catch (error) {
    next(error)
  }
}
```

## Exemplo 2: Update com mesma verificação

```typescript
async update(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params
    const { name, price } = request.body

    // Mesma verificação de existência
    const product = await knex<ProductRepository>("products")
      .select()
      .where({ id })
      .first()

    if (!product) {
      throw new AppError("Product not found")
    }

    await knex<ProductRepository>("products")
      .update({ name, price, updated_at: knex.fn.now() })
      .where({ id })

    return response.json()
  } catch (error) {
    next(error)
  }
}
```

## Exemplo 3: Rota DELETE registrada

```typescript
// routes/product.routes.ts
productRoutes.delete("/:id", productController.remove)
```

## Exemplo 4: Bug do await ausente (demonstrado ao vivo)

```typescript
// ERRADO — sem await, product é uma Promise (truthy)
const product = knex<ProductRepository>("products")
  .select()
  .where({ id })
  .first()

// !product é SEMPRE false porque Promise é truthy
if (!product) {
  throw new AppError("Product not found") // NUNCA EXECUTA
}

// CORRETO — com await, product é o objeto ou undefined
const product = await knex<ProductRepository>("products")
  .select()
  .where({ id })
  .first()

if (!product) {
  throw new AppError("Product not found") // Funciona corretamente
}
```

## Exemplo 5: Diferença entre select com e sem .first()

```typescript
// Sem .first() — retorna array
const products = await knex("products").select().where({ id })
// products = [{ id: 1, name: "Batata", price: 60.50 }]
// Para acessar: products[0].name
// Se não encontrar: products = [] (array vazio, truthy!)

// Com .first() — retorna objeto ou undefined
const product = await knex("products").select().where({ id }).first()
// product = { id: 1, name: "Batata", price: 60.50 }
// Para acessar: product.name
// Se não encontrar: product = undefined (falsy, ideal para verificação)
```

## Exemplo 6: Teste no Insomnia (fluxo demonstrado)

```
# Deletar produto existente (id=1)
DELETE /products/1 → 200 OK (sucesso)

# Deletar produto inexistente (id=3)
DELETE /products/3 → 400 Bad Request { "message": "Product not found" }

# Listar após deletar todos
GET /products → 200 OK [] (array vazio)

# Atualizar produto inexistente (id=3)
PUT /products/3 → 400 Bad Request { "message": "Product not found" }

# Atualizar produto existente (id=1)
PUT /products/1 { "name": "Porção de batata frita", "price": 60.50 } → 200 OK
```