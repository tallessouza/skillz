# Deep Explanation: Migrations com Knex

## Por que up e down?

O Diego explica que `up` descreve o que a migration faz no banco (criar tabela, adicionar campo) e `down` descreve o inverso exato — o rollback. Se o `up` cria tabela, o `down` dropa. Se o `up` adiciona campo, o `down` remove. Essa simetria e fundamental para manter o banco reversível.

## Por que UUID em vez de auto-increment?

O argumento do Diego: "na maioria das aplicações, vale mais usar uma chave primaria que e um valor mais aleatorio e mais dificil de ser descoberto." IDs sequenciais (1, 2, 3) sao previsíveis — um atacante pode enumerar recursos. UUID gera um codigo unico universal.

Ele reconhece que da para discutir muito mais (integer PKs com campo auxiliar, etc.), mas para a maioria dos casos UUID e a escolha mais segura.

## Por que `knex.fn.now()` em vez de SQL literal?

Este e um dos pontos mais importantes da aula. O Diego mostra o raciocínio:

- SQLite: `CURRENT_TIMESTAMP`
- PostgreSQL: `CURRENT_TIMESTAMP`
- MySQL: `NOW()` (ou `NULL` em alguns contextos)

Se voce escreve `CURRENT_TIMESTAMP` direto, funciona no SQLite e Postgres mas quebra no MySQL. A ideia do Knex e abstrair o banco — entao `knex.fn.now()` retorna a funcao correta para qualquer banco.

O Diego enfatiza: "a ideia da gente estar usando o Knex e o nosso codigo ficar a prova de qualquer banco de dados."

## Regra de ouro das migrations: nunca editar depois de compartilhar

O Diego explica com clareza: "a partir do momento que uma migration foi enviada para a producao ou foi enviada para o nosso time, ela nunca mais pode ser editada."

**Por que?** O Knex anota no banco quais migrations ja foram executadas (tabela `knex_migrations`). Se voce edita uma migration ja executada por outro dev, a edicao nunca sera aplicada na maquina dele — o banco dele ja registrou que aquela migration rodou.

**Solucao se ainda nao compartilhou:**
1. Parar o servidor
2. `npm run knex -- migrate:rollback`
3. Editar a migration
4. `npm run knex -- migrate:latest`

**Solucao se ja compartilhou:**
Criar uma nova migration que faz a correcao (alter table, rename column, etc.)

## Tabelas automaticas do Knex

Ao listar tabelas, o Diego mostra que alem de `transactions`, existem:
- `sqlite_sequence` — tabela interna do SQLite para lidar com auto-incrementos
- `knex_migrations` — registra quais migrations ja rodaram
- `knex_migrations_lock` — controle de concorrencia do Knex

Essas tabelas sao gerenciadas automaticamente e nao devem ser manipuladas manualmente.

## Indices (index)

O Diego introduz indices brevemente: "e uma forma de falar para o banco de dados que eu vou fazer muitas buscas nesse campo dentro do WHERE." O banco cria "como se fosse um cache" de quais valores existem naquela coluna, acelerando buscas.

No exemplo, `session_id` recebe `.index()` porque a aplicacao vai buscar transacoes por sessao frequentemente.

## Metodo `after()` para posicionamento

O Diego mostra `table.uuid('session_id').after('id')` para posicionar a coluna depois de `id` em vez de no final. Ele ressalta que "alguns bancos de dados suportam isso, outros nao" — e um recurso opcional.

## `decimal(precisao, escala)`

Para o campo `amount`, o Diego usa `decimal(10, 2)`:
- 10 = tamanho total do numero
- 2 = casas decimais

Isso e essencial para valores monetarios, onde `float` causaria erros de arredondamento.