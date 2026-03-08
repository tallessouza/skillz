---
name: rs-full-stack-parenteses
description: "Enforces correct use of parentheses for operator precedence in SQL queries combining AND and OR. Use when user asks to 'write a SQL query', 'filter with multiple conditions', 'combine AND and OR', or 'fix SQL WHERE clause'. Applies grouping rules to prevent logic bugs from missing parentheses. Make sure to use this skill whenever generating SQL with mixed AND/OR conditions. Not for single-condition queries, JOINs, or aggregation logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql
  tags: [sql, where, and-or, precedencia, parenteses]
---

# Parênteses e Precedência em SQL

> Ao combinar AND e OR em consultas SQL, sempre use parênteses para tornar a precedência explícita — nunca confie na precedência implícita.

## Rules

1. **Sempre agrupe condições com parênteses ao misturar AND e OR** — porque AND tem precedência maior que OR, e sem parênteses o resultado muda silenciosamente
2. **Trate cada grupo entre parênteses como um bloco lógico independente** — cada bloco retorna verdadeiro ou falso, e o operador externo conecta os resultados dos blocos
3. **Coloque o operador de conexão entre grupos FORA dos parênteses** — `(grupo1) AND (grupo2)`, porque isso torna a intenção legível
4. **Nunca misture AND e OR no mesmo nível sem parênteses** — porque o resultado depende da precedência implícita e é impossível de ler corretamente

## How to write

### Agrupando condições com parênteses

```sql
-- Dois grupos conectados por AND: ambos devem ser verdadeiros
SELECT * FROM products
WHERE (price > 45 AND price < 1000)
  AND (category = 'audio' OR category = 'image');
```

### Sem parênteses (comportamento inesperado)

```sql
-- AND tem precedência sobre OR — isso NÃO faz o que parece
SELECT * FROM products
WHERE price > 45 AND price < 1000 AND category = 'audio' OR category = 'image';
-- 'image' ignora os filtros de preço! Retorna TODOS os produtos de imagem.
```

## Example

**Before (bug silencioso de precedência):**
```sql
SELECT * FROM products
WHERE price > 45 AND price < 1000 OR category = 'image';
-- Retorna produtos com preço entre 45-1000 de QUALQUER categoria
-- E TAMBÉM todos os produtos de categoria 'image' independente do preço
```

**After (intenção explícita com parênteses):**
```sql
SELECT * FROM products
WHERE (price > 45 AND price < 1000)
  AND (category = 'image');
-- Retorna APENAS produtos de imagem com preço entre 45-1000
```

## Heuristics

| Situação | Faça |
|----------|------|
| Query com apenas AND | Parênteses opcionais (mesma precedência) |
| Query com apenas OR | Parênteses opcionais (mesma precedência) |
| Query misturando AND e OR | Parênteses obrigatórios em todos os grupos |
| Condição complexa com 3+ operadores | Quebre em grupos nomeados com parênteses |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `WHERE a AND b OR c` | `WHERE (a AND b) OR c` |
| `WHERE a OR b AND c AND d` | `WHERE a OR (b AND c AND d)` |
| `WHERE a AND b OR c AND d` | `WHERE (a AND b) OR (c AND d)` |
| `WHERE a AND b AND c OR d` | `WHERE (a AND b AND c) OR d` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Query retorna mais registros que o esperado | OR sem parenteses ignora filtros anteriores | Agrupe condicoes com parenteses: `(a AND b) OR (c AND d)` |
| Filtro parece nao funcionar | AND tem precedencia sobre OR, mudando a logica | Adicione parenteses explicitos em todas as combinacoes AND/OR |
| Resultado diferente entre bancos de dados | Precedencia pode variar sutilmente | Sempre use parenteses — elimina ambiguidade em qualquer banco |
| Query complexa dificil de ler | Muitos operadores sem agrupamento | Quebre em CTEs ou subqueries com parenteses claros |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre precedência de operadores e como o SQL avalia condições
- [code-examples.md](references/code-examples.md) — Todos os exemplos da aula com variações e cenários reais

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-parenteses/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-parenteses/references/code-examples.md)
