---
name: rs-full-stack-introducao-ao-sql
description: "Applies SQL fundamentals knowledge when writing database queries for relational databases. Use when user asks to 'write a query', 'create a table', 'query the database', 'use SQL', or works with SQLite, PostgreSQL, or SQL Server. Covers SQL as standard language across relational DBs, syntax differences between engines, and CRUD operations. Make sure to use this skill whenever generating SQL or discussing relational database concepts. Not for NoSQL databases, ORMs, or application-level data access patterns."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql-fundamentals
  tags: [sql, database, crud, sqlite, postgresql, relational]
---

# Introdução ao SQL

> SQL é a linguagem padrão de todos os bancos de dados relacionais — aprenda uma vez, aplique em qualquer engine.

## Key concept

SQL (Structured Query Language — Linguagem de Consulta Estruturada) é a linguagem padrão para criar, modificar e consultar dados em bancos de dados relacionais. O conhecimento de SQL é portável entre engines (SQLite, PostgreSQL, SQL Server, MySQL) porque todas seguem o mesmo padrão, com pequenas variações de sintaxe.

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Precisa manipular dados em banco relacional | SQL é a ferramenta correta |
| Trocar de engine (ex: SQLite → PostgreSQL) | Mesmo SQL, ajuste detalhes de sintaxe |
| Precisa criar, ler, atualizar ou deletar dados | SQL cobre todas essas operações (CRUD) |

## Diferenças entre engines

| Aspecto | SQLite | PostgreSQL | SQL Server |
|---------|--------|------------|------------|
| Ponto e vírgula | Opcional | Obrigatório | Obrigatório |
| Strings/texto | Aspas simples `'texto'` | Aspas simples `'texto'` | Aspas duplas ou simples |
| Tipagem | Flexível (type affinity) | Estrita | Estrita |

## How to think about it

### Portabilidade do SQL
SQL é como inglês para bancos relacionais — todos "falam" a mesma língua base. Diferenças entre engines são como sotaques: pequenos detalhes de sintaxe mudam, mas a estrutura e o significado são os mesmos. Aprenda o padrão SQL e adapte os detalhes conforme a engine.

### CRUD como base
Toda manipulação de dados se resume a quatro operações:

```sql
-- Create (Inserir)
INSERT INTO users (name, email) VALUES ('João', 'joao@email.com');

-- Read (Consultar)
SELECT name, email FROM users WHERE active = true;

-- Update (Modificar)
UPDATE users SET name = 'João Silva' WHERE id = 1;

-- Delete (Remover)
DELETE FROM users WHERE id = 1;
```

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| SQL só funciona num banco específico | SQL é padrão — funciona em qualquer banco relacional |
| Precisa aprender SQL diferente para cada engine | O core é idêntico, só detalhes menores mudam |
| SQL é só para consultas (SELECT) | SQL cria, modifica, consulta e deleta dados |

## When to apply

- Sempre que trabalhar com bancos de dados relacionais (SQLite, PostgreSQL, MySQL, SQL Server)
- Ao criar schemas, tabelas, índices
- Ao fazer queries de leitura ou escrita
- Ao migrar entre engines — reaproveite o conhecimento SQL

## Limitations

- SQL não se aplica a bancos NoSQL (MongoDB, Redis, DynamoDB)
- Cada engine tem extensões proprietárias (ex: `RETURNING` no PostgreSQL, `PRAGMA` no SQLite) que não são portáveis
- Para operações complexas de aplicação, ORMs podem abstrair o SQL mas é fundamental entender o que acontece por baixo

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Query retorna erro de sintaxe | Falta ponto e vírgula ou aspas incorretas para a engine | Confira as convenções da engine (SQLite: `;` opcional, PostgreSQL: `;` obrigatório) |
| `INSERT` falha com "NOT NULL constraint" | Coluna obrigatória não recebeu valor no INSERT | Inclua todas as colunas NOT NULL na lista de valores do INSERT |
| `DELETE` sem WHERE apagou tudo | Faltou cláusula WHERE no DELETE | Sempre adicione WHERE ao DELETE; teste com SELECT antes para confirmar quais registros serão afetados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre portabilidade SQL e analogias do instrutor
- [code-examples.md](references/code-examples.md) — Exemplos de CRUD expandidos com variações por engine