---
name: rs-full-stack-rota-listar-pedidos-mesa
description: "Applies REST route pattern for listing orders by table session in Node.js/Express APIs. Use when user asks to 'create a GET route', 'list orders by table', 'add index endpoint', or 'fetch items by session'. Follows controller-routes separation with async error handling via next(). Make sure to use this skill whenever building restaurant or order management API endpoints. Not for database queries, authentication, or frontend components."
---

# Rota Para Listar Pedidos Por Mesa

> Ao criar endpoints de listagem, separe a rota (GET com parametro de sessao) do controller (metodo index com try/catch e next).

## Rules

1. **Use metodo `index` para listagem** — `index` e o nome convencional para listar recursos, porque segue o padrao RESTful (index, show, create, update, delete)
2. **Receba o ID da sessao como parametro de rota** — `/table-session/:id` nao query string, porque identifica univocamente a sessao da mesa
3. **Sempre use async/await com try/catch** — repassando o erro via `next(error)`, porque centraliza o tratamento de erros no middleware
4. **Tipar Request, Response e NextFunction** — importados do Express, porque garante autocomplete e seguranca de tipos
5. **Mantenha rotas no arquivo de rotas, logica no controller** — `orders-routes.ts` define o GET, `OrdersController` implementa o `index`, porque separacao de responsabilidades facilita manutencao

## How to write

### Metodo index no Controller

```typescript
async index(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params

    // Buscar pedidos pela sessao da mesa
    const orders = await knex("orders")
      .where("table_session_id", id)

    return response.json(orders)
  } catch (error) {
    next(error)
  }
}
```

### Rota GET no arquivo de rotas

```typescript
// orders-routes.ts
ordersRoutes.get("/table-session/:id", ordersController.index)
```

## Example

**Before (rota sem separacao):**
```typescript
// Tudo misturado no arquivo de rotas
router.get("/orders/:sessionId", async (req, res) => {
  const orders = await db.query("SELECT * FROM orders WHERE session = ?", [req.params.sessionId])
  res.send(orders)
})
```

**After (com este skill aplicado):**
```typescript
// orders-routes.ts
ordersRoutes.get("/table-session/:id", ordersController.index)

// OrdersController.ts
async index(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params
    const orders = await knex("orders").where("table_session_id", id)
    return response.json(orders)
  } catch (error) {
    next(error)
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listar recursos por relacao (mesa, usuario) | GET com parametro de rota: `/parent-resource/:id` |
| Novo endpoint de listagem | Criar metodo `index` no controller correspondente |
| Erro no controller | Repassar com `next(error)`, nunca engolir silenciosamente |
| Testar endpoint novo | Criar request no Insomnia/Postman usando base URL + resource path |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `router.get("/orders", (req, res) => { ... })` inline | Metodo `index` separado no controller |
| `catch (error) { console.log(error) }` | `catch (error) { next(error) }` |
| `req.query.sessionId` para identificador unico | `req.params.id` via rota `/table-session/:id` |
| `res.send(data)` | `response.json(data)` para APIs REST |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o padrao controller/routes e convencoes REST
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-rota-para-listar-pedidos-por-mesa/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-rota-para-listar-pedidos-por-mesa/references/code-examples.md)
