# Code Examples: Criando Tabela via Código SQL

## Exemplo principal da aula

```sql
CREATE TABLE products (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NULL DEFAULT 'general'
);
```

### Analise coluna por coluna

**id:**
```sql
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
-- INTEGER: tipo numerico inteiro
-- NOT NULL: campo obrigatorio
-- PRIMARY KEY: garante unicidade
-- AUTOINCREMENT: banco gera automaticamente (1, 2, 3...)
```

**name:**
```sql
name TEXT NOT NULL
-- TEXT: tipo string/texto
-- NOT NULL: obrigatorio (todo produto precisa de nome)
```

**price:**
```sql
price REAL NOT NULL
-- REAL: numero com casas decimais (ex: 70.50)
-- NOT NULL: obrigatorio (todo produto precisa de preco)
```

**category:**
```sql
category TEXT NULL DEFAULT 'general'
-- TEXT: tipo string
-- NULL: campo opcional
-- DEFAULT 'general': se nao informado, assume 'general'
```

## Variacoes para outros dominios

### Tabela de usuarios
```sql
CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NULL DEFAULT 'member'
);
```

### Tabela com nome composto
```sql
CREATE TABLE order_items (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL
);
```

### Tabela com multiplos campos opcionais
```sql
CREATE TABLE articles (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  summary TEXT NULL,
  published_at TEXT NULL,
  status TEXT NULL DEFAULT 'draft'
);
```

## Erros comuns e correcoes

### Erro: esquecer AUTOINCREMENT
```sql
-- ERRADO: ID manual, propenso a duplicatas
CREATE TABLE products (
  id INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL
);

-- CORRETO: ID automatico
CREATE TABLE products (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

### Erro: espaco no nome da tabela/coluna
```sql
-- ERRADO: espaco gera erro de sintaxe
CREATE TABLE product categories (
  product name TEXT NOT NULL
);

-- CORRETO: underscore
CREATE TABLE product_categories (
  product_name TEXT NOT NULL
);
```

### Erro: virgula apos ultima coluna
```sql
-- ERRADO: virgula sobrando gera erro
CREATE TABLE products (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,  -- virgula aqui causa erro!
);

-- CORRETO: ultima coluna sem virgula
CREATE TABLE products (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

### Erro: usar aspas duplas para strings SQL
```sql
-- ERRADO em SQLite: aspas duplas
category TEXT NULL DEFAULT "general"

-- CORRETO: aspas simples para valores string
category TEXT NULL DEFAULT 'general'
```