# Deep Explanation: Realizando Queries com Knex

## Por que `.returning('*')` e necessario

No SQL padrao, um `INSERT INTO` nao retorna os dados que foram inseridos. O comportamento padrao e retornar apenas a contagem de linhas afetadas. No Knex, isso se traduz em receber `[1]` como resposta — apenas o numero "1 linha inserida".

Para obter os dados de volta, no SQL voce precisaria adicionar uma clausula `RETURNING *` ao final da query. O Knex abstrai isso com o metodo `.returning('*')`, que faz exatamente isso. O instrutor demonstrou isso ao vivo: primeiro fez o insert sem returning e recebeu `1`, depois adicionou `.returning('*')` e recebeu o objeto completo.

**Nota importante:** `.returning()` funciona nativamente em PostgreSQL e SQLite. No MySQL, o comportamento pode variar.

## UUID com crypto nativo

O Node.js possui o modulo `crypto` (ou `node:crypto` com o prefixo moderno) que inclui o metodo `randomUUID()`. Isso gera um UUID v4 valido — um identificador unico composto por numeros e caracteres (hexadecimais), com formato como `550e8400-e29b-41d4-a716-446655440000`.

O instrutor enfatizou que nao precisa de biblioteca externa para isso. O tipo do campo `id` na migration foi definido como `uuid`, entao o valor gerado por `randomUUID()` e perfeitamente compativel.

## Campos nullable nao precisam ser enviados

Quando uma coluna e criada na migration sem `.notNullable()`, ela aceita `null` por padrao. O instrutor mostrou isso com o campo `session_id` — como nao foi marcado como obrigatorio na migration, nao precisa ser enviado no insert e o banco aceita normalmente.

## A API como porta de entrada para o banco

O instrutor contextualizou que a grande maioria das APIs e servicos web sao essencialmente **portas de entrada para o usuario manipular o banco de dados**, sempre anexadas a regras de negocio. As rotas da aplicacao fazem operacoes no banco (insert, select, update, delete) com validacoes e logica de negocio ao redor.

## Metodos de filtragem do Knex

O `.where()` do Knex oferece diversas opcoes de filtragem (where, whereIn, whereNot, whereBetween, etc.). O instrutor mostrou o IntelliSense com "um monte de opcoes" disponiveis. Para queries simples, `.where('campo', valor)` e suficiente. Para queries mais complexas, o Knex suporta encadeamento de multiplos wheres e operadores.