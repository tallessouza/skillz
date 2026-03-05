---
name: rs-full-stack-operadores-and-e-or
description: "Enforces correct usage of SQL AND and OR operators when writing queries with multiple conditions. Use when user asks to 'write a query', 'filter results', 'add conditions to WHERE', 'combine filters in SQL', or any SQL query with multiple criteria. Applies rules: AND requires all conditions true, OR requires at least one true, choose operator based on filtering intent. Make sure to use this skill whenever generating SQL with multiple WHERE conditions. Not for single-condition queries, JOIN logic, or application-level boolean logic."
---

# Operadores AND e OR no SQL

> Ao combinar filtros em SQL, escolha AND quando todos os criterios devem ser atendidos e OR quando basta um criterio ser atendido.

## Rules

1. **AND = todos os criterios verdadeiros** — o registro so retorna se CADA condicao for verdadeira, porque AND funciona como uma porta logica que exige verdade em todas as entradas
2. **OR = pelo menos um criterio verdadeiro** — o registro retorna se QUALQUER condicao for verdadeira, porque OR qualifica o registro com apenas uma condicao atendida
3. **Combine multiplos AND livremente** — encadeie quantos AND precisar para refinar progressivamente o resultado, porque cada AND adicional estreita o conjunto retornado
4. **AND e OR podem usar campos diferentes** — nao restrinja filtros ao mesmo campo, porque criterios podem cruzar colunas distintas (ex: price > 500 AND id > 2)
5. **Use parenteses ao misturar AND e OR** — porque AND tem precedencia sobre OR, e parenteses tornam a intencao explicita e evitam bugs silenciosos

## How to write

### Filtro com AND (intervalo de valores)

```sql
-- Retorna produtos com preco entre 500 e 1000
SELECT * FROM products
WHERE price > 500
  AND price < 1000;
```

### Filtro com AND em campos diferentes

```sql
-- Retorna produtos com preco entre 500 e 1000 E id maior que 2
SELECT * FROM products
WHERE price > 500
  AND price < 1000
  AND id > 2;
```

### Filtro com OR (qualquer criterio)

```sql
-- Retorna produtos com preco > 500 OU preco < 1000 (praticamente todos)
SELECT * FROM products
WHERE price > 500
  OR price < 1000;
```

## Example

**Before (intencao ambigua — OR onde deveria ser AND):**

```sql
-- Desenvolvedor quer produtos entre 500 e 1000, mas usa OR
SELECT * FROM products
WHERE price > 500
  OR price < 1000;
-- Resultado: retorna TODOS os registros, porque qualquer preco atende pelo menos uma condicao
```

**After (AND correto para intervalo):**

```sql
SELECT * FROM products
WHERE price > 500
  AND price < 1000;
-- Resultado: retorna apenas produtos com preco entre 500 e 1000
```

## Heuristics

| Situacao | Operador |
|----------|----------|
| Intervalo de valores (entre X e Y) | AND |
| Lista de opcoes alternativas | OR |
| Todos os criterios devem ser satisfeitos | AND |
| Basta um criterio ser satisfeito | OR |
| Mistura de AND e OR na mesma query | Usar parenteses para agrupar |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `WHERE price > 500 OR price < 1000` (para intervalo) | `WHERE price > 500 AND price < 1000` |
| `WHERE a = 1 AND b = 2 OR c = 3` (ambiguo) | `WHERE a = 1 AND (b = 2 OR c = 3)` |
| Multiplos OR quando quer listar valores | `WHERE status IN ('active', 'pending')` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo com analogia de verdadeiro/falso e analise registro por registro
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes e cenarios adicionais

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-operadores-and-e-or/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-operadores-and-e-or/references/code-examples.md)
