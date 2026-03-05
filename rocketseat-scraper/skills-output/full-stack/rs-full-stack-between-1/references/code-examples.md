# Code Examples: SQL BETWEEN

## Exemplo 1: Filtro de preco (da aula)

### Setup — tabela de produtos
```sql
SELECT * FROM products;
-- Retorna todos os produtos com seus precos
```

### Com operadores tradicionais
```sql
SELECT * FROM products
WHERE price >= 600
  AND price <= 1200;
-- Retorna produtos com preco entre 600 e 1200 (inclusivo)
-- Ex: produto com preco 800 ✓, produto com preco 1200 ✓
```

### Com BETWEEN (forma preferida)
```sql
SELECT * FROM products
WHERE price BETWEEN 600 AND 1200;
-- Mesmo resultado, sintaxe mais limpa
```

## Exemplo 2: Filtro de datas

```sql
-- Pedidos do primeiro trimestre de 2024
SELECT * FROM orders
WHERE created_at BETWEEN '2024-01-01' AND '2024-03-31';
```

## Exemplo 3: Filtro de quantidade em estoque

```sql
-- Produtos com estoque entre 10 e 50 unidades
SELECT * FROM products
WHERE stock BETWEEN 10 AND 50;
```

## Exemplo 4: NOT BETWEEN (exclusao de intervalo)

```sql
-- Produtos FORA do intervalo de 600 a 1200
SELECT * FROM products
WHERE price NOT BETWEEN 600 AND 1200;
```

## Exemplo 5: BETWEEN com JOIN

```sql
-- Itens de pedido com subtotal entre 100 e 500
SELECT o.id, oi.product_id, oi.quantity * oi.unit_price AS subtotal
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE oi.quantity * oi.unit_price BETWEEN 100 AND 500;
```

## Exemplo 6: Quando NAO usar BETWEEN

```sql
-- Preciso de preco MAIOR que 600 (exclusivo), nao maior ou igual
-- BETWEEN nao serve aqui
SELECT * FROM products
WHERE price > 600 AND price <= 1200;
```

## Comparacao lado a lado

| Necessidade | Sem BETWEEN | Com BETWEEN |
|------------|-------------|-------------|
| Intervalo inclusivo | `price >= 600 AND price <= 1200` | `price BETWEEN 600 AND 1200` |
| Excluir intervalo | `price < 600 OR price > 1200` | `price NOT BETWEEN 600 AND 1200` |
| Exclusivo em um lado | `price > 600 AND price <= 1200` | N/A — use operadores |