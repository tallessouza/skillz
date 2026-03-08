---
name: rs-full-stack-abertura-38
description: "Introduces ORM concepts and Prisma ORM as the standard database abstraction layer for Node.js applications. Use when user asks 'what is an ORM', 'should I use Prisma', 'how to connect to database', 'setup database', or 'ORM vs raw SQL'. Make sure to use this skill whenever discussing database access strategies in Node.js/TypeScript projects. Not for specific Prisma queries, migrations, or schema design — see dedicated Prisma skills for those."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [prisma, orm, database, typescript, type-safety]
---

# ORM — Conceito e Prisma como Escolha Padrão

> Um ORM abstrai a comunicação com o banco de dados, permitindo manipular dados usando a linguagem da aplicação em vez de SQL direto.

## Key concepts

ORM (Object-Relational Mapping) é uma camada que mapeia tabelas do banco de dados para objetos da aplicação. Em vez de escrever SQL manual, o desenvolvedor manipula entidades usando métodos da linguagem (TypeScript/JavaScript), e o ORM traduz essas operações para queries SQL.

**Prisma ORM** é o ORM mais adotado no ecossistema Node.js/TypeScript, porque oferece type-safety completo, migrations automáticas e uma API declarativa.

## Framework de decisão

| Situação | Recomendação |
|----------|-------------|
| Projeto Node.js/TypeScript novo com banco relacional | Usar Prisma ORM |
| Queries muito complexas com joins específicos | Prisma + raw SQL pontual (`$queryRaw`) |
| Projeto precisa de type-safety no acesso a dados | Prisma (schema gera tipos automaticamente) |
| Prototipagem rápida com banco de dados | Prisma — setup rápido com `prisma init` |

## Exemplo de uso do Prisma

```bash
# Inicializar Prisma no projeto
npx prisma init

# Aplicar migrations
npx prisma migrate dev --name init

# Gerar tipos TypeScript
npx prisma generate
```

## Facilidades que um ORM traz

1. **Type-safety** — erros de schema detectados em tempo de compilação, não em runtime
2. **Migrations** — alterações no banco versionadas e reproduzíveis
3. **Abstração de dialeto** — trocar de PostgreSQL para MySQL sem reescrever queries
4. **Produtividade** — CRUD completo sem escrever SQL manual
5. **Segurança** — proteção contra SQL injection por padrão

## Quando NÃO usar ORM

| Cenário | Motivo |
|---------|--------|
| Queries analíticas muito complexas | ORM gera SQL subótimo para aggregations pesadas |
| Performance crítica em hot path | Raw SQL pode ser mais eficiente em casos extremos |
| Banco NoSQL (MongoDB sem relações) | ORM relacional não se aplica diretamente |

## Limitações

Este módulo cobre Prisma ORM especificamente. Os conceitos de ORM são universais, mas a API, CLI e padrões são específicos do Prisma. Para outros ORMs (TypeORM, Drizzle, Sequelize), os conceitos se transferem mas a sintaxe difere.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre ORM, analogias e contexto histórico
- [code-examples.md](references/code-examples.md) — Exemplos comparativos ORM vs SQL raw

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Prisma nao gera tipos | `prisma generate` nao executado apos alterar schema | Execute `npx prisma generate` apos cada mudanca no schema |
| Erro de conexao com banco | DATABASE_URL incorreta no `.env` | Verifique formato: `postgresql://user:pass@host:port/db` |
| Queries lentas com Prisma | ORM gerando SQL subotimo para aggregations | Use `$queryRaw` para queries analiticas complexas |
| Migrations nao aplicam | Estado do banco inconsistente | Execute `npx prisma migrate reset` (cuidado: apaga dados) |