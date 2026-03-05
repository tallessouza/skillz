# Code Examples: DROP TABLE

## Exemplo basico da aula

O instrutor demonstrou a forma mais simples:

```sql
-- Criar a tabela
CREATE TABLE foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Remover a tabela
DROP TABLE foods;

-- Recriar (o instrutor fez CTRL+Z e executou novamente)
CREATE TABLE foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

## Versao segura com IF EXISTS

```sql
-- Idempotente — pode executar multiplas vezes sem erro
DROP TABLE IF EXISTS foods;
```

## Script de reset completo

```sql
-- Reset do banco para desenvolvimento
-- Ordem importa: tabelas dependentes primeiro
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS categories;

-- Recriar na ordem inversa (tabelas base primeiro)
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id INTEGER REFERENCES categories(id)
);
```

## Migration pattern (up/down)

```sql
-- Migration: 003_remove_legacy_table.sql

-- UP (aplicar)
DROP TABLE IF EXISTS legacy_foods;

-- DOWN (reverter)
CREATE TABLE legacy_foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

## Verificar dependencias antes de dropar (PostgreSQL)

```sql
-- Listar foreign keys que referenciam a tabela
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS referenced_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'foods';
```

## CASCADE vs RESTRICT

```sql
-- RESTRICT (padrao): falha se houver dependencias
DROP TABLE foods RESTRICT;
-- ERROR: cannot drop table foods because other objects depend on it

-- CASCADE: remove tudo que depende
DROP TABLE foods CASCADE;
-- NOTICE: drop cascades to constraint order_items_food_id_fkey on table order_items
```

## DROP TABLE em diferentes bancos

```sql
-- PostgreSQL
DROP TABLE IF EXISTS foods CASCADE;

-- MySQL
DROP TABLE IF EXISTS foods;
-- MySQL faz cascade automatico em foreign keys com ON DELETE

-- SQLite (usado na aula)
DROP TABLE IF EXISTS foods;
-- SQLite nao enforça foreign keys por padrao
```