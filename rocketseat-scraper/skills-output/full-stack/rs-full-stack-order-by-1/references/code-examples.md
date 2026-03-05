# Code Examples: ORDER BY

## 1. SELECT basico (sem ORDER BY)

```sql
-- Retorna todos os produtos na ordem de insercao
SELECT * FROM products;
```

Resultado: registros ordenados por ID (ordem de insercao).

## 2. ORDER BY com coluna numerica (crescente — padrao)

```sql
-- Ordena por preco, do menor para o maior
SELECT * FROM products ORDER BY price;
```

Os IDs ficam "bagunçados" porque a referencia de ordenacao agora e o preco, nao o ID.

## 3. ORDER BY com DESC (decrescente)

```sql
-- Ordena por preco, do maior para o menor
SELECT * FROM products ORDER BY price DESC;
```

Inverte a ordem: produtos mais caros aparecem primeiro.

## 4. ORDER BY com ASC explicito

```sql
-- Identico ao padrao, mas explicito
SELECT * FROM products ORDER BY price ASC;
```

Resultado identico a omitir ASC. Util para deixar a intencao clara no codigo.

## 5. Comparacao lado a lado (ASC vs sem ASC)

```sql
-- Sem ASC (padrao)
SELECT * FROM products ORDER BY price;

-- Com ASC (explicito)
SELECT * FROM products ORDER BY price ASC;

-- Resultado: IDENTICO
```

## 6. WHERE + ORDER BY combinados

```sql
-- Filtra por categoria 'audio' e ordena por preco crescente
SELECT * FROM products
WHERE category = 'audio'
ORDER BY price;
```

Retorna apenas produtos da categoria audio, ordenados do mais barato ao mais caro.

## 7. WHERE + ORDER BY DESC

```sql
-- Filtra por categoria 'audio' e ordena por preco decrescente
SELECT * FROM products
WHERE category = 'audio'
ORDER BY price DESC;
```

Mesmos produtos filtrados, mas do mais caro ao mais barato.

## 8. ORDER BY com texto (alfabetico)

```sql
-- Ordena por nome, A-Z
SELECT * FROM products ORDER BY name;
```

Produtos aparecem em ordem alfabetica pelo nome.

## 9. ORDER BY com texto DESC (Z-A)

```sql
-- Ordena por nome, Z-A
SELECT * FROM products ORDER BY name DESC;
```

Ordem alfabetica inversa — comeca pelos nomes que iniciam com letras no final do alfabeto.

## Variacoes adicionais

### Ordenar por data

```sql
-- Mais recentes primeiro
SELECT * FROM orders ORDER BY created_at DESC;

-- Mais antigos primeiro
SELECT * FROM orders ORDER BY created_at ASC;
```

### Ordenar por multiplas colunas

```sql
-- Primeiro por categoria (A-Z), depois por preco (maior primeiro)
SELECT * FROM products ORDER BY category ASC, price DESC;
```

### ORDER BY com LIMIT (cenario comum)

```sql
-- Top 5 produtos mais caros
SELECT * FROM products ORDER BY price DESC LIMIT 5;

-- Produto mais barato de uma categoria
SELECT * FROM products
WHERE category = 'audio'
ORDER BY price ASC
LIMIT 1;
```