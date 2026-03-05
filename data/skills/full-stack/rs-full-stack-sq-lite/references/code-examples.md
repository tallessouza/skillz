# Code Examples: SQLite

## Setup básico com Node.js

### Usando better-sqlite3 (síncrono, recomendado para estudo)

```typescript
import Database from 'better-sqlite3'

// Cria ou abre o arquivo do banco
const db = new Database('app.db')

// Habilita WAL mode para melhor performance
db.pragma('journal_mode = WAL')
```

### Usando sqlite3 (assíncrono)

```typescript
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('app.db')
```

## Criando tabelas

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  user_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Operações básicas (CRUD)

### INSERT

```sql
INSERT INTO users (name, email) VALUES ('João', 'joao@email.com');
INSERT INTO users (name, email) VALUES ('Maria', 'maria@email.com');
```

### SELECT

```sql
-- Todos os usuários
SELECT * FROM users;

-- Com filtro
SELECT name, email FROM users WHERE name LIKE 'J%';

-- Com JOIN
SELECT posts.title, users.name AS author
FROM posts
JOIN users ON posts.user_id = users.id;
```

### UPDATE

```sql
UPDATE users SET name = 'João Silva' WHERE id = 1;
```

### DELETE

```sql
DELETE FROM users WHERE id = 1;
```

## Índices

```sql
-- Criar índice para buscas frequentes por email
CREATE INDEX idx_users_email ON users(email);

-- Índice composto
CREATE INDEX idx_posts_user_date ON posts(user_id, created_at);
```

## Usando com Node.js (better-sqlite3)

```typescript
import Database from 'better-sqlite3'

const db = new Database('app.db')

// Criar tabela
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`)

// Inserir (prepared statement — seguro contra SQL injection)
const insert = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
insert.run('João', 'joao@email.com')

// Buscar um
const getUser = db.prepare('SELECT * FROM users WHERE id = ?')
const user = getUser.get(1)

// Buscar vários
const getAllUsers = db.prepare('SELECT * FROM users')
const users = getAllUsers.all()

// Transação
const insertMany = db.transaction((items) => {
  for (const item of items) {
    insert.run(item.name, item.email)
  }
})

insertMany([
  { name: 'Maria', email: 'maria@email.com' },
  { name: 'Pedro', email: 'pedro@email.com' },
])
```

## Verificando a estrutura do banco

```sql
-- Listar todas as tabelas
SELECT name FROM sqlite_master WHERE type='table';

-- Ver estrutura de uma tabela
PRAGMA table_info(users);

-- Ver índices de uma tabela
PRAGMA index_list(users);
```

## O arquivo único na prática

```bash
# O banco é literalmente um arquivo
ls -la app.db
# -rw-r--r-- 1 user user 12288 Jan 15 10:30 app.db

# Backup = copiar o arquivo
cp app.db backup.db

# Reset = deletar o arquivo
rm app.db

# Mover para outro projeto
mv app.db ../outro-projeto/
```