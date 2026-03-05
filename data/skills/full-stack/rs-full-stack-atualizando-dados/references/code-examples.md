# Code Examples: Atualizando Dados com UPDATE

## Exemplo 1: UPDATE sem WHERE (o erro proposital)

O instrutor executa intencionalmente para demonstrar o problema:

```sql
-- ERRADO: sem WHERE — afeta TODOS os registros
UPDATE products
SET price = 45.90, category = 'acessory';
-- Resultado: 2 rows affected (TODOS os produtos mudaram)
```

Verificacao apos o erro:
```sql
SELECT * FROM products;
-- Todos os produtos agora tem price = 45.90 e category = 'acessory'
```

## Exemplo 2: Corrigindo o erro — UPDATE com WHERE

Apos o erro, o instrutor corrige registro por registro:

```sql
-- Corrigindo o registro 1 (Mouse)
UPDATE products
SET category = 'General'
WHERE id = 1;
-- Resultado: 1 row affected

-- Verificando
SELECT * FROM products;
-- Mouse voltou para category = 'General', manteve price = 45.90
```

```sql
-- Corrigindo o registro 2 (Teclado)
UPDATE products
SET price = 550
WHERE id = 2;
-- Resultado: 1 row affected

-- Verificando
SELECT * FROM products;
-- Teclado agora tem price = 550
```

## Exemplo 3: UPDATE de multiplas colunas

```sql
-- Atualizando preco E categoria ao mesmo tempo
UPDATE products
SET price = 45.90, category = 'acessory'
WHERE id = 1;
```

Pontos importantes:
- Colunas separadas por virgula
- Sem virgula apos a ultima coluna
- WHERE com ID garante registro unico

## Variacoes praticas

### Atualizar apenas uma coluna
```sql
UPDATE products
SET price = 99.90
WHERE id = 3;
```

### Atualizar texto (sempre entre aspas)
```sql
UPDATE products
SET category = 'Eletronicos'
WHERE id = 1;
```

### Atualizar com valor calculado
```sql
UPDATE products
SET price = price * 1.10
WHERE id = 1;
-- Aumenta o preco em 10%
```

### Padrao completo seguro (usado pelo instrutor)
```sql
-- 1. Atualiza com WHERE
UPDATE products SET price = 550 WHERE id = 2;

-- 2. Verifica o resultado
SELECT * FROM products;
```