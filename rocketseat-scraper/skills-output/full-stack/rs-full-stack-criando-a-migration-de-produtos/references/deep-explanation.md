# Deep Explanation: Criando Migrations de Produtos com Knex.js

## Por que migrations existem

Migrations sao o controle de versao do banco de dados. Assim como git rastreia mudancas no codigo, migrations rastreiam mudancas na estrutura do banco. Cada migration tem duas funcoes:

- **up**: aplica a mudanca (cria tabela, adiciona coluna, etc.)
- **down**: desfaz a mudanca (deleta tabela, remove coluna, etc.)

Essa reversibilidade e fundamental. Se algo der errado, voce pode fazer rollback para o estado anterior.

## Increments vs Integer para ID

O instrutor usa `table.increments('id')` em vez de `table.integer('id')`. A diferenca e crucial:

- `increments` cria uma coluna INTEGER com auto-incremento e a define como PRIMARY KEY automaticamente
- Isso significa que ao inserir um novo produto, voce NAO precisa informar o id — o banco gera sozinho
- Cada novo registro recebe o proximo numero na sequencia (1, 2, 3...)

## Por que `decimal` para preco

Precos tem casas decimais: R$ 10,75 por exemplo. Se usarmos `integer`, perdemos a parte decimal. O tipo `decimal` armazena o valor com precisao, evitando erros de arredondamento que `float` poderia causar.

## Timestamps com `defaultTo(knex.fn.now())`

O instrutor usa `knex.fn.now()` como valor padrao para `created_at` e `updated_at`. Isso significa:

- **Na criacao**: ambos recebem a data/hora atual automaticamente
- **Na atualizacao**: `updated_at` sera modificado (pela aplicacao) para refletir quando o produto foi alterado pela ultima vez
- **Por que nao `notNullable`**: como o campo tem `defaultTo`, ele nunca sera null na pratica — o banco preenche automaticamente

A funcao `knex.fn.now()` e traduzida para a funcao nativa do banco (ex: `CURRENT_TIMESTAMP` no SQLite/PostgreSQL).

## O padrao up/down

O instrutor enfatiza que `down` desfaz o que `up` faz:
- `up` cria a tabela `product` → `down` faz `dropTable('product')`
- Isso permite reverter a migration se necessario

## Executando a migration

O comando `npx knex migrate:latest` executa todas as migrations pendentes. O Knex mantém internamente um registro de quais migrations ja foram executadas, entao so aplica as novas.

## `text` vs `string` para nome

O instrutor usa `table.text('name')` em vez de `table.string('name')`. No SQLite (usado neste curso), ambos funcionam de forma similar. Em PostgreSQL, `text` nao tem limite de tamanho enquanto `string` mapeia para `varchar(255)`. Para nomes de produtos, ambos servem, mas `text` e mais flexivel.