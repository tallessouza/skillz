---
name: rs-full-stack-relacionamento-muito-para-muitos
description: "Enforces many-to-many relationship patterns when designing SQL schemas. Use when user asks to 'create a table', 'model a relationship', 'connect two entities', 'many-to-many', or 'pivot table'. Applies rules: always create a pivot table for N:M, name it tableA_tableB, store only foreign keys, use NOT NULL on FKs. Make sure to use this skill whenever creating database schemas with N:M relationships. Not for one-to-one, one-to-many relationships, or application-level ORM configuration."
---

# Relacionamento Muitos para Muitos (N:M)

> Sempre que duas entidades se relacionam em ambas as direcoes com "muitos", crie uma terceira tabela (pivot) que conecta as duas exclusivamente por chaves estrangeiras.

## Rules

1. **Sempre crie uma tabela pivot para N:M** — nunca tente representar muitos-para-muitos com colunas extras nas tabelas existentes, porque isso gera duplicacao e quebra normalizacao
2. **Nomeie a pivot como `tabela1_tabela2`** — `students_courses` nao `enrollment` ou `matricula`, porque o nome revela imediatamente quais tabelas estao conectadas
3. **A pivot armazena basicamente IDs** — chave primaria propria + chaves estrangeiras, porque a funcao dela e exclusivamente conectar
4. **Chaves estrangeiras sempre NOT NULL** — uma conexao sem ambos os lados nao faz sentido, porque um registro na pivot sem referencia e um registro orfao
5. **Use a mesma tipagem da chave original** — se o ID da tabela referenciada e INTEGER, a FK tambem e INTEGER, porque tipos diferentes impedem o JOIN

## How to write

### Tabela pivot padrao

```sql
CREATE TABLE students_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

### Nomenclatura de FKs

```sql
-- FK = nome_da_tabela_referenciada + _id
student_id   -- referencia students(id)
course_id    -- referencia courses(id)
```

## Example

**Before (tentativa errada sem pivot):**
```sql
-- Adicionar coluna course_id em students? Nao funciona para MUITOS cursos
ALTER TABLE students ADD COLUMN course_id INTEGER;
-- Um aluno so poderia ter UM curso. Quebra o N:M.
```

**After (com tabela pivot):**
```sql
CREATE TABLE students_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Entidade A pode ter muitos B, e B pode ter muitos A | Criar tabela pivot `a_b` |
| Relacao so vai em uma direcao (1:N) | NAO precisa de pivot, use FK direta |
| Pivot precisa de dados extras (ex: nota, data_matricula) | Adicione colunas na pivot alem dos IDs |
| Duvida se e 1:N ou N:M | Pergunte: "o lado B tambem pode ter muitos A?" |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Coluna com lista separada por virgula (`"1,3,5"`) | Tabela pivot com uma linha por relacao |
| FK nullable na pivot | `NOT NULL` em todas as FKs da pivot |
| Nome generico (`relations`, `links`) | Nome descritivo (`students_courses`) |
| Tipos diferentes entre FK e PK original | Mesma tipagem exata (`INTEGER` ↔ `INTEGER`) |
| Pivot sem chave primaria propria | Sempre inclua `id PRIMARY KEY AUTOINCREMENT` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando e por que usar pivot tables, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes