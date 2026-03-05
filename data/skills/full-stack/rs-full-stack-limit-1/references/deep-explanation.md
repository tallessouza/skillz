# Deep Explanation: SQL LIMIT

## Por que LIMIT existe

Em tabelas com milhares ou milhoes de registros, retornar todos os dados e inviavel — tanto por performance quanto por consumo de memoria. O LIMIT permite que o banco de dados pare de processar assim que atingir o numero solicitado de registros, economizando recursos.

## Ordem de execucao das clausulas SQL

O SQL processa as clausulas nesta ordem:

1. `FROM` — identifica a tabela
2. `WHERE` — filtra registros
3. `GROUP BY` — agrupa
4. `HAVING` — filtra grupos
5. `SELECT` — projeta colunas
6. `ORDER BY` — ordena resultado
7. `LIMIT` — corta no numero especificado

Por isso LIMIT vai sempre no final da query — ele atua sobre o resultado ja ordenado.

## A armadilha do LIMIT sem ORDER BY

O instrutor demonstrou a construcao passo a passo: primeiro `SELECT *`, depois `ORDER BY price`, depois `DESC`, e so entao `LIMIT 3`. Essa sequencia nao e acidental.

Sem ORDER BY, o banco retorna registros na ordem que encontrar — que pode mudar entre execucoes. Um `LIMIT 3` sem ORDER BY hoje pode retornar registros diferentes amanha, criando bugs intermitentes dificeis de diagnosticar.

## DESC vs ASC — a direcao importa

O instrutor mostrou que ao aplicar `ORDER BY price` sem especificar direcao, os registros vieram do menor para o maior (ASC e o padrao). Para obter os mais caros, foi necessario adicionar `DESC` explicitamente.

**Regra pratica:** sempre escreva a direcao explicitamente. Mesmo que ASC seja o default, escrever `ASC` torna a intencao clara para quem le a query.

## LIMIT como ferramenta de ranking

O instrutor usou a analogia de ranking: "digamos que voce queira fazer um ranking e mostrar apenas o primeiro". Com `LIMIT 1` voce obtem o primeiro colocado, com `LIMIT 3` o top 3, etc.

Esse padrao e extremamente comum:
- Produto mais vendido
- Usuario mais ativo
- Pedido mais recente
- Top 10 de qualquer metrica

## Performance

LIMIT nao e apenas conveniencia — e otimizacao. Quando o banco sabe que so precisa de N registros, pode parar a busca mais cedo (especialmente com indices adequados na coluna do ORDER BY).