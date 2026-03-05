# Code Examples: SQL SUM

## Exemplo 1: Soma total (da aula)

```sql
-- Primeiro, visualizar todos os registros
SELECT * FROM products;

-- Depois, somar todos os precos
SELECT SUM(price) FROM products;
-- Resultado: soma de todos os precos (ex: 4500)
```

## Exemplo 2: Soma com filtro WHERE (da aula)

```sql
-- Somar apenas produtos da categoria Audio
SELECT SUM(price) FROM products WHERE category = 'Áudio';
-- Resultado: 1350 (apenas os dois produtos de Audio)
```

## Exemplo 3: Erro silencioso com coluna texto (da aula)

```sql
-- ERRADO: SUM em coluna de texto
SELECT SUM(name) FROM products;
-- Resultado: 0 (zero, sem erro!)

-- CORRETO: SUM em coluna numerica
SELECT SUM(price) FROM products;
-- Resultado: valor real da soma
```

## Variacoes uteis

### Com alias

```sql
SELECT SUM(price) AS total_revenue FROM products;
```

### Com GROUP BY (extensao natural)

```sql
SELECT category, SUM(price) AS total_by_category
FROM products
GROUP BY category;
```

### Com COALESCE para evitar NULL

```sql
SELECT COALESCE(SUM(price), 0) AS total_price
FROM products
WHERE category = 'Inexistente';
-- Retorna 0 em vez de NULL
```

### Multiplos SUMs na mesma query

```sql
SELECT
  SUM(price) AS total_price,
  SUM(quantity) AS total_quantity
FROM products;
```

### SUM com condicao inline (CASE)

```sql
SELECT
  SUM(CASE WHEN category = 'Áudio' THEN price ELSE 0 END) AS audio_total,
  SUM(CASE WHEN category = 'Vídeo' THEN price ELSE 0 END) AS video_total
FROM products;
```

### SUM com HAVING (filtro pos-agrupamento)

```sql
SELECT category, SUM(price) AS total
FROM products
GROUP BY category
HAVING SUM(price) > 1000;
```