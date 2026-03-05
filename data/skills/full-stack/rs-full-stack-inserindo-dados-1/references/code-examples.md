# Code Examples: Inserindo Dados com SQL

## Referência: CREATE TABLE usado na aula

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT DEFAULT 'General'
);
```

## Exemplo 1: INSERT básico (sem category)

```sql
INSERT INTO products (name, price)
VALUES ('Mouse', 50);
```

**Resultado:**

| id | name  | price | category |
|----|-------|-------|----------|
| 1  | Mouse | 50    | General  |

- `id`: gerado automaticamente (1)
- `category`: usou DEFAULT ('General')

## Exemplo 2: INSERT com category explícita

```sql
INSERT INTO products (name, price, category)
VALUES ('Teclado', 550, 'Acessório');
```

**Resultado acumulado:**

| id | name    | price | category  |
|----|---------|-------|-----------|
| 1  | Mouse   | 50    | General   |
| 2  | Teclado | 550   | Acessório |

- `id`: gerado automaticamente (2)
- `category`: usou o valor passado, ignorou DEFAULT

## Exemplo 3: Erro de mismatch (da aula)

```sql
-- ERRADO: 3 valores, mas só 2 colunas listadas
INSERT INTO products (name, price)
VALUES ('Teclado', 550, 'Acessório');
-- Erro: column count mismatch
```

**Correção:** adicionar `category` na lista de colunas.

## Exemplo 4: SELECT para visualizar dados

```sql
SELECT * FROM products;
```

O `*` seleciona todas as colunas. `FROM products` indica a tabela.

## Exemplo 5: Comentários SQL

```sql
/* CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT DEFAULT 'General'
); */

-- Inserir um novo produto
INSERT INTO products (name, price)
VALUES ('Monitor', 1200);
```

## Variações adicionais

### Múltiplos registros em um INSERT

```sql
INSERT INTO products (name, price, category)
VALUES
  ('Mouse', 50, 'Periférico'),
  ('Teclado', 550, 'Acessório'),
  ('Monitor', 1200, 'Display');
```

### INSERT com NULL explícito (diferente de DEFAULT)

```sql
-- Isso armazena NULL, NÃO o DEFAULT 'General'
INSERT INTO products (name, price, category)
VALUES ('Webcam', 300, NULL);
```

### INSERT omitindo coluna nullable sem DEFAULT

```sql
-- Se a coluna aceita NULL e não tem DEFAULT,
-- omitir resulta em NULL armazenado
INSERT INTO products (name, price)
VALUES ('Headset', 200);
-- category será 'General' (tem DEFAULT neste caso)
```