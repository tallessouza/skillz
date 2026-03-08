---
name: rs-full-stack-conhecendo-o-projeto-2028
description: "Applies restaurant API domain model when building order management systems with Express. Use when user asks to 'create restaurant API', 'build order system', 'design table session flow', or 'model restaurant database'. Enforces table session lifecycle (open/close), order-to-session relationships, and correct entity modeling. Make sure to use this skill whenever building restaurant or order management APIs. Not for frontend UI, authentication, or payment gateway integration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-rest
  tags: [express, api, restaurant, domain-modeling, database]
---

# API de Pedidos para Restaurante — Modelo de Domínio

> Modele o sistema de pedidos com ciclo de vida de sessões de mesa: abertura, pedidos vinculados à sessão, fechamento com totalização.

## Key concept

O restaurante opera com um ciclo: mesa disponível → cliente chega → abre sessão → cliente faz pedidos vinculados à sessão → cliente encerra conta → fecha sessão (totaliza valor) → mesa disponível novamente. Pedidos nunca se vinculam diretamente à mesa — sempre passam pela sessão, porque uma mesa tem múltiplas sessões ao longo do dia.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Precisa registrar pedido | Vincular ao `table_session_id`, nunca ao `table_id` diretamente |
| Precisa totalizar conta | Somar pedidos da sessão ativa (status open) |
| Mesa precisa ficar disponível | Fechar a sessão, não deletar dados |
| Novo cliente na mesma mesa | Criar nova sessão, não reutilizar a anterior |

## Entidades do banco de dados

### Products
```sql
-- Dados do produto: nome e preço
products: id, name, price
```

### Tables
```sql
-- Mesas do restaurante identificadas por número
tables: id, table_number
```

### Table Sessions
```sql
-- Sessão de uso da mesa (abertura e fechamento)
table_sessions: id, table_id, opened_at, closed_at
```

### Orders
```sql
-- Pedidos vinculados a uma sessão de mesa
orders: id, table_session_id, product_id, quantity, created_at
```

## Relacionamentos

```
tables 1───N table_sessions 1───N orders N───1 products
```

- Uma mesa tem muitas sessões ao longo do dia
- Uma sessão tem muitos pedidos
- Um pedido referencia um produto

## Ciclo de vida da sessão

```
Mesa disponível
    │
    ▼ [Cliente chega → POST /table-sessions]
Sessão aberta (closed_at = null)
    │
    ├── POST /orders (vincula à sessão)
    ├── POST /orders
    ├── ...
    │
    ▼ [Cliente encerra conta → PATCH /table-sessions/:id/close]
Sessão fechada (closed_at = timestamp)
    │
    ▼ Mesa disponível novamente
```

## Heuristics

| Situação | Ação |
|----------|------|
| Verificar se mesa está ocupada | Checar se existe sessão com `closed_at IS NULL` para aquela mesa |
| Calcular total da conta | `SUM(products.price * orders.quantity)` WHERE session_id = X |
| Listar mesas disponíveis | Mesas sem sessão aberta (`closed_at IS NULL`) |
| Histórico de consumo da mesa | Listar todas as sessões com seus pedidos |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Vincular pedido direto à mesa | Vincular pedido à sessão da mesa |
| Usar flag `is_occupied` na mesa | Derivar ocupação da existência de sessão aberta |
| Deletar sessão ao fechar | Setar `closed_at` com timestamp |
| Uma sessão por mesa no schema | Permitir N sessões por mesa (1:N) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Pedido vinculado a mesa errada | Vinculando ao `table_id` em vez de `table_session_id` | Sempre vincule pedidos ao `table_session_id` da sessao ativa |
| Mesa aparece como ocupada apos fechar conta | Sessao nao foi fechada corretamente | Verifique que `closed_at` recebeu timestamp no PATCH de fechamento |
| Total da conta incorreto | Query nao faz JOIN com products para pegar preco | Use `SUM(products.price * orders.quantity)` com JOIN na tabela products |
| Duas sessoes abertas na mesma mesa | Falta validacao ao abrir sessao | Verifique se ja existe sessao com `closed_at IS NULL` antes de criar nova |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o ciclo de sessões e decisões de modelagem
- [code-examples.md](references/code-examples.md) — Exemplos de endpoints Express e queries SQL