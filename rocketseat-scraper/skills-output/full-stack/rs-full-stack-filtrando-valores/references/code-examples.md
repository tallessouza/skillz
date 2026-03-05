# Code Examples: Filtrando Valores com WHERE

## Setup base (dados usados na aula)

```sql
-- Produtos usados nos exemplos da aula:
-- Mouse: R$45,90
-- Produto X: R$500,50
-- Teclado: R$550,00
-- Headset: R$800,00
-- Webcam: R$1.200,00
```

## Exemplo 1: Igualdade

```sql
-- Buscar produto exato por preco
SELECT * FROM products WHERE price = 800;
-- Resultado: apenas Headset
```

## Exemplo 2: Diferente

```sql
-- Todos os produtos EXCETO os de R$800
SELECT * FROM products WHERE price <> 800;
-- Resultado: Mouse, Produto X, Teclado, Webcam (Headset excluido)
```

## Exemplo 3: Maior que (estrito)

```sql
-- Produtos acima de R$800
SELECT * FROM products WHERE price > 800;
-- Resultado: apenas Webcam (R$1.200)

-- Produtos acima de R$300
SELECT * FROM products WHERE price > 300;
-- Resultado: Produto X, Teclado, Headset, Webcam

-- Produtos acima de R$550
SELECT * FROM products WHERE price > 550;
-- Resultado: Headset, Webcam (Teclado de R$550 EXCLUIDO)
```

## Exemplo 4: Menor que (estrito)

```sql
-- Produtos abaixo de R$550
SELECT * FROM products WHERE price < 550;
-- Resultado: apenas Mouse (R$45,90)

-- Produtos abaixo de R$600
SELECT * FROM products WHERE price < 600;
-- Resultado: Mouse (R$45,90), Produto X (R$500,50), Teclado (R$550,00)
```

## Exemplo 5: Maior ou igual

```sql
-- Produtos a partir de R$550 (inclusivo)
SELECT * FROM products WHERE price >= 550;
-- Resultado: Teclado (R$550), Headset (R$800), Webcam (R$1.200)
-- Teclado INCLUSO porque 550 >= 550 e verdadeiro
```

## Exemplo 6: Menor ou igual

```sql
-- Produtos ate R$800 (inclusivo)
SELECT * FROM products WHERE price <= 800;
-- Resultado: Mouse, Produto X, Teclado, Headset
-- Headset INCLUSO porque 800 <= 800 e verdadeiro

-- Contraste com menor estrito:
SELECT * FROM products WHERE price < 800;
-- Resultado: Mouse, Produto X, Teclado (Headset EXCLUIDO)
```

## Variacoes praticas

### Filtrar por texto

```sql
-- Igualdade com strings
SELECT * FROM products WHERE name = 'Headset';

-- Diferente com strings
SELECT * FROM products WHERE category <> 'Periferico';
```

### Filtrar por datas

```sql
-- Pedidos a partir de uma data
SELECT * FROM orders WHERE created_at >= '2024-01-01';

-- Pedidos ate uma data
SELECT * FROM orders WHERE created_at <= '2024-12-31';
```

### Combinando com outras clausulas

```sql
-- Filtrar e ordenar
SELECT * FROM products WHERE price >= 500 ORDER BY price ASC;

-- Filtrar e limitar
SELECT * FROM products WHERE price > 100 LIMIT 5;
```