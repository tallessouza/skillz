# Code Examples: Operadores AND e OR

## Exemplos da aula

### 1. SELECT basico (ponto de partida)

```sql
SELECT * FROM products;
```

### 2. Filtro simples com WHERE

```sql
SELECT * FROM products
WHERE price > 500;
-- Retorna produtos com preco acima de 500
```

### 3. AND para intervalo de preco

```sql
SELECT * FROM products
WHERE price > 500
  AND price < 1000;
-- Retorna: Teclado (R$500,50), Headset (R$800), Microfone (R$550)
```

### 4. AND com tres criterios (campos diferentes)

```sql
SELECT * FROM products
WHERE price > 500
  AND price < 1000
  AND id > 2;
-- Retorna: Headset e Microfone (Teclado excluido por id <= 2)
```

### 5. OR no mesmo intervalo (armadilha)

```sql
SELECT * FROM products
WHERE price > 500
  OR price < 1000;
-- Retorna TODOS os registros — qualquer preco atende pelo menos uma condicao
```

## Variacoes adicionais

### AND com igualdade e comparacao

```sql
SELECT * FROM products
WHERE category = 'electronics'
  AND price < 500;
```

### OR para alternativas validas

```sql
SELECT * FROM products
WHERE category = 'audio'
  OR category = 'video';
-- Equivalente a: WHERE category IN ('audio', 'video')
```

### Combinacao AND + OR com parenteses

```sql
SELECT * FROM products
WHERE (price > 500 AND price < 1000)
  OR category = 'premium';
-- Produtos no intervalo de preco OU da categoria premium
```

### Multiplos AND para filtro progressivo

```sql
SELECT * FROM products
WHERE price > 100
  AND price < 2000
  AND stock > 0
  AND active = true;
-- Cada AND estreita o resultado
```

### OR com campos diferentes

```sql
SELECT * FROM products
WHERE price < 50
  OR name LIKE '%Pro%';
-- Produtos baratos OU com "Pro" no nome
```