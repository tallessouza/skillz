---
name: rs-full-stack-inserindo-modulos
description: "Applies SQL INSERT patterns for populating related tables and testing foreign key constraints. Use when user asks to 'insert data', 'populate tables', 'test relationships', 'add records with foreign keys', or 'bulk insert'. Demonstrates foreign key restriction in action and multi-row INSERT syntax. Make sure to use this skill whenever inserting data into tables with relationships or testing one-to-many constraints. Not for CREATE TABLE, schema design, or SELECT query optimization."
---

# Inserindo Dados em Tabelas Relacionadas

> Ao inserir dados em tabelas com chave estrangeira, sempre valide que o registro referenciado existe antes de inserir.

## Rules

1. **Teste a restricao de FK antes de inserir dados reais** — insira propositalmente um ID inexistente para confirmar que o constraint funciona, porque isso valida que o relacionamento esta configurado corretamente
2. **Use INSERT multi-row para eficiencia** — separe tuplas por virgula em um unico INSERT, porque reduz round-trips ao banco e deixa o script mais legivel
3. **Omita colunas auto-incremento** — nao inclua `id` no INSERT quando e serial/autoincrement, porque o banco gera automaticamente
4. **Finalize INSERT com ponto e virgula** — sem `;` o banco espera mais valores apos virgula, porque a virgula indica continuacao de registros

## How to write

### INSERT basico com FK

```sql
INSERT INTO courses_modules (name, course_id)
VALUES
  ('Fundamentos do CSS', 2),
  ('Layout com CSS', 2),
  ('CSS Functions', 2);
```

### Testando restricao de FK

```sql
-- Primeiro: tentar inserir com ID inexistente (deve falhar)
INSERT INTO courses_modules (name, course_id)
VALUES ('Modulo Teste', 105);
-- ERROR: foreign key constraint violation

-- Verificar IDs validos
SELECT * FROM courses;

-- Depois: inserir com ID correto
INSERT INTO courses_modules (name, course_id)
VALUES ('Fundamentos do CSS', 2);
```

## Example

**Before (erro comum — inserir sem verificar FK):**

```sql
-- Insere direto sem saber se o curso existe
INSERT INTO courses_modules (name, course_id)
VALUES ('Meu Modulo', 999);
-- ERRO: violacao de chave estrangeira
```

**After (com esta skill aplicada):**

```sql
-- 1. Verificar cursos existentes
SELECT id, name FROM courses;

-- 2. Inserir modulos para curso existente (id=2, CSS)
INSERT INTO courses_modules (name, course_id)
VALUES
  ('Fundamentos do CSS', 2),
  ('Layout com CSS', 2),
  ('CSS Functions', 2);

-- 3. Verificar resultado
SELECT * FROM courses_modules;
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeira insercao em tabela com FK | Teste com ID invalido primeiro para validar constraint |
| Varios registros para o mesmo pai | Use INSERT multi-row com virgula entre tuplas |
| Precisa saber IDs validos | SELECT na tabela pai antes de inserir |
| Quer inserir em lote para cursos diferentes | Separe em INSERT distintos por clareza |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `INSERT INTO t (id, name, course_id) VALUES (1, ...)` | `INSERT INTO t (name, course_id) VALUES (...)` — omita o id serial |
| Inserir sem verificar se FK existe | `SELECT * FROM courses` antes de inserir modulos |
| Terminar com virgula: `('valor', 2),` | Terminar com `;`: `('valor', 2);` |
| Um INSERT por registro quando sao do mesmo lote | Multi-row: `VALUES (...), (...), (...);` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre FK constraints e relacionamento 1:N
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-inserindo-modulos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-inserindo-modulos/references/code-examples.md)
