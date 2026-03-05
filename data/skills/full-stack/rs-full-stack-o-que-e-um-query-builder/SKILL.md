---
name: rs-full-stack-o-que-e-um-query-builder
description: "Applies Query Builder concepts when choosing between raw SQL and query builders in Node.js/TypeScript projects. Use when user asks to 'connect to database', 'write a query', 'setup Knex', 'configure database layer', or 'choose between SQL and ORM'. Explains abstraction benefits, database portability, and readability gains. Make sure to use this skill whenever discussing database access patterns or setting up a data layer. Not for ORM-specific patterns (Prisma, TypeORM), raw SQL optimization, or database administration."
---

# Query Builder

> Use Query Builders para construir instrucoes SQL atraves de metodos, abstraindo diferencas entre bancos de dados.

## Key concept

Um Query Builder e uma camada de abstracao que permite construir instrucoes SQL usando metodos em vez de escrever SQL diretamente. Ele conhece o banco de dados de destino (Postgres, MySQL, SQLite) e gera o SQL apropriado para cada um, porque embora todos usem SQL como linguagem padrao, existem diferencas sutis entre eles (ponto e virgula obrigatorio, palavras reservadas diferentes, sintaxe especifica).

A responsabilidade de lidar com essas diferencas fica com o Query Builder, nao com o desenvolvedor.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Projeto que pode mudar de banco no futuro | Query Builder — portabilidade sem reescrita |
| Queries simples (CRUD basico) | Query Builder — legibilidade superior ao SQL cru |
| Queries muito complexas com features especificas do banco | SQL cru pode ser mais apropriado |
| Necessidade de legibilidade para o time | Query Builder — metodos encadeados sao mais legiveis |
| Prototipacao rapida com SQLite local e Postgres em producao | Query Builder — mesma API, SQL diferente gerado |

## How to think about it

### A abstracao do Query Builder

```
Seu codigo → .select() .where() .insert()
                        │
                   Query Builder
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
          Postgres    MySQL     SQLite
         (SQL gerado especifico para cada banco)
```

Voce nao precisa saber o SQL exato que sera gerado. Usa metodos (selecionar, inserir, atualizar, deletar) e o Query Builder gera o SQL correto para o banco configurado.

### Quando NAO usar Query Builder

- Migrations muito especificas do banco (partitioning, extensions)
- Queries com CTEs recursivas complexas ou window functions avancadas
- Otimizacao de performance onde voce precisa controle total do SQL

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Query Builder substitui saber SQL | Entender SQL continua importante — o Query Builder abstrai, nao elimina |
| Query Builder e o mesmo que ORM | ORM mapeia objetos para tabelas; Query Builder apenas constroi SQL |
| SQL gerado e sempre identico entre bancos | Cada banco pode receber SQL ligeiramente diferente do mesmo metodo |
| Query Builder e mais lento que SQL cru | O overhead e negligivel — a query executada no banco e SQL nativo |

## When to apply

- Ao iniciar a camada de acesso a dados de um projeto Node.js/TypeScript
- Ao decidir entre Knex (Query Builder) vs Prisma/TypeORM (ORM) vs SQL cru
- Ao migrar um projeto de um banco para outro
- Ao buscar legibilidade em operacoes de banco sem a complexidade de um ORM completo

## Limitations

- Nao oferece mapeamento objeto-relacional (para isso, use um ORM)
- Features muito especificas de um banco podem nao ter suporte
- Para queries extremamente complexas, SQL cru pode ser mais expressivo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes