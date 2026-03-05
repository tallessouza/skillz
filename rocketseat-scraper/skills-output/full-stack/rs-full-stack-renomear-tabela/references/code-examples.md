# Code Examples: Renomear Tabela SQL

## Exemplo básico (da aula)

```sql
-- Renomear PRODUCTS para ITEMS
ALTER TABLE products RENAME TO items;

-- Verificar que a estrutura permanece igual
-- (as colunas não mudam, apenas o nome da tabela)

-- Reverter: renomear ITEMS de volta para PRODUCTS
ALTER TABLE items RENAME TO products;
```

## Variações por banco

### PostgreSQL

```sql
-- Renomear simples
ALTER TABLE products RENAME TO items;

-- Renomear com schema explícito
ALTER TABLE public.products RENAME TO items;

-- Verificar o resultado
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('products', 'items');
```

### MySQL

```sql
-- Sintaxe ALTER TABLE
ALTER TABLE products RENAME TO items;

-- Sintaxe RENAME TABLE (MySQL-specific)
RENAME TABLE products TO items;

-- Renomear múltiplas tabelas atomicamente
RENAME TABLE 
  products TO items,
  orders TO purchases;
```

### SQLite

```sql
-- Única sintaxe suportada
ALTER TABLE products RENAME TO items;
```

## Cenário real: corrigir nome com erro de digitação

```sql
-- Alguém criou a tabela com typo
CREATE TABLE produtcs (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2)
);

-- Corrigir o nome
ALTER TABLE produtcs RENAME TO products;
```

## Cenário real: refatoração de domínio

```sql
-- Antes: tabela genérica
-- Depois: nome mais específico do domínio

ALTER TABLE users RENAME TO customers;

-- Atualizar views dependentes
DROP VIEW IF EXISTS active_users;
CREATE VIEW active_customers AS
SELECT * FROM customers WHERE status = 'active';

-- Atualizar foreign keys (se necessário manualmente)
-- Em PostgreSQL, FKs são atualizadas automaticamente
```

## Verificação pós-rename

```sql
-- PostgreSQL: listar tabelas
\dt

-- MySQL: listar tabelas
SHOW TABLES;

-- SQLite: listar tabelas
.tables

-- ANSI SQL: consultar information_schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```