---
name: rs-full-stack-criando-tabela-de-alunos
description: "Applies correct SQL table creation patterns when writing CREATE TABLE statements in SQLite. Use when user asks to 'create a table', 'define a schema', 'add a database table', or 'setup the database'. Enforces proper column types, PRIMARY KEY with AUTOINCREMENT, and NOT NULL constraints. Make sure to use this skill whenever generating SQL DDL statements for SQLite databases. Not for queries (SELECT/INSERT/UPDATE/DELETE), migrations, or ORM model definitions."
---

# Criando Tabelas SQL (SQLite)

> Ao criar tabelas SQL, defina tipos explícitos, chave primária com autoincrement, e constraints NOT NULL para campos obrigatórios.

## Rules

1. **Sempre defina PRIMARY KEY com AUTOINCREMENT no id** — `id INTEGER PRIMARY KEY AUTOINCREMENT`, porque garante IDs únicos gerados automaticamente em sequência
2. **Use NOT NULL em campos obrigatórios** — `name TEXT NOT NULL`, porque evita registros incompletos no banco
3. **Escreva os tipos corretos** — `INTEGER` para números inteiros, `TEXT` para strings, porque SQLite usa tipagem dinâmica mas tipos explícitos documentam a intenção
4. **Separe colunas com vírgula** — última coluna sem vírgula, porque vírgula extra causa erro de sintaxe
5. **Finalize com ponto e vírgula** — opcional em ferramentas visuais, obrigatório em scripts, porque scripts executam múltiplos statements
6. **Verifique a grafia das palavras reservadas** — `AUTOINCREMENT` (não `AUTOINCRMENT`), porque erro de digitação em SQL falha silenciosamente ou com mensagens pouco claras

## How to write

### Tabela básica com id e campo texto

```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

### Tabela com múltiplos campos

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT
);
```

## Example

**Before (erros comuns):**
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTO INCREMENT,
  name TEXT,
)
```

**After (com esta skill aplicada):**
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo que sempre deve ter valor | Adicione `NOT NULL` |
| Identificador da tabela | `id INTEGER PRIMARY KEY AUTOINCREMENT` |
| Campo opcional | Omita `NOT NULL` (permite NULL por padrão) |
| Erro de sintaxe estranho | Verifique grafia das palavras reservadas e vírgulas |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `AUTO INCREMENT` (com espaço) | `AUTOINCREMENT` (junto) |
| `id INT PRIMARY KEY` (sem autoincrement) | `id INTEGER PRIMARY KEY AUTOINCREMENT` |
| `name TEXT` (sem constraint em campo obrigatório) | `name TEXT NOT NULL` |
| Vírgula após última coluna | Sem vírgula na última coluna |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre autoincrement, sqlite_sequence e constraints
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações