# Deep Explanation: Rota de Listagem com Paginacao e Filtros

## Por que duas queries?

O front-end precisa de dois dados para montar paginacao: os registros da pagina atual e o total de registros. Sem o total, nao ha como calcular quantas paginas existem. Entao toda listagem paginada exige no minimo duas queries.

## O padrao da Base Query

O insight central da aula e que ambas as queries (count e data) precisam dos mesmos filtros. Se voce filtra por nome do cliente, o count tambem precisa estar filtrado, senao o total de paginas estara errado.

A solucao e criar a query sem executar (sem `await`), e depois usar `.as('nome')` para transforma-la em subquery. O Drizzle permite usar o retorno de uma query como `from` de outra, tratando-a como uma tabela virtual.

## Filtros condicionais com undefined

No Drizzle, dentro de `and()`, qualquer posicao que receba `undefined` e simplesmente ignorada. Isso permite o padrao elegante:

```typescript
customerName ? ilike(users.name, `%${customerName}%`) : undefined
```

Se o filtro nao foi enviado, retorna `undefined` e o Drizzle descarta aquela condicao. Sem isso, voce precisaria de builders imperativos ou concatenacao manual de WHERE.

## Por que `getTableColumns()`?

Quando voce faz um `innerJoin` entre `orders` e `users`, um `select()` vazio traz TODOS os campos de AMBAS as tabelas. Se ambas tem um campo `id`, o banco nao sabe qual voce quer — erro "column reference is ambiguous".

`getTableColumns(orders)` retorna um objeto com todos os campos da tabela orders, usado no `select()` para explicitar que so queremos colunas de orders.

## Por que `count(orders.id)` e nao `count()`?

Mesmo problema de ambiguidade. `count()` sem argumento tenta resolver `*`, que em contexto de join pode ser ambiguo. Passar um campo especifico (`orders.id`) elimina a ambiguidade.

## PageIndex vs PageNumber

Usando base 0 (pageIndex), o calculo de offset e direto: `pageIndex * perPage`. Com base 1 (pageNumber), seria `(pageNumber - 1) * perPage` — um off-by-one esperando para acontecer.

## Drizzle Typebox para validacao de enums

Em vez de duplicar os valores do enum de status manualmente no schema de validacao, `createSelectSchema(orders).properties.status` extrai o schema Typebox diretamente da definicao da tabela. Se amanha voce adicionar um novo status na tabela, a validacao se atualiza automaticamente.

## `t.Numeric()` vs `t.Number()`

Query parameters da URL sao sempre strings. `t.Number()` rejeitaria "0" porque e string. `t.Numeric()` aceita strings que representam numeros e converte automaticamente para number. Essencial para qualquer parametro numerico vindo de URL.

## Inner Join vs Left Join

O instrutor escolheu `innerJoin` com a tabela de users para filtrar por nome do cliente. Inner join significa que orders sem customer nao aparecem — o que faz sentido neste contexto, ja que todo pedido deve ter um cliente. Se usasse `leftJoin`, orders sem cliente tambem apareceriam, o que seria incorreto para o filtro.

## Promise.all para queries paralelas

As duas queries (count e data) sao independentes entre si. Usar `Promise.all` executa ambas em paralelo, reduzindo o tempo de resposta pela metade comparado a executar sequencialmente com dois `await`.