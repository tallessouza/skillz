# Deep Explanation: API de Restaurante — Fluxo Completo

## Modelo Mental: Mesa vs Sessao

A distincao fundamental e que **mesa e um recurso fisico** (sempre existe) e **sessao e um recurso temporal** (criada quando cliente senta, fechada quando paga). Isso permite:

- Uma mesa ter historico de multiplas sessoes
- Consultar "mesas em uso" filtrando sessoes abertas
- Fechar conta sem deletar a mesa

A analogia do instrutor: o cliente chega, abre a mesa (cria sessao), consome (adiciona itens ao pedido via sessao), e fecha a mesa (encerra sessao). A mesa fisica continua existindo para o proximo cliente.

## Por que validar mesa ocupada?

Se duas sessoes abertas existirem para a mesma mesa, o garcom nao sabe em qual sessao adicionar itens. O sistema retorna "mesa ocupada" preventivamente. Isso e uma regra de negocio, nao uma constraint tecnica — embora uma UNIQUE constraint parcial (`WHERE closed_at IS NULL`) no banco garanta isso tambem.

## Fluxo de Dados Completo

```
Cliente chega
    → POST /table-sessions { table_id: 4 }
    → Valida: mesa existe? mesa tem sessao aberta? 
    → Cria table_session (id=4, table_id=4, opened_at=now, closed_at=null)

Cliente pede
    → GET /products?name=refri (garcom busca)
    → POST /order-items { product_id: 23, quantity: 2, table_session_id: 4 }
    → Vincula item a sessao, nao a mesa

Cliente quer ver conta
    → GET /table-sessions/4/summary
    → JOIN order_items + products WHERE table_session_id=4
    → Retorna { total: 90.00, items: 3 }

Cliente paga
    → DELETE /table-sessions/4/close (ou PATCH)
    → Seta closed_at=now
    → Mesa fica disponivel para nova sessao
```

## Filtro de Produtos por Query Parameter

O instrutor demonstra que a API aceita `?name=refri` e retorna matches parciais. Isso e implementado com `ILIKE '%refri%'` no banco ou `.filter(name LIKE ?)`. A busca e case-insensitive para facilitar uso pelo garcom.

## Idempotencia no Fechamento

Fechar mesa ja fechada nao deve ser um erro catastrofico. O instrutor mostra que a API retorna uma mensagem amigavel ("mesa ja foi fechada") em vez de erro 500. Isso protege contra double-click do garcom ou retry de rede.

## CRUD Completo de Produtos

O instrutor demonstra o ciclo completo:
1. **Create** — `POST /products { name: "Sorvete de chocolate", price: 15 }`
2. **Read** — `GET /products?name=sorvete` (filtrado)
3. **Update** — `PUT /products/25 { name: "Sorvete de morango", price: 15 }`
4. **Delete** — `DELETE /products/25`
5. **Verify** — `GET /products?name=sorvete` retorna vazio

Esse padrao de "criar, verificar, modificar, deletar, verificar novamente" e a forma correta de testar CRUD manualmente.

## Resumo do Pedido vs Lista de Itens

Existem dois endpoints complementares:
- **Lista de itens** (`GET /order-items?table_session_id=4`) — retorna cada item individual com produto, quantidade e preco
- **Resumo** (`GET /table-sessions/4/summary`) — retorna total agregado e contagem

O garcom usa a lista para conferir o pedido. O caixa usa o resumo para cobrar.