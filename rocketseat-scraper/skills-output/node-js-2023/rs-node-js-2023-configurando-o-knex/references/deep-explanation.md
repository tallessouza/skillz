# Deep Explanation: Configurando o Knex

## Por que Knex e nao um ORM?

O Knex e um **query builder**, nao um ORM. Isso significa que ele constroi queries SQL de forma programatica sem abstrair o modelo de dados em classes/entidades. A escolha do Knex na trilha da Rocketseat e intencional — ensina SQL real enquanto oferece conveniencia.

## O padrao de renomeacao do import

O instrutor destaca um problema pratico: a funcao exportada pelo pacote `knex` se chama `knex`, mas a instancia configurada que queremos exportar tambem deve se chamar `knex` (para que outros arquivos facam `import { knex } from './database'`).

A solucao e renomear no import:

```typescript
import { knex as setupKnex } from 'knex'
```

Isso e um padrao comum quando o nome da factory function conflita com o nome desejado da instancia.

## Por que `./temp/` e nao `./database/`?

O instrutor escolheu `temp` intencionalmente — o SQLite e tratado como banco temporario, apenas para desenvolvimento. Em producao, o projeto usaria PostgreSQL ou MySQL. O nome `temp` comunica essa intencao para qualquer desenvolvedor que olhe o projeto.

## O caminho relativo do filename

O `filename` no SQLite e relativo a **onde o codigo e executado** (o `cwd`), nao ao arquivo `database.ts`. Entao `./temp/app.db` parte da raiz do projeto, assumindo que `npm run dev` e executado de la.

## sqlite_schema — a tabela universal

Todo banco SQLite tem uma tabela interna chamada `sqlite_schema` (antigamente `sqlite_master`). Ela contem metadados sobre todas as tabelas do banco. O instrutor usa essa tabela como um "health check" — se a query retorna um array vazio sem erro, a conexao esta funcionando.

## Por que .gitignore logo no inicio?

O instrutor recomenda criar o `.gitignore` imediatamente apos configurar o banco. Dois motivos:
1. Arquivos `.db` sao binarios que nao devem ser versionados
2. `node_modules` ja e padrao ignorar

Se voce commitar o `.db` uma vez, ele fica no historico do Git para sempre, mesmo que voce adicione ao `.gitignore` depois.

## Dependencias de producao vs desenvolvimento

O instrutor enfatiza que tanto `knex` quanto `sqlite3` sao dependencias de **producao** (`npm install` sem `-D`). Motivo: o codigo que faz queries ao banco roda em producao, entao as dependencias precisam estar disponiveis la.