---
name: rs-full-stack-sqlite-sequence
description: "Documents the sqlite_sequence internal table and its role in SQLite auto-increment tracking. Use when user asks about 'sqlite_sequence', 'auto increment sequence', 'last inserted id in SQLite', 'how SQLite tracks IDs', or 'internal SQLite tables'. Make sure to use this skill whenever working with SQLite auto-increment columns or debugging ID sequence issues. Not for PostgreSQL sequences, MySQL auto_increment, or general primary key design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [sqlite, database, auto-increment, sql]
---

# Tabela sqlite_sequence no SQLite

> Consulte a tabela `sqlite_sequence` para entender e verificar o estado do auto-incremento em qualquer tabela SQLite.

## Key concepts

O SQLite cria automaticamente uma tabela interna chamada `sqlite_sequence` quando qualquer tabela usa `AUTOINCREMENT` em uma coluna. Essa tabela armazena o nome de cada tabela e o ultimo valor de sequencia atribuido, permitindo ao SQLite saber qual sera o proximo ID.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Precisa saber o ultimo ID gerado | `SELECT * FROM sqlite_sequence WHERE name = 'tabela'` |
| Tabela `sqlite_sequence` aparece no banco | Nao delete — e interna e gerenciada pelo SQLite |
| Auto-increment nao esta gerando IDs esperados | Consulte `sqlite_sequence` para verificar o estado atual |
| Precisa resetar a sequencia | `UPDATE sqlite_sequence SET seq = 0 WHERE name = 'tabela'` |

## How to query

```sql
-- Ver todas as sequencias de todas as tabelas
SELECT * FROM sqlite_sequence;

-- Resultado exemplo:
-- name     | seq
-- products | 2

-- Verificar sequencia de uma tabela especifica
SELECT seq FROM sqlite_sequence WHERE name = 'products';
```

## How to think about it

### Analogia: contador com memoria

A `sqlite_sequence` funciona como um contador que o SQLite consulta antes de inserir um novo registro. Ele olha: "qual foi o ultimo numero que dei pra essa tabela?" e incrementa a partir dali. Sem essa tabela, o SQLite nao saberia de onde continuar.

### Estrutura da tabela

| Coluna | Tipo | Conteudo |
|--------|------|----------|
| `name` | TEXT | Nome da tabela que possui AUTOINCREMENT |
| `seq`  | INTEGER | Ultimo valor de sequencia atribuido |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| `sqlite_sequence` e criada manualmente | E criada automaticamente ao usar AUTOINCREMENT |
| Toda tabela com INTEGER PRIMARY KEY aparece nela | Apenas tabelas com a keyword `AUTOINCREMENT` explicita |
| Deletar registros da tabela reseta os IDs | Os IDs continuam de onde pararam (o seq na sqlite_sequence nao muda ao deletar rows) |
| Posso deletar a `sqlite_sequence` com seguranca | Nao — o SQLite a recriara, mas pode causar comportamento inesperado |

## When to apply

- Debugging de IDs duplicados ou gaps em sequencias
- Verificacao do estado do banco apos migracoes
- Entendimento de tabelas internas ao explorar um banco SQLite existente
- Reset de sequencias em ambiente de desenvolvimento/teste

## Limitations

- Existe apenas no SQLite — PostgreSQL usa `sequences`, MySQL usa `auto_increment` counter diferente
- Apenas tabelas com `AUTOINCREMENT` explicito geram entrada na `sqlite_sequence`
- Tabelas com `INTEGER PRIMARY KEY` sem `AUTOINCREMENT` usam o rowid interno e NAO aparecem na `sqlite_sequence`


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| IDs com gaps apos deletar registros | AUTOINCREMENT nao reutiliza IDs deletados | Comportamento esperado — sqlite_sequence mantem o ultimo valor usado |
| sqlite_sequence nao existe no banco | Nenhuma tabela usa AUTOINCREMENT explicito | Use INTEGER PRIMARY KEY AUTOINCREMENT para criar a tabela interna |
| Reset de sequencia nao funciona | Sintaxe incorreta no UPDATE | Use `UPDATE sqlite_sequence SET seq = 0 WHERE name = 'tabela'` |
| Confusao entre rowid e AUTOINCREMENT | INTEGER PRIMARY KEY sem AUTOINCREMENT usa rowid | Adicione AUTOINCREMENT explicitamente se precisa de sequencia garantida |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre auto-increment vs rowid e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos de consulta, reset e verificacao da sqlite_sequence