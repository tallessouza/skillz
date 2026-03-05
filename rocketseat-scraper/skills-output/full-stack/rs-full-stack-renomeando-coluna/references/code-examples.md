# Code Examples: Renomear Coluna com SQL

## Exemplo basico da aula

```sql
-- Renomear name para description
ALTER TABLE product
RENAME COLUMN name TO description;

-- Verificar resultado
SELECT * FROM product;

-- Reverter
ALTER TABLE product
RENAME COLUMN description TO name;
```

## Variacoes praticas

### Renomear para seguir convencao de nomenclatura

```sql
-- De camelCase para snake_case
ALTER TABLE users
RENAME COLUMN firstName TO first_name;

ALTER TABLE users
RENAME COLUMN lastName TO last_name;

ALTER TABLE users
RENAME COLUMN createdAt TO created_at;
```

### Renomear para maior clareza

```sql
-- Nomes vagos para descritivos
ALTER TABLE orders
RENAME COLUMN date TO ordered_at;

ALTER TABLE products
RENAME COLUMN price TO price_in_cents;

ALTER TABLE users
RENAME COLUMN name TO full_name;
```

### Renomear multiplas colunas em sequencia

```sql
-- Cada RENAME COLUMN e um comando separado
ALTER TABLE invoice
RENAME COLUMN amt TO amount;

ALTER TABLE invoice
RENAME COLUMN desc TO description;

ALTER TABLE invoice
RENAME COLUMN dt TO issued_at;
```

### Em uma migration (contexto de aplicacao)

```sql
-- Migration UP
ALTER TABLE product
RENAME COLUMN name TO title;

-- Migration DOWN (rollback)
ALTER TABLE product
RENAME COLUMN title TO name;
```

## Sintaxe por banco de dados

### PostgreSQL / MySQL 8+ / SQLite 3.25+

```sql
ALTER TABLE product
RENAME COLUMN name TO title;
```

### MySQL (versoes anteriores a 8.0)

```sql
ALTER TABLE product
CHANGE COLUMN name title VARCHAR(255);
-- Nota: precisa repetir o tipo da coluna
```

### SQL Server

```sql
EXEC sp_rename 'product.name', 'title', 'COLUMN';
```