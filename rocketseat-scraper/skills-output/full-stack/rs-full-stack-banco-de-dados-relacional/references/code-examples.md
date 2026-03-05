# Code Examples: Banco de Dados Relacional

## Criando tabelas seguindo os principios da aula

### Tabela com chave primaria e tipos corretos

```sql
-- Uma tabela = um assunto (products)
-- Nome no plural
-- Cada coluna com tipo especifico
-- id como PRIMARY KEY para garantir unicidade

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  rating REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Multiplas tabelas, cada uma com seu assunto

```sql
-- Tabela de usuarios
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);

-- Tabela de categorias
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

-- Tabela de clientes
CREATE TABLE clients (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT
);
```

### Inserindo registros (linhas/tuplas)

```sql
-- Cada INSERT cria uma nova linha (registro)
-- A chave primaria impede duplicatas

INSERT INTO products (id, title, rating) VALUES (1, 'Produto A', 9.8);
INSERT INTO products (id, title, rating) VALUES (2, 'Produto B', 9.5);

-- Isso FALHA porque id 1 ja existe (chave primaria impede)
INSERT INTO products (id, title, rating) VALUES (1, 'Produto C', 8.0);
-- ERROR: UNIQUE constraint failed: products.id
```

### Visualizando a estrutura descrita na aula

```sql
-- Consultando registros (linhas horizontais)
SELECT * FROM products;

-- Resultado:
-- id | title      | rating | created_at
-- ---|------------|--------|--------------------
-- 1  | Produto A  | 9.8    | 2024-01-01 10:00:00
-- 2  | Produto B  | 9.5    | 2024-01-02 14:30:00
--
-- Cada LINHA = um registro completo
-- Cada COLUNA = um tipo de dado especifico
```

### Anti-pattern: tudo na mesma tabela

```sql
-- ERRADO: misturar assuntos na mesma tabela
CREATE TABLE everything (
  id INTEGER PRIMARY KEY,
  type TEXT, -- 'product', 'user', 'category'
  name TEXT,
  email TEXT, -- so faz sentido para user
  price REAL, -- so faz sentido para product
  rating REAL -- so faz sentido para product
);
-- Resultado: colunas vazias, consultas complexas, bagunca

-- CORRETO: separar por assunto
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  rating REAL
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);
```

### Operacoes que dependem da chave primaria

```sql
-- Atualizar um registro ESPECIFICO (precisa do id)
UPDATE products SET rating = 9.9 WHERE id = 1;

-- Deletar um registro ESPECIFICO (precisa do id)
DELETE FROM products WHERE id = 2;

-- Sem chave primaria, como diferenciar dois produtos com mesmo titulo?
-- A chave primaria resolve esse problema
```