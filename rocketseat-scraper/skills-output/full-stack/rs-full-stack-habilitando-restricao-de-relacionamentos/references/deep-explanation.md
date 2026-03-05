# Deep Explanation: Foreign Keys no SQLite com Knex.js

## Por que SQLite desabilita foreign keys por padrao?

SQLite foi projetado para ser leve e retrocompativel. Foreign key constraints foram adicionados na versao 3.6.19 (2009), mas desabilitados por padrao para nao quebrar aplicacoes existentes. Cada nova conexao inicia com `PRAGMA foreign_keys = OFF`.

## O problema com pools de conexao

Knex.js usa um pool de conexoes (via `tarn.js`). Quando uma nova conexao e criada no pool, ela inicia sem foreign keys. O hook `afterCreate` e executado uma vez para cada conexao criada, garantindo que todas as conexoes do pool tenham o pragma habilitado.

## O que acontece sem o pragma?

Sem `PRAGMA foreign_keys = ON`:
- Voce pode inserir um pedido referenciando um `produto_id` que nao existe
- Voce pode deletar um produto que tem pedidos associados
- O banco aceita qualquer valor em colunas de chave estrangeira
- A integridade referencial depende inteiramente da aplicacao

## O papel do callback `done`

O segundo parametro do `afterCreate` e um callback que sinaliza ao pool que a conexao esta pronta. O `connection.run()` do SQLite aceita um callback como segundo argumento, que e chamado quando o comando termina. Passar `done` diretamente e elegante porque a assinatura e compativel.

## Analogia do instrutor

Pense no pragma como uma trava de seguranca: sem ela, o banco aceita qualquer coisa. Com ela, o banco rejeita dados que violam os relacionamentos definidos nas migrations. E uma garantia de consistencia no nivel do banco de dados.

## Edge cases

- **Banco in-memory (`:memory:`)**: Tambem precisa do pragma, pois cada conexao e independente
- **Multiplos arquivos de banco**: O pragma e por conexao, nao por arquivo
- **Migrations**: O pragma deve estar ativo durante migrations que criam FKs, caso contrario as constraints sao criadas mas nao validadas em dados existentes