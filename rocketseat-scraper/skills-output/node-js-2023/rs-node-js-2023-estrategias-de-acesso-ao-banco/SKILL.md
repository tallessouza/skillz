---
name: rs-node-js-2023-estrategias-acesso-banco
description: "Applies database access strategy selection (native drivers, query builders, ORMs) when architecting Node.js backend data layers. Use when user asks to 'connect to database', 'choose between knex and prisma', 'setup database', 'pick a database strategy', or 'add database to node app'. Guides abstraction level choice based on project phase and complexity. Make sure to use this skill whenever the user is deciding how to interact with a database in Node.js. Not for SQL query writing, schema design, or migration execution."
---

# Estrategias de Acesso ao Banco de Dados

> Escolha o nivel de abstracao do banco baseado na fase do projeto e na experiencia do time — driver nativo, query builder ou ORM.

## Regra fundamental

Priorize bancos relacionais (SQL) sobre NoSQL, porque bancos relacionais cobrem 90% dos casos reais de aplicacoes Node.js. NoSQL resolve problemas especificos — so adote quando souber exatamente qual problema esta resolvendo.

## Os 3 niveis de abstracao

### 1. Driver Nativo (mysql2, pg, better-sqlite3)

```typescript
// Voce escreve SQL cru — controle total, zero abstracao
const [rows] = await connection.execute(
  'SELECT * FROM users WHERE first_name = ?',
  ['test']
)
```

**Quando usar:** quando precisa de controle total sobre queries, performance critica, ou operacoes SQL muito especificas que abstracooes nao suportam.

### 2. Query Builder (Knex.js)

```typescript
// JavaScript que gera SQL — abstracao media
const users = await knex('users')
  .where({ first_name: 'test', last_name: 'user' })
  .select('id')
// Gera: SELECT id FROM users WHERE first_name = 'test' AND last_name = 'user'
```

**Quando usar:** primeiro projeto com banco, aprendizado, ou quando quer portabilidade entre bancos sem perder proximidade com SQL. Melhor custo-beneficio para aprender.

### 3. ORM (Prisma, TypeORM, Sequelize)

```typescript
// Sintaxe da linguagem — quase zero SQL
const users = await prisma.user.findMany({
  where: { firstName: 'test' },
  select: { id: true }
})
```

**Quando usar:** projetos maduros, times grandes, quando produtividade importa mais que controle fino de queries.

## Decision framework

| Situacao | Escolha | Porque |
|----------|---------|--------|
| Primeiro contato com banco no Node | Query Builder (Knex) | Equilibra aprendizado SQL com produtividade |
| Precisa trocar de banco facilmente | Query Builder ou ORM | Mesma sintaxe para MySQL, Postgres, SQLite etc |
| Performance critica em queries especificas | Driver nativo | Zero overhead de abstracao |
| Projeto em producao com time grande | ORM | Produtividade e padronizacao |
| Ambiente de desenvolvimento/prototipo | SQLite + Query Builder | Zero instalacao, arquivo local |

## Portabilidade: a vantagem oculta

Knex suporta MySQL, MariaDB, Postgres, CockroachDB, Redshift, SQLite, MSSQL, Oracle. Trocar de banco = trocar a URL de conexao. Zero mudanca no codigo da aplicacao.

## SQLite para desenvolvimento

Use SQLite em desenvolvimento porque:
- Dados salvos em arquivo fisico no projeto — sem instalar nada
- Sem Docker, sem servidor de banco rodando
- Queries quase identicas a MySQL/Postgres
- Migrar para outro banco relacional depois exige mudancas minimas

## Anti-patterns

| Erro comum | Faca isso |
|------------|-----------|
| Comecar por NoSQL (MongoDB) sem necessidade | Comece por banco relacional — cobre 99% dos casos |
| Usar driver nativo em projeto simples | Use query builder — mais produtivo, mesma portabilidade |
| Escolher ORM sem entender SQL basico | Aprenda SQL via query builder primeiro, ORM depois |
| Instalar Postgres/MySQL local para aprender | Use SQLite — zero fricao para primeiros passos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
