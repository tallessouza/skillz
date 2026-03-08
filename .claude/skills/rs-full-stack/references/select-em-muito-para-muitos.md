---
name: rs-full-stack-select-em-muito-para-muitos
description: "Applies correct SQL SELECT patterns for many-to-many relationships using INNER JOINs across junction tables. Use when user asks to 'query many-to-many', 'join three tables', 'select from junction table', 'connect students and courses', or any SQL involving M:N relationships. Enforces column aliasing with AS, table aliases, and frontend-friendly naming (underscores, no spaces). Make sure to use this skill whenever writing SELECT queries that involve junction/pivot tables. Not for one-to-many joins, INSERT operations, or schema design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: database-queries
  tags:
    - sql
    - join
    - many-to-many
    - junction-table
    - inner-join
---

# Select em Muitos para Muitos

> Ao consultar dados de relacoes muitos-para-muitos, parta sempre da tabela intermediaria (junction table) e conecte as tabelas relacionadas via INNER JOIN usando chave estrangeira = chave primaria.

## Rules

1. **Parta da junction table no FROM** — `FROM students_courses sc`, porque ela e o ponto central que conecta as duas entidades
2. **Use aliases descritivos para tabelas** — `sc` para junction, `s` para students, `c` para courses, porque facilita a leitura e evita ambiguidade
3. **Conecte sempre FK = PK** — `s.id = sc.student_id`, porque a estrategia e sempre chave estrangeira conectando com chave primaria
4. **Renomeie colunas duplicadas com AS** — `s.name AS student_name`, porque colunas com mesmo nome causam confusao no frontend
5. **Use underscore nos aliases, nunca espacos** — `student_name` nao `student name`, porque espacos sao problematicos na programacao frontend
6. **Nunca use asterisco em queries de join** — liste as colunas explicitamente, porque com tres tabelas o asterisco retorna dados desnecessarios e ambiguos

## How to write

### Query completa M:N (tres tabelas)

```sql
SELECT
  sc.id,
  sc.student_id,
  sc.course_id,
  s.name AS student_name,
  c.name AS course_name
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id
INNER JOIN courses c ON c.id = sc.course_id;
```

### Padrao de construcao incremental

```sql
-- 1. Comece pela junction table
SELECT sc.id, sc.student_id, sc.course_id
FROM students_courses sc;

-- 2. Adicione primeiro INNER JOIN
SELECT sc.id, sc.student_id, sc.course_id, s.name AS student_name
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id;

-- 3. Adicione segundo INNER JOIN
SELECT sc.id, s.name AS student_name, c.name AS course_name
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id
INNER JOIN courses c ON c.id = sc.course_id;
```

## Example

**Before (problematico):**

```sql
SELECT *
FROM students_courses
INNER JOIN students ON students.id = students_courses.student_id
INNER JOIN courses ON courses.id = students_courses.course_id;
-- Colunas "name" duplicadas, sem alias, sem clareza para o frontend
```

**After (com esta skill aplicada):**

```sql
SELECT
  sc.id,
  s.name AS student_name,
  c.name AS course_name
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id
INNER JOIN courses c ON c.id = sc.course_id;
-- Colunas nomeadas explicitamente, aliases claros, frontend-friendly
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Duas colunas com mesmo nome em tabelas diferentes | Renomeie com AS usando prefixo da entidade: `student_name`, `course_name` |
| Query M:N com mais de 2 entidades | Adicione INNER JOINs incrementalmente, testando a cada passo |
| Frontend vai consumir o resultado | Use underscore nos aliases, nunca espacos ou caracteres especiais |
| Precisa de todos os campos da junction | Liste explicitamente: `sc.id, sc.student_id, sc.course_id` |
| Alias de tabela | Use abreviacoes significativas: `sc`, `s`, `c` — nao apenas letras soltas sem contexto |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|-----------------|
| `SELECT *` em join de 3 tabelas | `SELECT sc.id, s.name AS student_name, c.name AS course_name` |
| `s.name AS "student name"` | `s.name AS student_name` |
| `FROM students s INNER JOIN students_courses` | `FROM students_courses sc INNER JOIN students s` (parta da junction) |
| Colunas `name` duplicadas sem AS | Cada `name` com alias unico: `student_name`, `course_name` |
| `ON students_courses.student_id = students.id` sem alias | `ON s.id = sc.student_id` com aliases |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Colunas "name" duplicadas no resultado | Falta de alias AS nas colunas com mesmo nome | Use `s.name AS student_name, c.name AS course_name` |
| Query retorna registros duplicados | Junction table tem entradas duplicadas | Verifique constraints UNIQUE na junction table |
| INNER JOIN retorna menos registros que esperado | Registros sem correspondencia na tabela relacionada | Use LEFT JOIN se quiser incluir registros sem match |
| Erro de sintaxe no alias | Espaco no alias sem aspas | Use underscore: `student_name` em vez de `student name` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre junction tables, estrategia FK=PK, e construcao incremental
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-select-em-muito-para-muitos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-select-em-muito-para-muitos/references/code-examples.md)
