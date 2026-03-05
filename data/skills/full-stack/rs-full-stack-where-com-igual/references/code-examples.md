# Code Examples: SQL SELECT com WHERE Igual

## Exemplo 1: SELECT com asterisco (todas as colunas)

```sql
SELECT * FROM products;
```
Retorna todas as colunas e todos os registros da tabela products.

## Exemplo 2: SELECT com coluna especifica

```sql
SELECT id FROM products;
```
Retorna apenas a coluna `id` de todos os registros.

## Exemplo 3: SELECT com multiplas colunas

```sql
SELECT id, name FROM products;
```
Retorna `id` e `name`. A virgula separa as colunas.

## Exemplo 4: Ordem das colunas alterada

```sql
-- name aparece primeiro na exibicao
SELECT name, id FROM products;
```
A ordem no SELECT define a ordem de exibicao, independente da ordem na tabela.

## Exemplo 5: Colunas nao sequenciais

```sql
-- Pega a primeira e a ultima coluna da tabela
SELECT id, category FROM products;
```
Nao precisa selecionar colunas na sequencia em que estao definidas na tabela.

## Exemplo 6: WHERE com texto (case correto)

```sql
SELECT * FROM products
WHERE name = 'Mouse';
-- Retorna o registro com name = 'Mouse'
```

## Exemplo 7: WHERE com texto (case incorreto)

```sql
SELECT * FROM products
WHERE name = 'mouse';
-- Retorna VAZIO — 'mouse' != 'Mouse' em bancos case sensitive
```

## Exemplo 8: WHERE com numero

```sql
SELECT * FROM products
WHERE price = 1200;
-- Retorna registros onde price e exatamente 1200
```

## Exemplo 9: WHERE com numero sem match

```sql
SELECT * FROM products
WHERE price = 1500;
-- Retorna VAZIO — nenhum registro com price = 1500
```

## Variacoes praticas

### Combinando colunas especificas com WHERE

```sql
SELECT id, name, price
FROM products
WHERE name = 'Mouse';
```

### Filtrando por categoria

```sql
SELECT name, price
FROM products
WHERE category = 'Perifericos';
-- Lembre: case sensitive! 'perifericos' != 'Perifericos'
```

### Filtrando por ID (numero)

```sql
SELECT name, price, category
FROM products
WHERE id = 3;
-- Sem aspas porque id e numerico
```