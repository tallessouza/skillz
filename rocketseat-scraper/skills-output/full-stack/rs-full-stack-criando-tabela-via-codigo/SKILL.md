---
name: rs-full-stack-criando-tabela-via-codigo
description: "Generates SQL CREATE TABLE statements when writing database schemas or setting up tables. Use when user asks to 'create a table', 'define a schema', 'setup database', 'add columns', or 'write DDL'. Applies rules: plural lowercase table names, underscore for compound names, PRIMARY KEY with AUTOINCREMENT for IDs, NOT NULL for required fields, DEFAULT for optional columns. Make sure to use this skill whenever generating SQL table creation code. Not for queries, inserts, updates, or ORM model definitions."
---

# Criando Tabela via Código SQL

> Ao criar tabelas SQL, use CREATE TABLE com nomes no plural, colunas tipadas, e constraints que garantem integridade dos dados.

## Rules

1. **Palavras reservadas SQL em caixa alta** — `CREATE TABLE`, `NOT NULL`, `INTEGER`, porque diferencia visualmente comandos SQL de nomes de tabelas/colunas e segue o padrao de mercado
2. **Nome de tabela no plural e minusculo** — `products` nao `Product`, porque a tabela armazena multiplos registros
3. **Underscore para nomes compostos** — `products_categories` nao `productsCategories`, porque banco de dados usa underscore como separador padrao
4. **Toda tabela tem ID como PRIMARY KEY** — garante identificador unico por registro, porque IDs duplicados causam atualizacoes em massa indesejadas
5. **Use AUTOINCREMENT no ID** — o banco gerencia IDs automaticamente (1, 2, 3...), porque atribuir IDs manualmente em milhares de registros e impraticavel e propenso a erro
6. **NOT NULL para campos obrigatorios** — campos essenciais nao aceitam valores nulos, porque dados incompletos comprometem a integridade
7. **DEFAULT para campos opcionais com valor padrao** — `DEFAULT 'general'` quando ha um fallback logico, porque evita registros sem categoria util

## How to write

### Estrutura basica CREATE TABLE

```sql
CREATE TABLE products (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NULL DEFAULT 'general'
);
```

### Coluna obrigatoria vs opcional

```sql
-- Obrigatoria: NOT NULL (usuario DEVE informar)
name TEXT NOT NULL

-- Opcional com default: NULL + DEFAULT (assume valor padrao se nao informado)
category TEXT NULL DEFAULT 'general'

-- Opcional sem default: NULL (fica vazio se nao informado)
description TEXT NULL
```

## Example

**Before (problemas comuns):**
```sql
create table Product (
  Id int,
  productName varchar,
  productPrice float,
  product category text
);
```

**After (com esta skill aplicada):**
```sql
CREATE TABLE products (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NULL DEFAULT 'general'
);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Toda nova tabela | Adicione coluna `id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT` |
| Campo que sempre deve existir | Use `NOT NULL` |
| Campo opcional com fallback logico | Use `NULL DEFAULT 'valor'` |
| Nome de tabela com duas palavras | Use underscore: `order_items` |
| Tipo numerico inteiro | `INTEGER` |
| Tipo numerico com decimais (preco) | `REAL` |
| Tipo texto | `TEXT` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `CREATE TABLE Product` (singular, maiusculo) | `CREATE TABLE products` |
| `create table products` (reservadas minusculas) | `CREATE TABLE products` |
| `id INTEGER` (sem PK nem autoincrement) | `id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT` |
| `product category TEXT` (espaco no nome) | `product_category TEXT` |
| Campo obrigatorio sem NOT NULL | Sempre declare `NOT NULL` explicitamente |
| Tabela sem coluna ID | Toda tabela deve ter identificador unico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre PRIMARY KEY, AUTOINCREMENT e valor DEFAULT
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes