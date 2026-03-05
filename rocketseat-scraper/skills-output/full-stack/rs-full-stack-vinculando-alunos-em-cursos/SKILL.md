---
name: rs-full-stack-vinculando-alunos-cursos
description: "Applies many-to-many relationship patterns when writing SQL inserts for junction tables. Use when user asks to 'insert into junction table', 'link two entities', 'many-to-many relationship', 'vincular registros', or 'matricular aluno em curso'. Enforces foreign key validation, auto-increment awareness, and proper insert syntax for associative tables. Make sure to use this skill whenever creating or populating junction/pivot tables in SQL. Not for SELECT queries, schema creation (CREATE TABLE), or one-to-many relationships."
---

# Vinculando Registros em Tabelas Associativas (Many-to-Many)

> Ao inserir dados em tabelas de relacionamento muitos-para-muitos, referencie apenas IDs que existem nas tabelas originais e nunca informe o ID auto-incremento.

## Rules

1. **Omita o ID auto-incremento no INSERT** — a coluna `id` com auto-incremento nunca aparece na lista de colunas do INSERT, porque o banco gera automaticamente
2. **Referencie apenas colunas de FK na junction table** — `INSERT INTO students_courses (student_id, course_id)`, porque a tabela associativa existe apenas para conectar duas entidades
3. **Valide existencia antes de inserir** — execute SELECT nas tabelas de origem para confirmar que os IDs existem, porque foreign keys bloqueiam inserts com IDs inexistentes
4. **Um registro por combinacao** — cada par (student_id, course_id) representa uma matricula unica, porque duplicatas indicam erro logico (a menos que a tabela permita)
5. **Teste as restricoes** — tente inserir um FK invalido para confirmar que o banco rejeita, porque isso valida que o schema esta correto

## How to write

### Insert em tabela associativa

```sql
-- Nunca inclua o id auto-incremento
INSERT INTO students_courses (student_id, course_id)
VALUES (1, 2);
```

### Verificar dados antes de inserir

```sql
-- Primeiro: descobrir os IDs validos
SELECT * FROM students;
SELECT * FROM courses;

-- Depois: inserir com IDs confirmados
INSERT INTO students_courses (student_id, course_id)
VALUES (1, 2);
```

### Confirmar o relacionamento

```sql
SELECT * FROM students_courses;
```

## Example

**Before (erro comum — inserir FK inexistente):**

```sql
-- Estudante 42 nao existe no banco
INSERT INTO students_courses (student_id, course_id)
VALUES (42, 2);
-- ERRO: foreign key constraint violation
```

**After (com validacao):**

```sql
-- 1. Verificar que o estudante existe
SELECT * FROM students WHERE id = 1;

-- 2. Verificar que o curso existe
SELECT * FROM courses WHERE id = 2;

-- 3. Inserir com seguranca
INSERT INTO students_courses (student_id, course_id)
VALUES (1, 2);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa vincular duas entidades | Crie uma junction table com duas FKs |
| Um aluno em varios cursos | Insira multiplas linhas com o mesmo student_id |
| Um curso com varios alunos | Insira multiplas linhas com o mesmo course_id |
| ID nao existe na tabela origem | Nao insira — o banco vai rejeitar por FK constraint |
| Precisa confirmar o relacionamento | SELECT na junction table apos o INSERT |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `INSERT INTO students_courses (id, student_id, course_id) VALUES (1, 1, 2)` | `INSERT INTO students_courses (student_id, course_id) VALUES (1, 2)` |
| Inserir sem verificar se os IDs existem | SELECT nas tabelas de origem antes do INSERT |
| Assumir que qualquer ID e valido | Testar com ID inexistente para confirmar a constraint |
| Colocar dados de dominio na junction table | Junction table so tem FKs (e opcionalmente timestamps) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre relacionamento muitos-para-muitos e foreign keys
- [code-examples.md](references/code-examples.md) — Todos os exemplos SQL expandidos com variacoes