# Deep Explanation: SQL Aliases

## Por que aliases existem

O problema central e **comunicacao**. Quando voce executa `SELECT COUNT(*) FROM products`, o resultado retorna uma coluna chamada literalmente `COUNT(*)`. Para quem escreveu a query, o significado e obvio. Para qualquer outra pessoa (ou para voce mesmo semanas depois), o numero `5` sem contexto e completamente ambiguo.

O alias resolve isso: e um **apelido temporario** que renomeia a coluna apenas na exibicao do resultado. Nao altera a tabela, nao persiste, nao afeta a estrutura — e puramente cosmético no output.

## AS explicito vs implicito

SQL permite alias de tres formas:

```sql
-- 1. Com AS (recomendado)
SELECT COUNT(*) AS total FROM products;

-- 2. Sem AS (funciona, mas ambiguo)
SELECT COUNT(*) total FROM products;

-- 3. Com = (apenas SQL Server)
SELECT total = COUNT(*) FROM products;
```

O instrutor destaca que `AS` e opcional sintaticamente, mas **recomenda sempre usar** porque torna explicito que voce esta criando um alias. Sem o `AS`, outra pessoa lendo a query pode confundir o alias com parte de outro comando.

## Nomes compostos: aspas vs colchetes

Quando o alias tem mais de uma palavra (ex: "total de produtos"), o SQL parser interpreta os espacos como separadores de tokens. Isso causa erro de sintaxe.

Duas solucoes:
- **Aspas duplas**: padrao ANSI SQL, funciona na maioria dos bancos
- **Colchetes**: especifico de SQL Server e SQLite

```sql
-- Aspas duplas (ANSI SQL)
SELECT COUNT(*) AS "total de produtos" FROM products;

-- Colchetes (SQL Server / SQLite)
SELECT COUNT(*) AS [total de produtos] FROM products;
```

O resultado e identico. A escolha depende do banco e da convencao do projeto.

## Alias em colunas normais

Aliases nao sao exclusivos de funcoes agregadas. Voce pode renomear qualquer coluna:

```sql
SELECT id AS code, name, price FROM products;
```

Isso e util quando:
- O nome da coluna e generico (`id`, `name`) e voce precisa de contexto
- Voce esta fazendo JOIN e duas tabelas tem colunas com o mesmo nome
- O resultado vai ser consumido por uma API que espera nomes especificos

## Analogia do instrutor

O alias e como um **apelido** — a pessoa continua sendo a mesma (a coluna nao muda), mas voce a chama por outro nome em determinado contexto. Na tabela, `id` continua sendo `id`. No resultado da query, aparece como `code` ou `product_code`.

## Edge cases

1. **Alias nao pode ser usado em WHERE** — o alias so existe no resultado, nao durante o processamento da query
2. **Alias pode ser usado em ORDER BY** — na maioria dos bancos, `ORDER BY total` funciona apos `SELECT COUNT(*) AS total`
3. **Alias em subqueries** — o alias da subquery interna nao e visivel na query externa a menos que seja explicitamente selecionado