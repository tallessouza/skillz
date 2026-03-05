# Code Examples: SQL COUNT

## Exemplo 1: SELECT básico (contexto inicial)

O instrutor começou mostrando o SELECT sem COUNT para estabelecer contexto:

```sql
-- Retorna todos os registros como lista
SELECT * FROM products;
```

Resultado: 5 linhas com todas as colunas de cada produto. O número de registros é visível mas requer contagem manual.

## Exemplo 2: COUNT com asterisco

```sql
-- Conta todos os registros da tabela
SELECT COUNT(*) FROM products;
```

Resultado: uma única linha, uma única coluna chamada `count(*)`, valor `5`.

## Exemplo 3: COUNT com coluna NAME

```sql
-- Conta registros usando a coluna name como referência
SELECT COUNT(name) FROM products;
```

Resultado: `5` — mesmo valor, mas coluna chamada `count(name)`.

## Exemplo 4: COUNT com coluna PRICE

```sql
-- Conta registros usando a coluna price como referência
SELECT COUNT(price) FROM products;
```

Resultado: `5` — mesmo valor, coluna chamada `count(price)`.

## Exemplo 5: COUNT com filtro WHERE

```sql
-- Conta apenas produtos com preço >= 600
SELECT COUNT(*) FROM products WHERE price >= 600;
```

Resultado: `2` — apenas produtos caros foram contados.

## Variações adicionais

### COUNT com múltiplos filtros

```sql
-- Contar produtos baratos
SELECT COUNT(*) FROM products WHERE price < 100;

-- Contar produtos em faixa de preço
SELECT COUNT(*) FROM products WHERE price BETWEEN 100 AND 500;

-- Contar produtos por nome parcial
SELECT COUNT(*) FROM products WHERE name LIKE '%Pro%';
```

### COUNT com alias para clareza

```sql
-- Nomear a coluna resultado
SELECT COUNT(*) AS total_products FROM products;
SELECT COUNT(*) AS expensive_count FROM products WHERE price >= 600;
```

### COUNT com DISTINCT (extensão natural)

```sql
-- Contar valores únicos de uma coluna
SELECT COUNT(DISTINCT category) FROM products;
```

### COUNT em subconsulta

```sql
-- Usar COUNT como parte de uma query maior
SELECT
  name,
  price,
  (SELECT COUNT(*) FROM products) AS total_in_table
FROM products
WHERE price >= 600;
```

### Múltiplos COUNTs na mesma query

```sql
-- Obter várias contagens de uma vez
SELECT
  COUNT(*) AS total,
  COUNT(CASE WHEN price >= 600 THEN 1 END) AS expensive,
  COUNT(CASE WHEN price < 600 THEN 1 END) AS affordable
FROM products;
```