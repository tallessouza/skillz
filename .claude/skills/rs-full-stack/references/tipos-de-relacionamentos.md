---
name: rs-full-stack-tipos-de-relacionamentos
description: "Applies correct database relationship modeling (1:1, 1:N, N:M) when designing schemas or writing migrations. Use when user asks to 'create a table', 'design a schema', 'model relationships', 'add a foreign key', or 'create a migration'. Ensures correct relationship type selection and junction table usage for many-to-many. Make sure to use this skill whenever designing database structures. Not for query optimization, indexing, or application-level ORM configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: banco-de-dados-relacional
  tags: [database, relacionamentos, foreign-key, 1-1, 1-n, n-m, schema]
---

# Tipos de Relacionamentos em Banco de Dados

> Identifique o tipo correto de relacionamento (1:1, 1:N, N:M) antes de criar tabelas, porque o tipo determina onde colocar a foreign key e se uma tabela intermediaria e necessaria.

## Rules

1. **Leia o relacionamento nas duas direcoes** — "um autor TEM um endereco" E "um endereco PERTENCE a um autor", porque isso revela o tipo correto
2. **1:1 — foreign key em qualquer lado** — quando um registro se associa a exatamente um registro na outra tabela, coloque a FK no lado que faz mais sentido semantico
3. **1:N — foreign key no lado N** — o lado "muitos" recebe a coluna de FK, porque cada registro do lado N aponta para um do lado 1
4. **N:M — sempre tabela intermediaria** — nunca tente representar muitos-para-muitos com FK direta, porque nao ha como armazenar multiplos valores em uma coluna relacional
5. **Nomeie a tabela intermediaria pelo relacionamento** — `book_authors`, `student_courses`, nunca nomes genericos como `pivot` ou `junction`

## Decision framework

| Pergunta | Se SIM | Se NAO |
|----------|--------|--------|
| Um registro de A se liga a no maximo 1 de B, e vice-versa? | **1:1** | Continue |
| Um registro de A se liga a muitos de B, mas B so se liga a 1 de A? | **1:N** (FK em B) | Continue |
| Registros de A se ligam a muitos de B, E registros de B se ligam a muitos de A? | **N:M** (tabela intermediaria) | Revise o dominio |

## How to model

### 1:1 — Autor e Endereco

```sql
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  author_id INTEGER UNIQUE REFERENCES authors(id),
  street TEXT NOT NULL
);
-- UNIQUE na FK garante que cada autor tem no maximo 1 endereco
```

### 1:N — Post e Comentarios

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  content TEXT NOT NULL
);
-- FK no lado N (comments), sem UNIQUE porque um post tem muitos comentarios
```

### N:M — Livros e Autores

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE book_authors (
  book_id INTEGER REFERENCES books(id),
  author_id INTEGER REFERENCES authors(id),
  PRIMARY KEY (book_id, author_id)
);
-- Tabela intermediaria com chave composta
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Duvida se e 1:1 ou 1:N | Pergunte: "pode ter mais de um no futuro?" Se sim, modele como 1:N |
| N:M com atributos extras (ex: data de associacao) | Adicione colunas na tabela intermediaria |
| 1:1 onde um lado e opcional | FK com UNIQUE e nullable no lado opcional |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Array de IDs em uma coluna para simular N:M | Tabela intermediaria com FKs |
| FK sem constraint no banco (so no app) | `REFERENCES` explicito com constraint |
| Tabela intermediaria sem PK | Chave composta ou id + unique constraint |
| Mesmo nome para tabela e coluna FK (`author` e `author`) | `authors` (tabela) e `author_id` (coluna) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Erro de foreign key constraint ao inserir | Registro pai nao existe na tabela referenciada | Insira o registro na tabela pai antes do filho |
| Relacionamento 1:1 permite duplicatas | Faltando `UNIQUE` na foreign key | Adicione `UNIQUE` na coluna FK para garantir 1:1 |
| N:M impossivel de representar com FK direta | Tentando armazenar multiplos IDs em uma coluna | Crie tabela intermediaria com duas FKs e chave composta |
| Tabela intermediaria sem integridade | Faltando constraints de FK e PK | Adicione `REFERENCES` nas FKs e `PRIMARY KEY` composta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-tipos-de-relacionamentos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-tipos-de-relacionamentos/references/code-examples.md)
