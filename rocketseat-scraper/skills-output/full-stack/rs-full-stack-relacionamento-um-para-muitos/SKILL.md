---
name: rs-full-stack-relacionamento-um-para-muitos
description: "Applies one-to-many relationship patterns when designing SQL database schemas. Use when user asks to 'create a table', 'add a foreign key', 'model a relationship', 'design a schema with modules/items/children', or any database modeling task involving parent-child entities. Enforces correct foreign key typing, no UNIQUE on the many-side, and proper REFERENCES syntax. Make sure to use this skill whenever creating tables that reference other tables in a 1:N pattern. Not for one-to-one relationships, many-to-many junction tables, or application-level ORM configuration."
---

# Relacionamento Um para Muitos (1:N)

> Quando uma entidade pai possui muitas entidades filhas, a chave estrangeira fica na tabela filha SEM constraint UNIQUE.

## Rules

1. **Chave estrangeira na tabela filha** — a coluna que referencia o pai fica na tabela "muitos", porque cada filho aponta para exatamente um pai
2. **Nunca use UNIQUE na FK do lado "muitos"** — UNIQUE transformaria o relacionamento em 1:1, porque impediria dois filhos de apontar para o mesmo pai
3. **Tipo da FK deve ser idêntico ao tipo da PK** — se `courses.id` é INTEGER, então `course_modules.course_id` deve ser INTEGER, porque tipos diferentes quebram o REFERENCES
4. **FK como NOT NULL quando o filho não existe sem o pai** — um módulo sem curso não faz sentido, então `course_id NOT NULL` garante integridade
5. **Nomeie a FK como `{tabela_pai_singular}_id`** — `course_id`, não `id_curso` ou `fk_course`, porque mantém consistência e é grep-friendly

## How to write

### Tabela pai (o "um")

```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

### Tabela filha (os "muitos")

```sql
CREATE TABLE course_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  course_id INTEGER NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## Example

**Before (erro comum — UNIQUE na FK):**

```sql
CREATE TABLE course_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  course_id INTEGER NOT NULL UNIQUE,  -- ERRADO: vira 1:1
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

**After (1:N correto — sem UNIQUE):**

```sql
CREATE TABLE course_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  course_id INTEGER NOT NULL,  -- Sem UNIQUE: permite muitos módulos por curso
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| "Um X tem muitos Y" | FK na tabela Y, sem UNIQUE |
| "Um X tem exatamente um Y" | FK com UNIQUE (relacionamento 1:1) |
| Filho nao existe sem pai | `NOT NULL` na FK |
| Filho pode existir sem pai | FK permite NULL |
| Tipo da PK do pai é INTEGER | FK tambem deve ser INTEGER |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `course_id INTEGER UNIQUE` (em 1:N) | `course_id INTEGER NOT NULL` |
| `FOREIGN KEY (id) REFERENCES courses(id)` | `FOREIGN KEY (course_id) REFERENCES courses(id)` |
| FK com tipo diferente da PK (`TEXT` vs `INTEGER`) | Mesmo tipo da PK referenciada |
| Sem FOREIGN KEY explícita (confiando só na app) | `FOREIGN KEY (col) REFERENCES tabela(pk)` sempre |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre 1:N vs 1:1, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações