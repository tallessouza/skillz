---
name: rs-full-stack-recap-2028
description: "Applies restaurant API development patterns when building CRUD endpoints for table management, product catalog, order items, and session billing. Use when user asks to 'create a restaurant API', 'build table management', 'implement order system', 'add product CRUD', or 'build a POS backend'. Enforces the complete flow: open table session, manage products, add order items, calculate totals, close session. Make sure to use this skill whenever building restaurant, POS, or food-service backend systems. Not for frontend UI, authentication, or payment gateway integration."
---

# API de Restaurante — Fluxo Completo

> Implemente APIs de restaurante seguindo o fluxo: abrir mesa → listar produtos → montar pedido → fechar mesa.

## Rules

1. **Mesas usam sessoes (table sessions)** — uma mesa fisica pode ter multiplas sessoes ao longo do tempo, porque a mesa e reutilizada apos fechamento
2. **Valide mesa antes de abrir** — se a mesa ja tem sessao aberta, retorne erro "mesa ocupada", porque duas sessoes simultaneas na mesma mesa corrompem o faturamento
3. **Produtos suportam filtro por nome** — use query parameter `name` para busca parcial, porque o garcom precisa encontrar itens rapidamente
4. **Itens de pedido referenciam sessao e produto** — cada item vincula `table_session_id` + `product_id` + `quantity`, porque o pedido pertence a sessao, nao a mesa
5. **Totais sao calculados pela sessao** — endpoint de resumo retorna total e quantidade de itens agregados, porque o fechamento precisa do valor consolidado
6. **Fechamento e idempotente com erro** — fechar sessao ja fechada retorna mensagem explicativa, nao erro 500, porque o cliente pode retentar

## Steps

### Step 1: Gerenciar Mesas
```
GET    /tables                    → Lista todas as mesas fisicas
GET    /table-sessions            → Lista sessoes abertas (mesas em uso)
POST   /table-sessions            → Abre sessao para mesa { table_id }
DELETE /table-sessions/:id/close  → Fecha sessao
```

### Step 2: CRUD de Produtos
```
GET    /products?name=refri  → Lista/filtra produtos
POST   /products             → Cria produto { name, price }
PUT    /products/:id         → Atualiza produto
DELETE /products/:id         → Remove produto
```

### Step 3: Pedido (Order Items)
```
POST /order-items                        → Adiciona item { product_id, quantity, table_session_id }
GET  /order-items?table_session_id=4     → Lista itens da sessao
GET  /table-sessions/:id/summary         → Total e contagem de itens
```

### Step 4: Fechamento
```
DELETE /table-sessions/:id/close → Fecha sessao, calcula total final
```

## Example

**Fluxo completo de teste:**
```bash
# 1. Listar mesas disponiveis
GET /tables

# 2. Verificar quais estao em uso
GET /table-sessions  # → mesas 2 e 3 ocupadas

# 3. Abrir mesa 4
POST /table-sessions { "table_id": 4 }  # → 201 Created

# 4. Tentar abrir mesa ja ocupada
POST /table-sessions { "table_id": 2 }  # → 400 "mesa ocupada"

# 5. Buscar produto por nome
GET /products?name=refri  # → [{ id: 23, name: "Refrigerante", price: 7.50 }]

# 6. Adicionar itens ao pedido
POST /order-items { "product_id": 17, "quantity": 1, "table_session_id": 4 }
POST /order-items { "product_id": 23, "quantity": 2, "table_session_id": 4 }

# 7. Ver resumo
GET /table-sessions/4/summary  # → { total: 90.00, items: 3 }

# 8. Fechar mesa
DELETE /table-sessions/4/close  # → 200 "mesa fechada"

# 9. Tentar fechar novamente
DELETE /table-sessions/4/close  # → 400 "mesa ja fechada"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mesa sem sessao aberta | Permitir abertura |
| Mesa com sessao ativa | Retornar erro 400 com mensagem clara |
| Busca de produto sem filtro | Retornar todos os produtos |
| Fechamento de mesa sem itens | Permitir (conta zerada) |
| Produto deletado que estava em pedido | Manter referencia historica no pedido |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Vincular pedido direto a mesa fisica | Vincular pedido a `table_session` |
| Retornar 500 ao fechar mesa ja fechada | Retornar 400 com mensagem descritiva |
| Filtrar produtos no frontend | Aceitar query parameter `name` na API |
| Calcular total no cliente | Endpoint de summary calcula no backend |
| Deletar sessao ao fechar | Marcar como `closed_at` (soft close) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do fluxo, modelo de dados e decisoes arquiteturais
- [code-examples.md](references/code-examples.md) — Todos os exemplos de requisicao e resposta expandidos

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-recap-2028/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-recap-2028/references/code-examples.md)
