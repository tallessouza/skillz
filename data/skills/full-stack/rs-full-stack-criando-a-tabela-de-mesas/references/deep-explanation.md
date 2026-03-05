# Deep Explanation: Criando a Tabela de Mesas

## Por que migrations existem

Migrations sao o versionamento do schema do banco de dados. Assim como o Git versiona codigo, migrations versionam a estrutura de tabelas. Cada migration e uma transformacao atomica: tem um `up` (aplicar) e um `down` (reverter).

O instrutor enfatiza que o metodo `down` deve **desfazer exatamente o que o `up` faz**. Se o `up` cria uma tabela, o `down` deleta essa tabela com `dropTable`. Isso garante que voce pode voltar atras em qualquer mudanca de schema.

## O padrao increments + primary

Ao usar `table.increments("id")`, o Knex gera automaticamente:
- Coluna do tipo integer
- Auto-increment (cada novo registro recebe id = anterior + 1)
- Quando encadeado com `.primary()`, define como chave primaria

Isso elimina a necessidade de gerenciar IDs manualmente. O banco de dados cuida da unicidade e sequencia.

## Por que table_number e notNullable

No dominio de restaurante, uma mesa sem numero nao tem significado. O instrutor explicitamente diz: "nao vamos permitir nulo aqui, sim, precisa ser informado". Isso reflete uma regra de negocio — toda mesa deve ter um numero identificador visivel para garcons e clientes.

## O padrao de timestamps com defaultTo

O instrutor usa um padrao especifico para `created_at` e `updated_at`:

1. **Tipo `timestamp`** — armazena data e hora
2. **`.nullable()`** — o campo aceita nulo no schema (nao e exigido na insercao)
3. **`.defaultTo(knex.fn.now())`** — se nenhum valor for fornecido, usa a data/hora atual do servidor

A logica e: "o usuario nao precisa informar a data de criado para cadastrar, porque a gente pode passar como valor padrao". Isso simplifica a API — o cliente envia apenas os dados de negocio (numero da mesa) e o banco cuida dos metadados temporais.

## Fluxo de CLI para migrations

O instrutor demonstra dois comandos:

1. **Criar migration:** `npm run knex -- migrate:make create_tables`
   - Gera um arquivo com timestamp no nome dentro de `database/migrations/`
   - O arquivo vem com esqueleto de `up` e `down`

2. **Executar migrations:** `npm run knex -- migrate:latest`
   - Aplica todas as migrations pendentes em ordem cronologica
   - O Knex rastreia quais ja foram executadas na tabela `knex_migrations`

## Verificacao no banco

Apos executar a migration, o instrutor abre o cliente de banco de dados, atualiza, e confirma que a tabela `tables` apareceu. Tambem executa um `SELECT * FROM tables` para confirmar que esta vazia — pronta para receber dados via seed (proxima aula).

## Relacao com a tabela de produtos

Esta e a segunda migration do projeto. A primeira criou a tabela de produtos. O padrao e identico: `increments` + campos de dominio + timestamps. Isso estabelece uma convencao do projeto que deve ser seguida em todas as tabelas futuras.