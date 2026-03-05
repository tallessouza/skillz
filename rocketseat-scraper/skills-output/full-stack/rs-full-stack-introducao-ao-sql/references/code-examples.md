# Code Examples: Introdução ao SQL

## CRUD básico — Comparação entre engines

### INSERT (Create)

```sql
-- SQLite (aspas simples, ponto e vírgula opcional)
INSERT INTO users (name, email) VALUES ('Maria', 'maria@email.com')

-- PostgreSQL (aspas simples, ponto e vírgula obrigatório)
INSERT INTO users (name, email) VALUES ('Maria', 'maria@email.com');

-- SQL Server (aceita aspas duplas para texto)
INSERT INTO users (name, email) VALUES ("Maria", "maria@email.com");
```

### SELECT (Read)

```sql
-- Funciona igual em todas as engines
SELECT id, name, email FROM users WHERE email LIKE '%@email.com';
```

### UPDATE

```sql
-- Padrão SQL — funciona em todas as engines
UPDATE users SET name = 'Maria Silva' WHERE id = 1;
```

### DELETE

```sql
-- Padrão SQL — funciona em todas as engines
DELETE FROM users WHERE id = 1;
```

## Criação de tabela

```sql
-- SQLite
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- PostgreSQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Diferenças notáveis na criação de tabela

| Aspecto | SQLite | PostgreSQL |
|---------|--------|------------|
| Auto-incremento | `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY` |
| Tipo texto | `TEXT` (único tipo) | `VARCHAR(n)`, `TEXT`, `CHAR(n)` |
| Timestamp | `TEXT` (armazena como string) | `TIMESTAMP` (tipo nativo) |

## Boas práticas universais (funcionam em qualquer engine)

```sql
-- Sempre use ponto e vírgula (mesmo quando opcional)
SELECT * FROM users;

-- Sempre use aspas simples para strings
INSERT INTO users (name) VALUES ('João');

-- Use aliases para legibilidade
SELECT u.name, u.email
FROM users u
WHERE u.active = true;

-- Filtre com WHERE para não retornar dados desnecessários
SELECT name FROM users WHERE created_at > '2024-01-01';
```