# Code Examples: SQL IN

## Exemplo 1: Filtro numérico básico (da aula)

```sql
-- Seleciona produtos com preços específicos
SELECT *
FROM products
WHERE price IN (800, 550);
```

Resultado: retorna apenas produtos com preço exatamente 800 ou 550.

## Exemplo 2: Filtro numérico expandido (da aula)

```sql
-- Adicionando mais valores à lista
SELECT *
FROM products
WHERE price IN (800, 550, 1200);
```

Resultado: retorna produtos com preço 800, 550 ou 1200.

## Exemplo 3: Filtro de texto — uma categoria (da aula)

```sql
-- Filtra por uma categoria de texto
SELECT *
FROM products
WHERE category IN ('image');
```

Resultado: retorna apenas produtos da categoria 'image'.

## Exemplo 4: Filtro de texto — múltiplas categorias (da aula)

```sql
-- Filtra por múltiplas categorias
SELECT *
FROM products
WHERE category IN ('image', 'audio');
```

Resultado: retorna produtos de ambas categorias.

## Variação: NOT IN

```sql
-- Exclui categorias específicas
SELECT *
FROM products
WHERE category NOT IN ('image', 'audio');
```

Resultado: retorna todos os produtos EXCETO os de image e audio.

## Variação: IN com subquery

```sql
-- Filtra usando resultado de outra query
SELECT *
FROM products
WHERE category IN (
  SELECT category
  FROM featured_categories
  WHERE active = true
);
```

## Variação: IN combinado com outros filtros

```sql
-- IN com AND para filtros compostos
SELECT *
FROM products
WHERE category IN ('image', 'audio')
  AND price > 500;
```

## Comparação: IN vs OR

```sql
-- Equivalente com OR (menos legível)
SELECT *
FROM products
WHERE price = 800
   OR price = 550
   OR price = 1200;

-- Equivalente com IN (mais legível)
SELECT *
FROM products
WHERE price IN (800, 550, 1200);
```

Ambos produzem o mesmo resultado e geralmente o mesmo plano de execução, mas IN é preferível pela legibilidade.

## Variação: IN com strings que contêm espaços

```sql
SELECT *
FROM products
WHERE category IN ('home theater', 'smart home', 'audio');
```

Strings com espaços funcionam normalmente dentro das aspas simples.