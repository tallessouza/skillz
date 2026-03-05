# Deep Explanation: Migration de Pedidos

## Por que duplicar o preco na tabela de pedidos?

O instrutor usa um exemplo muito claro: imagine que um refrigerante custa R$7,00 hoje. Voce faz um pedido e paga R$7,00. Amanha, o restaurante muda o preco para R$8,00 na tabela de produtos.

Se o sistema busca o preco via JOIN com a tabela de produtos, **todos os pedidos antigos** passam a mostrar R$8,00 — o preco atual, nao o preco no momento do pedido. O historico financeiro fica completamente corrompido.

A solucao: ao criar o pedido, copiar o preco do produto para a coluna `price` da tabela de pedidos. O usuario nem precisa informar o preco — a aplicacao busca automaticamente da tabela de produtos e armazena separadamente.

### Analogia do recibo

Pense na tabela de pedidos como um recibo impresso. O recibo registra o preco no momento da compra. Se o supermercado muda o preco depois, seu recibo nao muda. A coluna `price` na tabela de pedidos e esse recibo.

## Por que NAO armazenar o total?

Se voce tem `quantity` (3) e `price` (7.00), o total e `3 * 7.00 = 21.00`. Armazenar isso numa coluna `total` cria redundancia:

1. **Risco de inconsistencia** — se alguem atualiza `quantity` sem atualizar `total`, os dados ficam inconsistentes
2. **Espaco desperdicado** — e uma coluna que nao carrega informacao nova
3. **Calculo trivial** — multiplicacao e barata computacionalmente

O instrutor menciona que vai mostrar como calcular isso dinamicamente na aplicacao.

## Estrutura relacional da tabela orders

```
orders
├── id (PK, autoincrement)
├── table_session_id (FK → table_sessions.id)
├── product_id (FK → products.id)
├── quantity (integer, not null)
├── price (decimal, not null) ← preco no momento do pedido
├── created_at (timestamp, default now)
└── updated_at (timestamp, default now)
```

### Relacionamentos

- **Um pedido pertence a UMA sessao de mesa** — por isso `table_session_id` no singular
- **Um pedido referencia UM produto** — por isso `product_id` no singular
- **Uma sessao pode ter MUITOS pedidos** — relacao 1:N
- **Um produto pode estar em MUITOS pedidos** — relacao 1:N

## Nomenclatura de FKs

O instrutor faz uma escolha consciente: usa `table_session_id` (singular) em vez de `table_sessions_id` (plural) porque semanticamente "um pedido pertence a uma sessao", nao a varias.

## O papel do down() na migration

A funcao `down()` com `dropTable` permite reverter a migration. Isso e essencial para:
- Rollback em caso de erro
- Desenvolvimento iterativo
- Ambientes de teste que precisam de banco limpo

## Ordem de criacao das migrations

O instrutor menciona que ja existiam: produtos, mesas e sessoes de mesa. A tabela de orders vem por ultimo porque depende (via FK) das outras tabelas. A ordem de execucao das migrations importa — tabelas referenciadas devem existir antes.

## decimal vs integer para precos

- `integer` para quantidades: ninguem pede 2.5 refrigerantes
- `decimal` para precos: R$70,50 precisa de casas decimais
- Alternativa comum: armazenar em centavos como integer (7050 = R$70,50), mas o instrutor optou por decimal por simplicidade