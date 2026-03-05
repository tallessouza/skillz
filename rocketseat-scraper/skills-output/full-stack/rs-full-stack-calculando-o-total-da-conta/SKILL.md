---
name: rs-full-stack-calculando-total-conta
description: "Applies patterns for calculating order totals using Knex raw SQL with SUM, COALESCE, and incremental validation. Use when user asks to 'calculate totals', 'sum order prices', 'build invoice endpoint', 'create billing summary', or 'handle null aggregations'. Enforces step-by-step development with intermediate testing, raw SQL for aggregations, and COALESCE for null safety. Make sure to use this skill whenever building endpoints that aggregate monetary values or quantities. Not for frontend display logic, payment gateway integration, or ORM-only queries."
---

# Calculando o Total da Conta

> Ao construir endpoints de agregacao (totais, resumos), use SQL raw para calculos, COALESCE para null safety, e desenvolva em etapas validando cada uma.

## Rules

1. **Desenvolva em etapas** — implemente uma parte, teste no client (Insomnia/Thunder), valide, depois avance, porque metodos grandes sem validacao intermediaria geram bugs dificeis de rastrear
2. **Use Knex raw para agregacoes** — `knex.raw('SUM(...)')` em vez de processar no JS, porque o banco e mais eficiente para calculos sobre conjuntos
3. **COALESCE contra nulos** — sempre envolva agregacoes com `COALESCE(SUM(...), 0)`, porque SUM retorna NULL quando nao ha registros
4. **Nomeie parametros de rota pelo significado** — `table_session_id` nao `id`, porque legibilidade importa quando ha multiplos IDs no sistema
5. **Use `show` para resumos especificos** — convencao: `index` lista todos, `show` retorna um resumo ou item especifico
6. **Teste de mesa para validar calculos** — confira manualmente (preco x quantidade) contra o resultado da API, porque erros em calculos financeiros sao criticos

## How to write

### Endpoint de totalizacao

```typescript
async show(request: Request, response: Response, next: NextFunction) {
  try {
    const { table_session_id } = request.params

    const order = await knex("orders")
      .select(
        knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS total"),
        knex.raw("COALESCE(SUM(orders.quantity), 0) AS quantity")
      )
      .where({ table_session_id })
      .first()

    return response.json(order)
  } catch (error) {
    next(error)
  }
}
```

### Rota com parametro semantico

```typescript
orderRoutes.get(
  "/table-session/:table_session_id/total",
  ordersController.show
)
```

## Example

**Before (sem COALESCE, processo no JS):**
```typescript
const orders = await knex("orders").where({ table_session_id })
const total = orders.reduce((sum, o) => sum + o.price * o.quantity, 0)
// Funciona, mas ineficiente — traz todos os registros para o servidor
```

**After (com esta skill):**
```typescript
const order = await knex("orders")
  .select(
    knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS total"),
    knex.raw("COALESCE(SUM(orders.quantity), 0) AS quantity")
  )
  .where({ table_session_id })
  .first()
// Calculo no banco, null-safe, retorna objeto unico
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa somar valores monetarios | `SUM(price * quantity)` no SQL, nao reduce no JS |
| Agregacao pode retornar null | Envolva com `COALESCE(..., 0)` |
| Metodo grande e complexo | Quebre em etapas, teste cada uma com request real |
| Multiplos IDs no sistema | Nomeie parametro pelo dominio: `table_session_id`, `order_id` |
| Endpoint retorna resumo/total | Use convencao `show`, rota com `/total` no path |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `SUM(price)` sem COALESCE | `COALESCE(SUM(price * quantity), 0)` |
| `.select("*")` em agregacao | `.select(knex.raw("SUM(...) AS total"))` |
| Parametro `:id` generico | `:table_session_id` semantico |
| Reduce no JS para totais de banco | SUM no SQL via knex.raw |
| Retornar `null` para pedido vazio | Retornar `0` via COALESCE |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre desenvolvimento em etapas, teste de mesa, e COALESCE
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes