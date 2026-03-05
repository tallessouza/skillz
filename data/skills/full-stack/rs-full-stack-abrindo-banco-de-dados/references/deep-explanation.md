# Deep Explanation: Abrindo Banco de Dados SQLite

## Por que inspecionar visualmente o banco?

O instrutor enfatiza que apos rodar migrations, o passo seguinte e **abrir o banco e confirmar visualmente** que tudo foi criado. Isso evita descobrir problemas estruturais apenas quando a aplicacao ja esta rodando e falhando.

## Tabelas internas do SQLite

### `sqlite_sequence`

O SQLite usa essa tabela internamente para rastrear o ultimo valor de auto-incremento de cada tabela. Quando voce define uma coluna com `AUTOINCREMENT`, o SQLite:

1. Cria uma entrada em `sqlite_sequence` com o nome da tabela
2. Armazena o ultimo valor usado (`seq`)
3. Ao inserir novo registro, consulta essa tabela para determinar o proximo valor

Isso garante que IDs nunca sejam reutilizados, mesmo apos delecao de registros.

### `knex_migrations`

O Knex cria essa tabela automaticamente para rastrear quais migrations ja foram executadas. Cada registro contem:

- **id**: Identificador unico
- **name**: Nome do arquivo da migration (ex: `20240101120000_create_courses.js`)
- **migration_time**: Timestamp de quando foi executada

Isso permite que o Knex saiba quais migrations ja rodaram e quais ainda precisam ser executadas ao rodar `migrate:latest`.

### `knex_migrations_lock`

Tabela de controle que previne execucao simultanea de migrations. Importante em ambientes com multiplas instancias.

## Inferencia de tipos no SQLite

O instrutor destaca um ponto importante: ao usar `increments()` no Knex, voce nao precisa declarar explicitamente que a coluna e `INTEGER`. O Knex, junto com o SQLite, infere o tipo automaticamente pelo fato de ser auto-incremento.

O SQLite tem tipagem dinamica (type affinity), diferente de bancos como PostgreSQL. Os tipos definidos na migration servem como "sugestoes" — o SQLite faz o mapeamento para suas 5 afinidades: TEXT, NUMERIC, INTEGER, REAL, BLOB.

## Fluxo mental do instrutor

```
Migration criada → Migration executada → Abrir Beekeeper → Confirmar estrutura → Seguir desenvolvimento
```

Esse fluxo de verificacao e um habito de desenvolvimento: nunca assumir que o codigo fez o que deveria sem confirmar.