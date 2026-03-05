---
name: rs-full-stack-count-1
description: "Applies SQL COUNT function patterns when writing queries that need record totals. Use when user asks to 'count records', 'get total rows', 'how many entries', 'count items in table', or any query needing row counts. Enforces COUNT with filters, proper column references, and dynamic counting over manual inspection. Make sure to use this skill whenever generating SQL that needs record quantities. Not for SUM, AVG, or other aggregate functions beyond counting."
---

# SQL COUNT

> Use COUNT para obter quantidades de registros dinamicamente — nunca conte manualmente.

## Rules

1. **Use COUNT para quantidades** — `SELECT COUNT(*) FROM tabela`, nunca conte linhas visualmente, porque tabelas reais tem milhares de registros
2. **COUNT(*) é o padrão** — o asterisco conta todas as linhas, independente de coluna, porque é a forma mais clara de expressar "total de registros"
3. **COUNT(coluna) conta non-NULL** — usar coluna específica só quando precisar ignorar NULLs, porque COUNT(coluna) pula valores NULL
4. **Combine com WHERE para contagens filtradas** — `COUNT(*) ... WHERE condição` retorna totais parciais dinamicamente, porque evita subconsultas desnecessárias
5. **O nome da coluna resultante reflete o argumento** — COUNT(*) retorna coluna chamada `count(*)`, COUNT(name) retorna `count(name)`, use alias para clareza

## How to write

### Contagem total

```sql
-- Contar todos os registros de uma tabela
SELECT COUNT(*) FROM products;
```

### Contagem com filtro

```sql
-- Contar registros que atendem um critério
SELECT COUNT(*) FROM products WHERE price >= 600;
```

### Contagem com alias

```sql
-- Dar nome legível à coluna de resultado
SELECT COUNT(*) AS total_products FROM products;
SELECT COUNT(*) AS expensive_products FROM products WHERE price >= 600;
```

## Example

**Before (contagem manual ou ineficiente):**

```sql
-- Buscar todos os registros só para contar visualmente
SELECT * FROM products;
-- "Ah, tem 5 linhas"
```

**After (com COUNT):**

```sql
-- Obter quantidade diretamente
SELECT COUNT(*) AS total FROM products;
-- Resultado: 5

-- Com filtro específico
SELECT COUNT(*) AS total FROM products WHERE price >= 600;
-- Resultado: 2
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa saber quantos registros existem | `SELECT COUNT(*) FROM tabela` |
| Precisa contar com condição | `SELECT COUNT(*) FROM tabela WHERE condição` |
| Precisa ignorar NULLs numa coluna | `SELECT COUNT(coluna) FROM tabela` |
| Precisa contar valores distintos | `SELECT COUNT(DISTINCT coluna) FROM tabela` |
| Resultado precisa de nome legível | Use `AS alias` no COUNT |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `SELECT * FROM tabela` e contar linhas visualmente | `SELECT COUNT(*) FROM tabela` |
| `SELECT COUNT(name) FROM tabela` sem motivo para excluir NULLs | `SELECT COUNT(*) FROM tabela` |
| COUNT sem alias em queries complexas | `SELECT COUNT(*) AS total FROM tabela` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre COUNT, diferenças entre COUNT(*) e COUNT(coluna), e quando usar cada forma
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-count-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-count-1/references/code-examples.md)
