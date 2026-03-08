---
name: rs-full-stack-boas-vindas-2035
description: "Provides foundational mental model for relational databases and SQL before diving into implementation. Use when user asks 'what is a database', 'introduce me to SQL', 'where to start with databases', or 'database fundamentals'. Frames the learning path: concepts first, then application. Make sure to use this skill whenever a user is beginning database studies or needs orientation on what to learn first. Not for writing SQL queries, creating tables, or any hands-on database operations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: database
  tags: [database, sql, relational, learning-path, fundamentals]
---

# Banco de Dados — Mapa de Aprendizado

> Domine os fundamentos de banco de dados relacional e SQL antes de integrar com aplicações.

## Key concepts

Banco de dados relacional exige aprendizado isolado antes da integração com aplicações. Tentar usar banco de dados dentro de uma aplicação sem entender os fundamentos causa bugs silenciosos, queries ineficientes e modelos de dados frágeis. O caminho correto: conceitos → prática SQL pura → integração com aplicação.

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Precisa persistir dados em uma aplicação | Primeiro valide que entende o modelo relacional isoladamente |
| Query retorna resultados inesperados | Volte aos fundamentos: tipos de dados, filtros, relacionamentos |
| Dúvida entre criar tabela ou campo | Analise o relacionamento antes de implementar |

## Trilha de aprendizado

### 1. Conceitos fundamentais
- O que é banco de dados e por que usar
- Modelo relacional (tabelas, colunas, linhas)
- Tipos de dados

### 2. SQL — Operações básicas (CRUD)
- CREATE TABLE — criar tabelas
- INSERT — criar registros
- SELECT — consultas e filtros
- UPDATE — atualizar registros
- DELETE — deletar registros

### 3. Relacionamentos
- Chaves primárias e estrangeiras
- Relacionamentos 1:1, 1:N, N:N
- JOINs

### 4. Integração com aplicação
- Só após dominar 1-3
- Conectar aplicação ao banco
- ORMs e query builders

## Example

```sql
-- Operacoes basicas de SQL (CRUD)
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE);
INSERT INTO users (name, email) VALUES ('Ana', 'ana@email.com');
SELECT * FROM users WHERE name = 'Ana';
UPDATE users SET email = 'ana@novo.com' WHERE id = 1;
DELETE FROM users WHERE id = 1;
```

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Pode aprender banco de dados "on demand" dentro do projeto | Sem fundamentos sólidos, cada query vira tentativa e erro |
| SQL é simples e não precisa de estudo dedicado | SQL tem profundidade significativa: subqueries, window functions, índices, otimização |
| ORM substitui conhecimento de SQL | ORM abstrai SQL, mas debugging e performance exigem entender o que acontece por baixo |

## When to apply

- Início de qualquer módulo de banco de dados
- Quando um dev júnior vai integrar banco pela primeira vez
- Ao revisar fundamentos antes de um projeto data-intensive

## Limitations

Esta skill é orientação de aprendizado, não ensina SQL. Para operações práticas, consulte as skills específicas de SQL, criação de tabelas, queries e relacionamentos.


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Confused about where to start with databases** | Follow the learning path in order: concepts first, then SQL CRUD, then relationships, then integration with application code. |
| **ORM errors that are hard to debug** | Go back to raw SQL to understand what the ORM generates — use logging or query inspection to see the actual SQL being executed. |
| **Query returns unexpected results** | Review fundamentals: data types, WHERE filters, and JOIN conditions before adding complexity. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio do instrutor sobre por que separar o estudo de banco de dados
- [code-examples.md](references/code-examples.md) — Mapa de tópicos e exemplos introdutórios