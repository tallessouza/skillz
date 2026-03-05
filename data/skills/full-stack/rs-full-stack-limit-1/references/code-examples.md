# Code Examples: SQL LIMIT

## Exemplo 1: Listando todos os produtos (ponto de partida)

```sql
-- Ponto de partida: sem filtro, sem ordem
SELECT * FROM products;
```

Resultado: todos os registros em ordem arbitraria.

## Exemplo 2: Adicionando ORDER BY

```sql
-- Ordenando por preco (ASC implicito — menor para maior)
SELECT * FROM products ORDER BY price;
```

Resultado: produtos ordenados do mais barato ao mais caro.

## Exemplo 3: Invertendo com DESC

```sql
-- Ordenando do mais caro para o mais barato
SELECT * FROM products ORDER BY price DESC;
```

Resultado: produtos com o mais caro no topo.

## Exemplo 4: Aplicando LIMIT 1

```sql
-- Apenas o produto mais caro
SELECT * FROM products ORDER BY price DESC LIMIT 1;
```

Resultado: um unico registro — o mais caro.

## Exemplo 5: Top 3 mais caros (exemplo final da aula)

```sql
-- Os tres produtos mais caros
SELECT * FROM products ORDER BY price DESC LIMIT 3;
```

Resultado: exatamente 3 registros, os mais caros.

## Variacoes praticas

### Top 5 mais baratos

```sql
SELECT * FROM products ORDER BY price ASC LIMIT 5;
```

### Pedido mais recente de um usuario

```sql
SELECT * FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 1;
```

### Top 10 usuarios com mais compras

```sql
SELECT user_id, COUNT(*) AS total_orders
FROM orders
GROUP BY user_id
ORDER BY total_orders DESC
LIMIT 10;
```

### Paginacao simples com OFFSET

```sql
-- Pagina 1 (registros 1-10)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 0;

-- Pagina 2 (registros 11-20)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 10;

-- Pagina 3 (registros 21-30)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 20;
```

### Combinando com WHERE

```sql
-- Os 3 produtos mais caros da categoria "eletronicos"
SELECT * FROM products
WHERE category = 'eletronicos'
ORDER BY price DESC
LIMIT 3;
```