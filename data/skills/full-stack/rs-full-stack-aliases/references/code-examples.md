# Code Examples: SQL Aliases

## Exemplo 1: COUNT sem alias (problema)

```sql
SELECT COUNT(*) FROM products;
```

**Resultado:**
| COUNT(*) |
|----------|
| 5 |

O nome da coluna e a propria expressao — ilegivel.

## Exemplo 2: COUNT com alias usando AS

```sql
SELECT COUNT(*) AS total FROM products;
```

**Resultado:**
| total |
|-------|
| 5 |

## Exemplo 3: Alias sem AS (funciona, mas nao recomendado)

```sql
SELECT COUNT(*) total FROM products;
```

**Resultado identico**, mas menos legivel no codigo fonte.

## Exemplo 4: Alias com aspas (nome composto)

```sql
SELECT COUNT(*) AS "total de produtos" FROM products;
```

**Resultado:**
| total de produtos |
|-------------------|
| 5 |

## Exemplo 5: Alias com colchetes (nome composto)

```sql
SELECT COUNT(*) AS [total de produtos] FROM products;
```

**Resultado identico ao exemplo 4.**

## Exemplo 6: Sem aspas com nome composto (ERRO)

```sql
-- ISSO CAUSA ERRO
SELECT COUNT(*) AS total de produtos FROM products;
```

O parser interpreta `de` e `produtos` como tokens SQL desconhecidos.

## Exemplo 7: Renomeando colunas da tabela

```sql
SELECT id AS code, name, price FROM products;
```

**Resultado:**
| code | name | price |
|------|------|-------|
| 1 | Teclado | 150.00 |
| 2 | Mouse | 80.00 |

A coluna `id` aparece como `code` no resultado, mas na tabela continua sendo `id`.

## Exemplo 8: Alias composto em coluna da tabela

```sql
-- Com colchetes
SELECT id AS [product code], name, price FROM products;

-- Com aspas
SELECT id AS "product code", name, price FROM products;
```

**Resultado:**
| product code | name | price |
|-------------|------|-------|
| 1 | Teclado | 150.00 |

## Exemplo 9: Multiplos aliases na mesma query

```sql
SELECT
  id AS product_id,
  name AS product_name,
  price AS unit_price
FROM products;
```

## Exemplo 10: Alias em funcoes agregadas variadas

```sql
SELECT
  COUNT(*) AS total_products,
  AVG(price) AS average_price,
  MAX(price) AS highest_price,
  MIN(price) AS lowest_price,
  SUM(price) AS total_value
FROM products;
```

## Exemplo 11: Alias em JOINs (caso pratico)

```sql
SELECT
  p.id AS product_id,
  p.name AS product_name,
  c.id AS category_id,
  c.name AS category_name
FROM products p
JOIN categories c ON p.category_id = c.id;
```

Sem aliases, ambas as colunas `id` e `name` seriam ambiguas no resultado.