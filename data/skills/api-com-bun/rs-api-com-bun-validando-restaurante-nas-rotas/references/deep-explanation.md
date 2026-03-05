# Deep Explanation: Validando Restaurante nas Rotas

## Por que isso e critico

O instrutor identifica uma falha de seguranca comum em APIs multi-tenant: quando um endpoint recebe apenas o ID do recurso (ex: `orderId`) e faz a busca sem verificar se aquele recurso pertence ao usuario autenticado.

Sem essa validacao, qualquer usuario autenticado pode:
- Ver detalhes de pedidos de outros restaurantes
- Aprovar pedidos que nao sao seus
- Cancelar pedidos de terceiros
- Despachar pedidos alheios

Isso e uma violacao classica de **Broken Object Level Authorization (BOLA)** — o #1 no OWASP API Security Top 10.

## O padrao aplicado

O instrutor usa o operador `and()` do Drizzle ORM para compor a clausula WHERE:

```
WHERE order.id = :orderId AND order.restaurantId = :restaurantId
```

O `restaurantId` vem do contexto autenticado (extraido do token/sessao), nao do request.

## Onde aplicar

O instrutor percorre TODAS as rotas que manipulam pedidos:
1. **getOrderDetails** — buscar detalhes
2. **approveOrder** — aprovar pedido
3. **cancelOrder** — cancelar pedido
4. **dispatchOrder** — despachar pedido

A licao principal: quando voce identifica uma validacao faltando, deve revisar TODAS as rotas do mesmo recurso, nao apenas a que voce encontrou o problema.

## Relacao com OWASP

Esta validacao previne:
- **BOLA (Broken Object Level Authorization)** — acesso a recursos de outros tenants
- **IDOR (Insecure Direct Object Reference)** — manipulacao de IDs para acessar dados nao autorizados

E uma das validacoes mais simples de implementar e mais criticas de nao esquecer.