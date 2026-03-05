---
name: rs-full-stack-removendo-produtos
description: "Enforces correct delete endpoint implementation with existence verification in Node.js APIs using Knex. Use when user asks to 'delete a record', 'remove endpoint', 'implement DELETE route', or 'add removal method'. Applies patterns: always verify existence before delete/update, always use await on DB queries, return proper error responses. Make sure to use this skill whenever implementing delete or update operations that need existence checks. Not for frontend code, authentication, or file deletion."
---

# Removendo Produtos (Delete com Verificação)

> Antes de deletar ou atualizar um registro, sempre verifique se ele existe — operações silenciosas em registros inexistentes são bugs disfarçados de sucesso.

## Rules

1. **Sempre verifique existência antes de delete/update** — faça um `select().where({ id }).first()` antes, porque sem verificação a API retorna 200 para registros que não existem
2. **Sempre use await em queries ao banco** — sem `await` o código pula a query e segue execução, causando bugs silenciosos onde verificações são ignoradas
3. **Use `.first()` para buscar registro único** — evita trabalhar com array quando só precisa de um objeto, porque o select retorna array por padrão
4. **Lance erro específico quando não encontrar** — use `throw new AppError("Product not found")` em vez de retornar sucesso silencioso, porque o cliente precisa saber que a operação falhou
5. **Comece pelo controller, depois a rota** — implemente o método no controller como `async`, depois registre a rota com o verbo HTTP correto

## How to write

### Controller de remoção com verificação

```typescript
async remove(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params

    const product = await knex<ProductRepository>("products")
      .select()
      .where({ id })
      .first()

    if (!product) {
      throw new AppError("Product not found")
    }

    await knex<ProductRepository>("products").delete().where({ id })

    return response.json()
  } catch (error) {
    next(error)
  }
}
```

### Rota DELETE

```typescript
productRoutes.delete("/:id", productController.remove)
```

## Example

**Before (delete silencioso — bug):**
```typescript
async remove(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params
    await knex("products").delete().where({ id })
    return response.json() // retorna 200 mesmo se id não existe
  } catch (error) {
    next(error)
  }
}
```

**After (com verificação de existência):**
```typescript
async remove(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params

    const product = await knex<ProductRepository>("products")
      .select()
      .where({ id })
      .first()

    if (!product) {
      throw new AppError("Product not found")
    }

    await knex<ProductRepository>("products").delete().where({ id })

    return response.json()
  } catch (error) {
    next(error)
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| DELETE de registro por id | Sempre verificar existência antes |
| UPDATE de registro por id | Mesma verificação de existência antes |
| Query retorna array mas precisa de um | Use `.first()` |
| Esqueceu `await` e verificação não funciona | Adicione `await` — sem ele a Promise é truthy e o `if` nunca entra |
| Operação retorna sucesso mas não fez nada | Provavelmente falta verificação de existência |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `knex("products").delete().where({ id })` sem verificar | `select + first + if (!product) throw` antes do delete |
| `const product = knex(...)` sem `await` | `const product = await knex(...)` |
| `products.select().where({ id })` acessando como objeto | `.select().where({ id }).first()` para obter objeto |
| `return response.json()` após delete sem verificar | Verificar existência, lançar AppError se não encontrar |
| Verificação só no delete mas não no update | Aplicar mesma verificação em ambos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre await, verificação de existência e .first()
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações