# Code Examples: GROUP BY

## Exemplo 1: Sem GROUP BY (problema)

```sql
-- O que o instrutor mostrou primeiro
SELECT name, COUNT(*) FROM products;
-- Resultado: MOUSE | 5
-- Problema: retorna primeiro registro arbitrario + contagem total
```

## Exemplo 2: Adicionando GROUP BY

```sql
SELECT name, COUNT(*) FROM products GROUP BY category;
-- Resultado: mostra todas as categorias com contagem
-- Mas "name" ainda nao faz sentido aqui
```

## Exemplo 3: Corrigindo para a coluna de agrupamento

```sql
SELECT category, COUNT(*) AS total FROM products GROUP BY category;
-- Resultado:
-- acessorio | 1
-- audio     | 2
-- geral     | 1
-- imagem    | 1
```

## Exemplo 4: Adicionando ORDER BY com alias

```sql
SELECT category, COUNT(*) AS total
FROM products
GROUP BY category
ORDER BY total;
-- Resultado ordenado do menor pro maior
```

## Exemplo 5: ORDER BY DESC

```sql
SELECT category, COUNT(*) AS total
FROM products
GROUP BY category
ORDER BY total DESC;
-- Resultado ordenado do maior pro menor
```

## Exemplo 6: Formatacao multi-linha (recomendado pelo instrutor)

```sql
SELECT
  category,
  COUNT(*) AS total
FROM
  products
GROUP BY
  category
ORDER BY
  total DESC;
```

## Exemplo 7: Com WHERE antes do GROUP BY

```sql
SELECT
  category,
  COUNT(*) AS total
FROM
  products
WHERE
  price > 600
GROUP BY
  category
ORDER BY
  total DESC;
-- Resultado: apenas categorias com produtos > 600
-- imagem | 1
-- audio  | 1
```

## Variacoes adicionais

### SUM ao inves de COUNT

```sql
SELECT
  category,
  SUM(price) AS total_value
FROM
  products
GROUP BY
  category
ORDER BY
  total_value DESC;
```

### AVG com GROUP BY

```sql
SELECT
  category,
  AVG(price) AS average_price
FROM
  products
GROUP BY
  category
ORDER BY
  average_price DESC;
```

### Multiplas agregacoes

```sql
SELECT
  category,
  COUNT(*) AS total_products,
  SUM(price) AS total_value,
  AVG(price) AS average_price
FROM
  products
GROUP BY
  category
ORDER BY
  total_products DESC;
```

### GROUP BY com multiplas colunas

```sql
SELECT
  category,
  brand,
  COUNT(*) AS total
FROM
  products
GROUP BY
  category,
  brand
ORDER BY
  category,
  total DESC;
```