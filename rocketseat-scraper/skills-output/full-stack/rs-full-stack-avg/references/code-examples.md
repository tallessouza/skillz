# Code Examples: SQL AVG

## Exemplo 1: Média simples (do vídeo)

```sql
-- Primeiro, ver todos os registros
SELECT * FROM Products;

-- Depois, calcular a média de preços
SELECT AVG(Price) FROM Products;
```

O instrutor executou apenas a linha do AVG selecionando-a e clicando em "rodar a seleção".

## Exemplo 2: Média com filtro WHERE (do vídeo)

```sql
SELECT AVG(Price)
FROM Products
WHERE category = 'áudio';
```

Retorna a média de preço apenas dos produtos da categoria "áudio". O instrutor destacou que valores de texto no WHERE devem estar entre aspas.

## Variações adicionais

### Média com alias

```sql
SELECT AVG(Price) AS media_preco
FROM Products;
```

### Média com ROUND para limitar casas decimais

```sql
SELECT ROUND(AVG(Price), 2) AS media_preco
FROM Products;
```

### Média com múltiplos filtros

```sql
SELECT AVG(Price)
FROM Products
WHERE category = 'áudio'
  AND Price > 50;
```

### Média por grupo (GROUP BY)

```sql
SELECT category, AVG(Price) AS media_preco
FROM Products
GROUP BY category;
```

### Média com HAVING (filtrar grupos)

```sql
SELECT category, AVG(Price) AS media_preco
FROM Products
GROUP BY category
HAVING AVG(Price) > 100;
```

### Comparar valor individual com a média (subquery)

```sql
SELECT Name, Price
FROM Products
WHERE Price > (SELECT AVG(Price) FROM Products);
```

Retorna produtos com preço acima da média.

### Múltiplas médias no mesmo SELECT

```sql
SELECT
  AVG(Price) AS media_preco,
  AVG(Quantity) AS media_quantidade
FROM Products;
```