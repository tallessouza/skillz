# Code Examples: Abrindo Banco de Dados SQLite

## Queries de inspecao

### Verificar todas as tabelas do banco

```sql
SELECT name FROM sqlite_master WHERE type='table';
```

### Inspecionar estrutura de uma tabela

```sql
PRAGMA table_info(courses);
```

Retorna: `cid`, `name`, `type`, `notnull`, `dflt_value`, `pk` para cada coluna.

### Verificar historico de migrations

```sql
SELECT * FROM knex_migrations;
```

Exemplo de resultado:

| id | name | batch | migration_time |
|----|------|-------|----------------|
| 1 | 20240101120000_create_courses.js | 1 | 2024-01-01 12:00:00 |

### Verificar sequencia de auto-incremento

```sql
SELECT * FROM sqlite_sequence;
```

Exemplo de resultado:

| name | seq |
|------|-----|
| courses | 0 |

### Verificar se tabela tem dados

```sql
SELECT * FROM courses;
```

Retorna resultado vazio se nenhum registro foi inserido ainda — mas confirma que a tabela existe e esta acessivel.

## Caminho do arquivo no projeto

Estrutura tipica de projeto com Knex + SQLite:

```
project/
├── src/
│   └── database/
│       ├── database.db          ← arquivo SQLite (abrir no Beekeeper)
│       ├── knexfile.js          ← configuracao do Knex
│       └── migrations/
│           └── 20240101_create_courses.js
```

## Configuracao de conexao no Beekeeper

1. Tipo: **SQLite**
2. Database File: navegar ate `src/database/database.db`
3. Connection Name: nome do projeto (para identificacao rapida)
4. Save → Connect

## Variacoes comuns

### Se o banco estiver em outro path

Alguns projetos colocam o banco na raiz:

```
project/
├── database.db
├── knexfile.js
```

Ou em `data/`:

```
project/
├── data/
│   └── database.db
```

Verificar o `knexfile.js` para confirmar o path configurado:

```javascript
module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './src/database/database.db'  // ← este e o path
  }
}
```