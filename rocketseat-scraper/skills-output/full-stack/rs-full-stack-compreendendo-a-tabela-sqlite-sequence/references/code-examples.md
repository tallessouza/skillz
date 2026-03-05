# Code Examples: sqlite_sequence

## 1. Criando uma tabela com AUTOINCREMENT

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL
);
```

Apos esse CREATE, a `sqlite_sequence` ainda nao tem entrada para `products` — ela so aparece apos o primeiro INSERT.

## 2. Inserindo dados e verificando a sequencia

```sql
-- Inserir registros
INSERT INTO products (name, price) VALUES ('Teclado', 150.00);
INSERT INTO products (name, price) VALUES ('Mouse', 80.00);

-- Verificar a sequencia
SELECT * FROM sqlite_sequence;
-- Resultado:
-- name     | seq
-- products | 2
```

## 3. Verificando que o seq corresponde ao ultimo ID

```sql
-- Consultar produtos
SELECT * FROM products;
-- id | name    | price
-- 1  | Teclado | 150.00
-- 2  | Mouse   | 80.00

-- Confirmar na sqlite_sequence
SELECT seq FROM sqlite_sequence WHERE name = 'products';
-- seq: 2 ✓
```

## 4. Comportamento apos deletar registros

```sql
-- Deletar o ultimo registro
DELETE FROM products WHERE id = 2;

-- Verificar sqlite_sequence — seq NAO volta pra 1
SELECT * FROM sqlite_sequence;
-- name     | seq
-- products | 2

-- Inserir novo registro — recebe ID 3, nao 2
INSERT INTO products (name, price) VALUES ('Monitor', 900.00);

SELECT * FROM products;
-- id | name    | price
-- 1  | Teclado | 150.00
-- 3  | Monitor | 900.00
```

## 5. Resetando a sequencia (apenas em dev/teste)

```sql
-- Resetar para comecar do zero
UPDATE sqlite_sequence SET seq = 0 WHERE name = 'products';

-- Ou deletar a entrada (SQLite recriara no proximo INSERT)
DELETE FROM sqlite_sequence WHERE name = 'products';
```

## 6. Multiplas tabelas com AUTOINCREMENT

```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

INSERT INTO categories (name) VALUES ('Eletronicos');
INSERT INTO categories (name) VALUES ('Perifericos');
INSERT INTO categories (name) VALUES ('Monitores');

SELECT * FROM sqlite_sequence;
-- name       | seq
-- products   | 3
-- categories | 3
```

## 7. Exemplo da aula (exatamente como demonstrado)

```sql
-- O instrutor tinha a tabela products criada com 2 registros
-- Ele executou:
SELECT * FROM sqlite_sequence;
-- Resultado: products | 2

-- Depois confirmou com:
SELECT * FROM products;
-- Confirmou que o ultimo ID era de fato 2
```

## 8. Usando em aplicacoes (Node.js com better-sqlite3)

```typescript
import Database from 'better-sqlite3';

const db = new Database('app.db');

// Verificar ultima sequencia gerada
const lastSequence = db
  .prepare('SELECT seq FROM sqlite_sequence WHERE name = ?')
  .get('products');

console.log(`Ultimo ID gerado para products: ${lastSequence?.seq}`);

// Alternativa: usar last_insert_rowid() apos INSERT
const result = db
  .prepare('INSERT INTO products (name, price) VALUES (?, ?)')
  .run('Headset', 250.00);

console.log(`ID do registro inserido: ${result.lastInsertRowid}`);
```