---
name: rs-full-stack-relacionamento-um-para-um
description: "Applies one-to-one relationship patterns when creating SQL tables with foreign keys. Use when user asks to 'create a table with foreign key', 'relate two tables', 'one-to-one relationship', 'add address table', or 'connect tables in SQL'. Enforces primary key, foreign key with REFERENCES, UNIQUE constraint for 1:1, and NOT NULL on required columns. Make sure to use this skill whenever creating related SQL tables or modeling entity relationships. Not for many-to-many relationships, ORM migrations, or NoSQL schemas."
---

# Relacionamento Um para Um (SQL)

> Ao criar relacionamento 1:1, use foreign key com UNIQUE para garantir que cada registro pai tenha no maximo um registro filho.

## Rules

1. **Sempre defina PRIMARY KEY com AUTO INCREMENT na tabela filha** — `id INTEGER PRIMARY KEY AUTOINCREMENT`, porque cada tabela precisa de identidade propria
2. **Foreign key recebe UNIQUE** — `student_id INTEGER UNIQUE NOT NULL`, porque UNIQUE garante que o relacionamento seja 1:1 (um estudante so pode ter um endereco)
3. **Foreign key recebe NOT NULL** — porque o registro filho sem vinculo com o pai nao faz sentido no contexto 1:1
4. **Declare FOREIGN KEY explicitamente** — `FOREIGN KEY(student_id) REFERENCES students(id)`, porque o SQL precisa saber qual tabela e coluna referenciar
5. **REFERENCES exige parenteses** — `REFERENCES students(id)` com parenteses obrigatorio, porque sem parenteses o SQL retorna erro
6. **Nomeie a coluna foreign key como `{tabela_pai}_id`** — `student_id`, porque deixa explicito de onde vem a referencia

## How to write

### Tabela com relacionamento 1:1

```sql
CREATE TABLE student_address (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER UNIQUE NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  FOREIGN KEY(student_id) REFERENCES students(id)
);
```

### Anatomia das chaves

```sql
-- PRIMARY KEY: chave gerada DENTRO desta tabela (identidade propria)
id INTEGER PRIMARY KEY AUTOINCREMENT

-- FOREIGN KEY: chave que vem de OUTRA tabela (referencia externa)
student_id INTEGER UNIQUE NOT NULL
-- UNIQUE = garante 1:1 (sem UNIQUE seria 1:N)
-- NOT NULL = todo endereco DEVE ter um estudante

-- Declaracao da conexao
FOREIGN KEY(student_id) REFERENCES students(id)
-- "student_id nesta tabela aponta para id na tabela students"
```

## Example

**Before (relacionamento quebrado — sem constraints):**

```sql
CREATE TABLE student_address (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  street TEXT,
  city TEXT
);
-- Problema: student_id pode ser NULL, duplicado, e sem referencia
-- Resultado: varios enderecos por aluno, enderecos orfaos
```

**After (relacionamento 1:1 correto):**

```sql
CREATE TABLE student_address (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER UNIQUE NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  FOREIGN KEY(student_id) REFERENCES students(id)
);
-- UNIQUE impede duplicatas, NOT NULL impede orfaos
-- FOREIGN KEY garante integridade referencial
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Um registro pai tem exatamente um filho | FOREIGN KEY + UNIQUE + NOT NULL |
| Um registro pai pode ter varios filhos (1:N) | FOREIGN KEY + NOT NULL (sem UNIQUE) |
| Coluna do filho deve sempre existir | NOT NULL na foreign key |
| Precisa garantir integridade referencial | FOREIGN KEY com REFERENCES |

## Anti-patterns

| Nunca escreva | Escreva isto |
|---------------|-------------|
| `student_id INTEGER` (sem constraints) | `student_id INTEGER UNIQUE NOT NULL` |
| `REFERENCES students id` (sem parenteses) | `REFERENCES students(id)` |
| Foreign key sem declaracao FOREIGN KEY | `FOREIGN KEY(student_id) REFERENCES students(id)` |
| Tudo numa linha so (ilegivel) | Separe FOREIGN KEY em linha propria para clareza |
| `address` como nome de tabela generica | `student_address` (explicita o dono) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre chaves primarias vs estrangeiras, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes