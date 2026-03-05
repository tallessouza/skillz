# Code Examples: Visualizando Dados com SELECT

## Exemplo 1: SELECT com asterisco

```sql
-- Seleciona todas as colunas da tabela produtos
SELECT * FROM products;
```

**Resultado:** Retorna todas as colunas (id, name, price, category, etc.) na ordem em que foram definidas na tabela.

## Exemplo 2: Selecao de coluna unica

```sql
-- Seleciona apenas o nome
SELECT name FROM products;
```

**Resultado:** Retorna apenas a coluna `name`. Todas as outras colunas sao ignoradas na saida.

## Exemplo 3: Multiplas colunas

```sql
-- Seleciona nome e preco
SELECT name, price FROM products;
```

**Resultado:**
| name | price |
|------|-------|
| Teclado | 100 |
| Mouse | 50 |

## Exemplo 4: Invertendo a ordem de exibicao

```sql
-- Preco aparece primeiro, depois nome
SELECT price, name FROM products;
```

**Resultado:**
| price | name |
|-------|------|
| 100 | Teclado |
| 50 | Mouse |

Os mesmos dados, mas a coluna `price` agora aparece antes de `name`.

## Variacoes praticas

### Selecionar com alias para renomear colunas na saida

```sql
SELECT name AS produto, price AS preco FROM products;
```

### Limitar resultados ao explorar

```sql
SELECT * FROM products LIMIT 5;
```

### Selecionar colunas de tabela com muitas colunas

```sql
-- Ao inves de SELECT * em tabela com 30 colunas:
SELECT id, name, email, created_at FROM users;
```

### Combinar com WHERE (preview do proximo passo)

```sql
SELECT name, price FROM products WHERE price > 50;
```