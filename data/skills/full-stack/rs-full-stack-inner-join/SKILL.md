---
name: rs-full-stack-inner-join
description: "Applies SQL INNER JOIN patterns when writing queries that connect multiple tables. Use when user asks to 'join tables', 'query related data', 'fetch from multiple tables', 'connect tables', or 'get data with foreign key'. Enforces table aliasing, explicit column selection, and ON clause with matching foreign keys. Make sure to use this skill whenever writing SQL that involves more than one table. Not for single-table queries, subqueries, or LEFT/RIGHT/FULL joins."
---

# Inner Join — Consultas em Múltiplas Tabelas

> Ao consultar dados relacionados entre tabelas, use INNER JOIN com aliases explícitos e colunas qualificadas pelo nome da tabela.

## Rules

1. **Nunca use `SELECT *` em joins** — liste colunas explicitamente com prefixo da tabela, porque colunas ambíguas (como `id`) causam erro silencioso ou erro de "column is ambiguous"
2. **Sempre renomeie tabelas com alias** — `FROM student_address AS a` não `FROM student_address`, porque qualifica colunas e evita ambiguidade
3. **Identifique a coluna em comum (foreign key)** — o `ON` conecta a chave estrangeira de uma tabela ao `id` da outra, porque sem essa conexão correta o join retorna dados incorretos
4. **INNER JOIN retorna apenas correspondências** — use quando precisa de dados que existam em ambas as tabelas, porque linhas sem correspondência são excluídas do resultado
5. **Qualifique toda coluna com alias da tabela** — `a.street` não `street`, mesmo que não seja ambígua, porque mantém clareza sobre a origem do dado

## How to write

### Join básico com alias

```sql
SELECT
  a.id,
  a.student_id,
  s.name,
  a.street,
  a.city
FROM student_address AS a
INNER JOIN students AS s ON s.id = a.student_id;
```

### Múltiplas colunas de tabelas diferentes

```sql
SELECT
  s.name,
  s.email,
  a.street,
  a.city,
  a.zip_code
FROM students AS s
INNER JOIN student_address AS a ON a.student_id = s.id;
```

## Example

**Before (erro comum — coluna ambígua):**

```sql
SELECT id, student_id, street, city
FROM student_address
INNER JOIN students ON students.id = student_address.student_id;
-- ERROR: column "id" is ambiguous
```

**After (com aliases e colunas qualificadas):**

```sql
SELECT
  a.id,
  a.student_id,
  s.name,
  a.street,
  a.city
FROM student_address AS a
INNER JOIN students AS s ON s.id = a.student_id;
```

## Heuristics

| Situação | Faça |
|----------|------|
| Duas tabelas com coluna `id` | Sempre qualificar com alias: `a.id`, `s.id` |
| Quer dados que existam em ambas tabelas | Use INNER JOIN |
| Quer incluir linhas sem correspondência | Use LEFT JOIN (não INNER) |
| Foreign key óbvia (`student_id`) | Use no ON: `ON s.id = a.student_id` |
| Query com 3+ tabelas | Um INNER JOIN por tabela adicional, cada um com seu ON |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `SELECT * FROM a INNER JOIN b` | `SELECT a.col1, b.col2 FROM a INNER JOIN b` |
| `FROM student_address INNER JOIN students ON students.id = student_address.student_id` (sem alias) | `FROM student_address AS a INNER JOIN students AS s ON s.id = a.student_id` |
| `SELECT id FROM ...` (ambíguo em join) | `SELECT a.id FROM ...` |
| `WHERE a.student_id = s.id` (join implícito) | `INNER JOIN students AS s ON s.id = a.student_id` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre chaves estrangeiras, pivôs de conexão e quando usar INNER vs outros joins
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula expandidos com variações