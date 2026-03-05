# Deep Explanation: GROUP BY

## Por que o GROUP BY existe

Quando voce usa uma funcao de agregacao como `COUNT(*)` sem GROUP BY, o banco de dados trata toda a tabela como um unico grupo. Ele retorna **uma unica linha** com o resultado da agregacao. Se voce incluiu uma coluna nao-agregada no SELECT (como `name`), o banco simplesmente pega o valor do **primeiro registro que encontrar** — o que e essencialmente aleatorio e sem significado.

### O que acontece internamente sem GROUP BY

```sql
SELECT name, COUNT(*) FROM products;
```

O banco faz:
1. Escaneia todos os registros
2. Conta: 5 registros total
3. Precisa preencher `name` — pega o primeiro que encontrou: "MOUSE"
4. Retorna: `MOUSE | 5`

Isso nao tem utilidade pratica. Voce recebeu o nome de um produto arbitrario com a contagem total.

### O que acontece com GROUP BY

```sql
SELECT category, COUNT(*) FROM products GROUP BY category;
```

O banco faz:
1. Escaneia todos os registros
2. Cria "baldes" por valor unico de `category`: {acessorio, audio, geral, imagem}
3. Conta registros em cada balde
4. Retorna uma linha por balde

## A ordem das clausulas SQL

A ordem e fixa e nao pode ser alterada:

```
SELECT    → O que voce quer ver
FROM      → De qual tabela
WHERE     → Filtro ANTES do agrupamento (linha a linha)
GROUP BY  → Como agrupar
HAVING    → Filtro DEPOIS do agrupamento (nos grupos)
ORDER BY  → Ordenacao final
LIMIT     → Quantidade de resultados
```

### WHERE vs HAVING (conceito adjacente)

- **WHERE** filtra linhas individuais ANTES do agrupamento
- **HAVING** filtra grupos DEPOIS do agrupamento

Na aula, apenas WHERE foi demonstrado. Exemplo: `WHERE price > 600` remove produtos baratos antes de contar por categoria.

## ALIAS no ORDER BY

Quando voce cria um alias com `AS total`, esse alias so esta disponivel em duas clausulas:
- **ORDER BY** — pode usar o alias
- **HAVING** — depende do banco (MySQL aceita, PostgreSQL nao)

O alias NAO esta disponivel no WHERE porque o WHERE e processado antes do SELECT.

## Formatacao multi-linha

O instrutor enfatiza que SQL nao liga para quebras de linha. Tudo numa linha ou em varias linhas produz o mesmo resultado. Mas a legibilidade melhora drasticamente:

```sql
-- Dificil de ler
SELECT category, COUNT(*) AS total FROM products WHERE price > 600 GROUP BY category ORDER BY total DESC;

-- Facil de ler
SELECT
  category,
  COUNT(*) AS total
FROM
  products
WHERE
  price > 600
GROUP BY
  category
ORDER BY
  total DESC;
```

A recomendacao e: uma clausula por linha assim que a query tem 3 ou mais clausulas.

## Selecionar a coluna certa no SELECT

O instrutor comecou usando `name` no SELECT com COUNT, o que nao fazia sentido — mostrava o nome de um produto aleatorio com a contagem total. Depois corrigiu para `category`, que e a coluna de agrupamento. A regra: **no SELECT, inclua apenas colunas que estejam no GROUP BY ou dentro de funcoes de agregacao**.