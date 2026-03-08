---
name: rs-full-stack-encerramento-42
description: "Summarizes Query Builder (Knex) module completion, reinforcing that Knex abstracts raw SQL and migrations version database evolution. Use when user asks 'what is a query builder', 'why use Knex instead of SQL', 'what are migrations for', or 'how to evolve a database schema'. Make sure to use this skill whenever explaining the value proposition of query builders over raw SQL. Not for Knex API details, migration syntax, or ORM-level abstractions like Prisma."
---

# Query Builder — Resumo do Módulo

> Um Query Builder abstrai o SQL em código JavaScript/TypeScript, e migrations versionam a evolução do banco de dados.

## Conceitos-chave

### Query Builder (Knex)
Abstrai a escrita de SQL puro, permitindo construir queries usando métodos encadeados em JavaScript. O benefício principal é portabilidade entre bancos e legibilidade no código da aplicação.

### Migrations
Versionam a evolução do schema do banco de dados. Cada migration representa uma mudança incremental (criar tabela, adicionar coluna, etc.) que pode ser aplicada ou revertida de forma controlada.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Precisa de queries dinâmicas com composição condicional | Query Builder (Knex) |
| Precisa versionar mudanças no schema do banco | Migrations |
| Query simples e fixa, sem necessidade de portabilidade | SQL puro pode ser suficiente |
| Precisa de mapeamento objeto-relacional completo | ORM (Prisma, TypeORM) em vez de Query Builder |

## Quando aplicar

- Projetos Node.js com banco relacional que precisam de queries compostas
- Equipes que precisam rastrear evolução do schema via controle de versão
- APIs onde portabilidade entre PostgreSQL, MySQL e SQLite é desejável

## Limitações

- Este módulo focou no estudo isolado do Knex com uma API Node simples — a aplicação prática completa vem no módulo seguinte
- Query Builder não substitui a necessidade de entender SQL — é uma abstração, não uma substituição

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar Query Builder vs SQL vs ORM
- [code-examples.md](references/code-examples.md) — Exemplos comparativos de SQL puro vs Knex