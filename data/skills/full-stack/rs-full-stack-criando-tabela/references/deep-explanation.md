# Deep Explanation: Criando Tabelas com Knex Migrations

## O conceito de up e down

O instrutor explica que migrations funcionam como um sistema de versionamento do banco de dados. Cada migration tem duas funcoes:

- **`up`**: Envia a alteracao ou criacao da tabela para o banco de dados. E o que acontece quando voce quer "ir pra frente" — criar algo novo.
- **`down`**: Desfaz o que a migration fez. E o caminho de volta. Se o `up` criou uma tabela, o `down` deve deletar essa tabela.

Ambas sao **assincronas** (`async`) e ambas recebem o `knex` como parametro para usar os metodos do schema builder.

### Simetria up/down

O principio fundamental e: **o `down` deve ser o inverso exato do `up`**. Se o `up` faz `createTable('courses')`, o `down` faz `dropTable('courses')`. Essa simetria garante que voce pode avançar e retroceder no historico do banco sem inconsistencias.

## O schema builder

O instrutor usa `knex.schema.createTable()` em vez de SQL raw. O primeiro parametro e o nome da tabela (string), o segundo e uma arrow function que recebe `table` — um objeto builder onde voce encadeia metodos para definir colunas.

### Encadeamento de metodos (method chaining)

O Knex usa um padrao de API fluente onde voce encadeia caracteristicas da coluna:

```typescript
table.increments('id').primary()
//    ^tipo          ^restricao
```

Cada metodo adiciona uma caracteristica a coluna. O instrutor destaca: "a gente veio adicionando metodos aqui pra definir as caracteristicas dessa coluna."

## Nomes de tabela no plural

O instrutor faz questao de usar `courses` (plural) para o nome da tabela: "a gente usa sempre no plural." Isso e uma convencao porque a tabela armazena uma **colecao** de registros — muitos cursos, nao um curso.

## Campos com valor padrao

O `created_at` usa `defaultTo(knex.fn.now())` para que o banco preencha automaticamente com a data/hora atual. O instrutor explica: "o usuario nao precisa informar" — por isso nem precisa de `notNullable()`, ja que o default garante que sempre tera valor.

### knex.fn.now()

E uma funcao do Knex que gera a expressao SQL equivalente a "data e horario atual" no banco que estiver sendo usado. E portavel entre SQLite, PostgreSQL, MySQL etc.

## Criacao automatica do banco

O instrutor mostra que ao rodar `npm run knex -- migrate:latest`, se o banco nao existia, ele e criado automaticamente (no caso do SQLite, o arquivo `.db` aparece no diretorio). Isso acontece porque o SQLite cria o arquivo ao primeiro acesso.

## Fluxo completo demonstrado

1. Abrir o arquivo de migration gerado
2. Escrever o `up` com `createTable`
3. Definir colunas com tipos e restricoes
4. Escrever o `down` com `dropTable`
5. Executar com `npm run knex -- migrate:latest`
6. Verificar que o banco foi criado