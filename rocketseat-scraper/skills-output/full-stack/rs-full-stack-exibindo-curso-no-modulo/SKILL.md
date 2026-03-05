---
name: rs-full-stack-exibindo-curso-no-modulo
description: "Applies SQL INNER JOIN patterns with proper column aliasing when writing queries that join multiple tables. Use when user asks to 'join tables', 'query related data', 'show data from multiple tables', 'write a SELECT with JOIN', or 'combine database tables'. Enforces rules: no SELECT *, always alias tables, rename columns to avoid ambiguity, use ON clause correctly. Make sure to use this skill whenever generating SQL queries that involve more than one table. Not for single-table queries, schema design, or migration scripts."
---

# INNER JOIN com Alias de Tabelas

> Ao escrever queries com JOIN, sempre use alias de tabelas e selecione colunas explicitamente para evitar ambiguidade.

## Rules

1. **Nunca use asterisco com JOIN** — `SELECT m.id, m.name` nao `SELECT *`, porque asterisco causa ambiguidade quando tabelas tem colunas com mesmo nome (ex: ambas tem `id`, `name`)
2. **Sempre renomeie tabelas com alias** — `FROM modules m` nao `FROM modules`, porque simplifica a query e torna referencias explicitas
3. **Qualifique todas as colunas** — `m.name` nao `name`, porque sem qualificacao o banco nao sabe de qual tabela vem a coluna
4. **ON conecta chave estrangeira com chave primaria** — `ON c.id = m.course_id`, porque a relacao sempre vai da PK da tabela referenciada para a FK da tabela que referencia
5. **Coloque FROM na linha seguinte ao SELECT** — melhora legibilidade quando ha muitas colunas

## How to write

### JOIN basico com alias

```sql
SELECT
  m.id,
  m.name,
  c.name
FROM modules m
INNER JOIN courses c ON c.id = m.course_id;
```

### Sem alias (tambem funciona, mas mais verboso)

```sql
SELECT
  modules.id,
  modules.name,
  courses.name
FROM modules
INNER JOIN courses ON courses.id = modules.course_id;
```

## Example

**Before (errado):**
```sql
SELECT * FROM modules INNER JOIN courses ON courses.id = course_id;
```

**After (com esta skill aplicada):**
```sql
SELECT
  m.id,
  m.name,
  m.course_id,
  c.name
FROM modules m
INNER JOIN courses c ON c.id = m.course_id;
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Query envolve 1 tabela | Alias opcional, colunas explicitas |
| Query envolve 2+ tabelas | Alias obrigatorio, todas colunas qualificadas |
| Tabelas com nomes longos | Use alias curto (1-2 letras da inicial) |
| Colunas com mesmo nome em tabelas diferentes | Qualifique com alias para desambiguar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `SELECT * FROM a INNER JOIN b` | `SELECT a.id, a.name, b.name FROM a INNER JOIN b` |
| `ON id = course_id` | `ON c.id = m.course_id` |
| `SELECT name FROM modules INNER JOIN courses` | `SELECT m.name, c.name FROM modules m INNER JOIN courses c` |
| `FROM modules INNER JOIN courses ON courses.id = course_id` | `FROM modules m INNER JOIN courses c ON c.id = m.course_id` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ambiguidade e alias
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes