# Deep Explanation: Exibindo Total do Item do Pedido

## Por que calcular no SQL e nao no JavaScript?

O instrutor demonstra que ao ter `price` e `quantity` na tabela de pedidos, a multiplicacao deve acontecer direto na query SQL via `knex.raw()`. Isso tem tres vantagens:

1. **Performance** — O banco de dados processa a multiplicacao sem transferir dados extras para a aplicacao. Em listagens com milhares de itens, isso faz diferenca.

2. **Consistencia** — Se o calculo esta no SQL, qualquer cliente que consulte os dados (API, dashboard, relatorio) recebe o mesmo resultado. Se esta no JS, cada consumidor precisa reimplementar.

3. **Arredondamento** — Bancos de dados tem regras bem definidas de precisao decimal. JavaScript usa floating point (IEEE 754) e pode gerar arredondamentos inesperados com valores monetarios.

## O problema do nome automatico

Quando voce faz `knex.raw('orders.price * orders.quantity')` sem alias, o banco retorna a coluna com um nome gerado automaticamente — algo como `orders.price * orders.quantity` ou `?column?`. Isso e ilegivel e quebra qualquer frontend que espere um nome de campo.

A solucao do instrutor: envolver em parenteses e usar `as total`:

```sql
(orders.price * orders.quantity) as total
```

Os parenteses garantem que a expressao inteira e tratada como uma unidade antes do alias.

## Ambiguidade de colunas em joins

O instrutor enfatiza: **"por isso que e importante definir de que tabela voce quer pegar a coluna"**. Tanto a tabela `products` quanto `orders` tem `created_at` e `updated_at`. Sem o prefixo da tabela, o banco nao sabe qual voce quer e retorna erro de ambiguidade.

Regra pratica: em qualquer query com join (ou potencial futuro join), sempre prefixe com o nome da tabela.

## OrderBy com desc

O instrutor mostra a logica: em uma listagem de itens de pedido, o usuario quer ver o mais recente primeiro. Sem `desc`, a ordenacao e ascendente (mais antigo primeiro). Com `desc`, inverte — o ultimo item adicionado aparece no topo.

O instrutor testa sem `desc` primeiro, percebe que a ordem nao e ideal, e entao adiciona. Esse e um padrao comum: listagens de atividade/pedidos quase sempre sao `desc`.

## Quando NAO usar knex.raw()

- Agregacoes simples: use `.sum()`, `.count()`, `.avg()` do Knex
- Operacoes que envolvem logica condicional complexa: considere views no banco
- Se a expressao fica muito longa (>3 operacoes): considere uma view ou subquery