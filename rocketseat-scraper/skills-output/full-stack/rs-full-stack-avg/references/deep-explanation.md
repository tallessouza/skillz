# Deep Explanation: SQL AVG

## O que é AVG

AVG é a abreviação de **Average** (média em inglês). É uma função de agregação SQL que calcula a média aritmética dos valores de uma coluna numérica.

## Como o instrutor apresentou

O instrutor começou mostrando um `SELECT *` sem filtros para exibir todos os registros da tabela. Depois demonstrou que ao invés de buscar todos os dados e calcular manualmente, o SQL fornece o AVG como função nativa.

A progressão foi:
1. Ver todos os dados (`SELECT *`)
2. Calcular média geral (`SELECT AVG(Price) FROM Products`)
3. Calcular média filtrada (`SELECT AVG(Price) FROM Products WHERE category = 'áudio'`)

Essa progressão é importante: primeiro entenda os dados, depois agregue.

## Por que calcular no banco e não no app

O banco de dados é otimizado para operações sobre conjuntos de dados. Trazer milhares de linhas para o aplicação e calcular a média no código é:
- Mais lento (transferência de dados)
- Mais consumo de memória
- Mais código para manter

O AVG faz tudo no servidor do banco e retorna um único número.

## Edge cases

- **AVG ignora NULLs** — se uma linha tem `Price = NULL`, ela não entra no cálculo (nem no numerador nem no denominador)
- **Tabela vazia** — `AVG` retorna `NULL` se não há linhas
- **Tipos não numéricos** — AVG em coluna de texto gera erro ou resultado inesperado dependendo do banco
- **Precisão decimal** — o resultado pode ter muitas casas decimais; use `ROUND(AVG(Price), 2)` para limitar

## Combinação com GROUP BY

O instrutor não mostrou neste vídeo, mas AVG é frequentemente usado com `GROUP BY` para calcular médias por grupo:

```sql
SELECT category, AVG(Price) AS average_price
FROM Products
GROUP BY category;
```

Isso retorna a média de preço para cada categoria, ao invés de uma única média global.

## Diferença para outras funções de agregação

| Função | O que faz |
|--------|-----------|
| `AVG()` | Média aritmética |
| `SUM()` | Soma total |
| `COUNT()` | Quantidade de registros |
| `MIN()` | Menor valor |
| `MAX()` | Maior valor |

Todas seguem a mesma sintaxe: `FUNCAO(coluna) FROM tabela`.