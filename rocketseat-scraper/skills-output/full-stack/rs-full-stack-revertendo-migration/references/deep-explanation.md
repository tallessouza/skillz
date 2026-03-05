# Deep Explanation: Revertendo Migrations (Knex)

## O metodo down — a outra metade da migration

Toda migration tem dois metodos: `up` (o que fazer) e `down` (como desfazer). O `down` e o inverso exato do `up`. Se o `up` cria uma coluna, o `down` remove. Se o `up` cria uma tabela, o `down` dropa.

O `down` so e util se for escrito corretamente. Uma migration sem `down` funcional nao pode ser revertida — o Knex vai executar o metodo vazio e nada acontece no banco.

## Como o Knex organiza em Batches

O Knex nao rastreia migrations individualmente para rollback — ele usa o conceito de **batch**. Toda vez que voce roda `migrate:latest`, todas as migrations pendentes executadas naquela rodada recebem o mesmo numero de batch.

Exemplo:
- Batch 1: `create_users`, `create_courses` (executadas juntas)
- Batch 2: `add_updated_at_to_courses` (executada depois)

Quando voce roda `migrate:rollback` (sem --all), ele desfaz apenas o ultimo batch. Entao se o batch 2 tinha so uma migration, so ela e revertida. Se tinha 3, as 3 sao revertidas.

### A tabela knex_migrations

O Knex mantem uma tabela interna chamada `knex_migrations` que registra:
- Nome da migration
- Numero do batch
- Timestamp de execucao

Quando voce faz `rollback --all`, essa tabela fica vazia. Quando reexecuta com `latest`, ela e preenchida novamente.

Tambem existe a `knex_migrations_lock` que previne execucoes concorrentes.

## Cenarios praticos do instrutor

### Cenario 1: Desfazer migration especifica
O instrutor mostrou que ao rodar `migrate:down` com o nome exato da migration, apenas aquela alteracao e revertida. No caso, a coluna `updated_at` sumiu da tabela `courses`, mas a tabela continuou existindo.

### Cenario 2: Rollback por batch
Ao rodar `migrate:rollback`, o Knex identifica o ultimo batch e desfaz todas as migrations daquele batch. O instrutor destacou que isso e regressivo — voce pode ir rodando rollback varias vezes para ir voltando batch por batch.

### Cenario 3: Rollback total
Com `migrate:rollback --all`, tudo e desfeito. Tabelas somem, a tabela de controle fica vazia. E o "reset" completo. Depois, `migrate:latest` reconstroi tudo do zero.

## Quando usar cada abordagem

- **migrate:down {arquivo}**: Quando voce sabe exatamente qual migration quer reverter e nao quer afetar outras. Precisao cirurgica.
- **migrate:rollback**: Quando o ultimo conjunto de migrations (batch) precisa ser desfeito. Comum durante desenvolvimento quando voce roda, testa, e percebe que precisa ajustar.
- **migrate:rollback --all**: Quando quer resetar o banco completamente. Comum em ambiente de desenvolvimento. Perigoso em producao.

## Cuidados em producao

Em producao, voce quase nunca faz rollback. Se precisa corrigir algo, cria uma nova migration que faz a correcao. Rollback em producao pode causar perda de dados, porque o `down` geralmente dropa colunas/tabelas — e os dados que estavam la se perdem.