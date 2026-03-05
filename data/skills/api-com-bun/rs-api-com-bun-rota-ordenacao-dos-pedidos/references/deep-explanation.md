# Deep Explanation: Ordenacao com Drizzle ORM

## Por que o orderBy precisa de callback em subqueries

Quando voce cria uma subquery com `.as('baseQuery')` e usa ela no `FROM`, e como se voce criasse uma nova tabela. A tabela original `orders` nao existe mais nesse contexto — apenas `baseQuery` existe. Por isso, `orders.createdAt` nao funciona no orderBy. O Drizzle resolve isso passando os campos disponiveis via callback: `(fields) => [...]`, onde `fields` contem exatamente os campos definidos no `select` da subquery.

## A armadilha da ordenacao alfabetica de status

O instrutor destaca um problema real de negocio: num painel de gerenciamento, pedidos pendentes precisam aparecer primeiro porque exigem acao imediata do gerente. Se voce ordenar o campo `status` como string, a ordem alfabetica seria: `cancelled → delivered → delivering → pending → processing` — completamente inutil para o caso de uso.

A solucao e transformar o status em numero via SQL CASE, onde cada status recebe um valor que reflete sua prioridade de negocio. Como a ordenacao padrao e crescente (ASC), `pending = 1` aparece primeiro.

## Por que usar 99 para cancelled

O instrutor atribui `99` ao status `cancelled` em vez de `5` sequencial. A razao: se novos status forem adicionados no futuro (ex: `refunded`, `on_hold`), voce pode atribuir 5, 6, 7 sem precisar mudar o valor de `cancelled`, que semanticamente deve ser sempre o ultimo.

## Interpolacao de campos no sql template

Dentro do `sql` template literal do Drizzle, voce pode interpolar campos TypeScript: `${fields.status}`. Isso insere o nome correto da coluna no SQL gerado. A alternativa seria escrever `"status"` como string, mas se o nome da coluna mudar no schema, a query quebraria silenciosamente sem erro de TypeScript.

## Drizzle como ORM hibrido

O instrutor destaca que o Drizzle e um dos ORMs que melhor permite misturar SQL "raw" (escrito na mao) com a sintaxe mais simples do ORM para queries basicas. O `sql` template literal e o mecanismo principal para isso — qualquer SQL valido pode ser escrito dentro dele e integrado com os builders do Drizzle (orderBy, where, select, etc).

## Tratamento de erros Not Found

Antes de entrar na ordenacao, o instrutor adiciona um case para erros `not found` no error handler do servidor, retornando status 404 com resposta vazia. Isso evita que erros de rota inexistente poluam o console com stack traces desnecessarios.