# Deep Explanation: Configurando o Knex.js

## Por que o knexfile fica na raiz?

O Knex CLI, ao ser executado via `npx knex`, procura automaticamente por um arquivo chamado `knexfile` na raiz do projeto (similar ao que `tsconfig.json`, `package.json` e outros arquivos de configuração fazem). Colocá-lo em outro lugar exigiria passar flags extras em cada comando, adicionando fricção desnecessária.

## Entendendo cada propriedade

### `client: 'sqlite3'`

O `client` define qual **driver de conexão** o Knex vai utilizar para se comunicar com o banco de dados. No caso do SQLite3, o Knex usa o pacote `sqlite3` (ou `better-sqlite3`) como ponte entre o JavaScript e o banco de dados em arquivo.

Outros valores possíveis: `'pg'` (PostgreSQL), `'mysql2'` (MySQL), `'oracledb'`, `'tedious'` (SQL Server).

### `connection.filename`

Para bancos baseados em arquivo (SQLite), a conexão não usa host/port/user/password como bancos de rede. Em vez disso, basta informar o **caminho do arquivo** onde o banco será armazenado. O instrutor escolheu `./src/database/database.db` para manter dados próximos do código de banco.

O Knex cria o arquivo automaticamente se ele não existir — não é necessário criar manualmente.

### `useNullAsDefault: true`

Esta é uma **recomendação da documentação oficial do Knex** especificamente para SQLite3. O problema: quando você faz `insert` ou `update` e algum campo tem valor `undefined` no JavaScript, o SQLite pode se comportar de forma inconsistente. Definir `useNullAsDefault: true` faz o Knex converter `undefined` para `null` automaticamente, evitando bugs silenciosos de compatibilidade.

O instrutor mostrou na documentação oficial que é uma recomendação para evitar "problemas de compatibilidade".

### `migrations.extension`

Quando você roda `npx knex migrate:make nome-da-migration`, o Knex precisa saber qual extensão usar no arquivo gerado. Sem definir `extension: 'ts'`, ele gera `.js` por padrão — que não compila no projeto TypeScript.

### `migrations.directory`

Define onde as migrations serão armazenadas. O instrutor organizou dentro de `src/database/migrations/` para manter tudo relacionado a banco de dados numa única pasta. A pasta é criada automaticamente pelo Knex na primeira execução de `migrate:make`.

## Decisão de organização do instrutor

O instrutor optou por uma estrutura coesa:

```
src/
└── database/
    ├── database.db     # O banco em si
    └── migrations/     # Histórico de mudanças do schema
```

A lógica: "tudo relacionado a banco de dados dentro dessa pasta". Isso facilita saber onde olhar quando precisa debugar algo de banco.

## Nota sobre criação automática

O instrutor enfatizou que **não é necessário criar nada manualmente**:
- O arquivo `database.db` é criado automaticamente quando o Knex executa a primeira query ou migration
- A pasta `migrations/` é criada quando você roda `npx knex migrate:make` pela primeira vez

Isso reduz steps manuais no setup e evita commits de arquivos vazios.