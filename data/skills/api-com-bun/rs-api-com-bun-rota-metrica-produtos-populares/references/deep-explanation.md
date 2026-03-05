# Deep Explanation: Rota Metrica Produtos Populares

## Por que partir da tabela pivo?

O instrutor inicialmente tentou partir da tabela `products` mas percebeu que isso exigiria mais joins em cadeia: products → orderItems → orders. Ao inverter e partir de `orderItems` (a tabela pivo/intermediaria), os joins ficam mais simples porque ela ja tem as foreign keys para ambos os lados.

Nas palavras do instrutor: "como eu peguei na tabela pivô que é a do meio delas [...] é melhor a gente fazer dessa forma."

Esse padrao se aplica sempre que voce tem um relacionamento N:N mediado por uma tabela intermediaria. A tabela pivo e o ponto de partida natural para agregacoes.

## leftJoin vs innerJoin

O instrutor explica a escolha: "um produto pode estar em vários pedidos, correto?" — por isso leftJoin. Na pratica, para esta query especifica onde estamos partindo de orderItems, todos os registros ja tem produto associado. Mas o leftJoin e mais seguro semanticamente para preservar registros mesmo quando o lado direito nao tem correspondencia.

## Regra do groupBy + select

O instrutor destaca uma regra fundamental do SQL que o Drizzle ORM respeita: "toda vez que você coloca algum campo da tabela no groupBy, esse campo obrigatoriamente precisa aparecer no select." Isso nao e uma limitacao do ORM — e uma regra SQL. Campos nao agregados que aparecem no SELECT devem estar no GROUP BY.

## sum() retorna string

O Drizzle ORM retorna agregacoes como string por padrao. O instrutor usa `.mapWith(Number)` para converter. Isso e um detalhe importante que pode causar bugs silenciosos se esquecido — comparacoes e ordenacoes com strings numericas se comportam diferente de numeros.

## orderBy com sintaxe de funcao

O instrutor usa `orderBy((fields) => desc(fields.amount))` ao inves de referenciar a variavel diretamente. Isso porque o campo `amount` e um alias definido no select, e a sintaxe de funcao do Drizzle permite acessar esses campos computados.

## Fluxo iterativo do instrutor

O instrutor construiu a query incrementalmente:
1. Primeiro o `from` + joins sem select definido
2. Depois adicionou o select com os campos
3. Testou sem agregacao para ver os dados
4. Adicionou o `sum` com `mapWith(Number)`
5. Adicionou o `orderBy` descendente
6. Por fim o `.limit(5)`

Esse fluxo iterativo e uma boa pratica para queries complexas — construa e teste em etapas.