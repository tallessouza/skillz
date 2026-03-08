---
name: rs-full-stack-criando-tabela-de-cursos
description: "Generates SQL CREATE TABLE statements when user asks to 'create a table', 'define a schema', 'add a new entity', or 'set up database tables'. Applies correct column types, PRIMARY KEY, AUTO_INCREMENT, and NOT NULL constraints. Make sure to use this skill whenever generating DDL for relational databases. Not for queries (SELECT), migrations, or ORM model definitions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql-fundamentals
  tags: [sql, create-table, ddl, primary-key, auto-increment, constraints]
---

# Criando Tabelas SQL

> Ao criar tabelas, defina colunas com tipos corretos, chave primaria com auto incremento, e constraints NOT NULL para campos obrigatorios.

## Rules

1. **Toda tabela tem um ID inteiro como chave primaria** — `id INTEGER PRIMARY KEY AUTO_INCREMENT`, porque garante unicidade e geracao automatica sem intervencao manual
2. **Use AUTO_INCREMENT no ID** — o banco gera o valor sequencial automaticamente, porque evita conflitos e simplifica inserts
3. **Campos obrigatorios sao NOT NULL** — `name TEXT NOT NULL`, porque impede registros incompletos no banco
4. **Separe colunas com virgula** — exceto a ultima coluna, porque erro de sintaxe SQL e o problema mais comum em CREATE TABLE
5. **Nomeie tabelas no plural em ingles** — `courses` nao `curso`, porque segue convencao SQL padrao

## How to write

### Tabela basica com ID e nome

```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL
);
```

### Padrao para qualquer entidade

```sql
CREATE TABLE {entity_plural} (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  {column_name} {TYPE} {CONSTRAINTS}
);
```

## Example

**Before (erros comuns):**
```sql
CREATE TABLE curso (
  id INT,
  nome VARCHAR(255)
);
```

**After (com esta skill aplicada):**
```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL
);
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo identificador | `INTEGER PRIMARY KEY AUTO_INCREMENT` |
| Campo de texto obrigatorio | `TEXT NOT NULL` |
| Campo opcional | Omitir NOT NULL |
| Referencia a outra tabela | Adicionar FOREIGN KEY (skill separada) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `id INT` sem PRIMARY KEY | `id INTEGER PRIMARY KEY AUTO_INCREMENT` |
| Campo nome sem NOT NULL | `name TEXT NOT NULL` |
| Tabela sem chave primaria | Sempre definir PRIMARY KEY |
| Nome de tabela no singular | Nome no plural: `courses`, `students` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `syntax error` no CREATE TABLE | Virgula apos ultima coluna ou palavra reservada com erro | Verifique a sintaxe e remova virgula final |
| ID nao incrementa automaticamente | Falta `AUTO_INCREMENT` ou `AUTOINCREMENT` (depende do banco) | Adicione a clausula de auto incremento correta para o SGBD |
| Registros com nome nulo | Coluna sem constraint `NOT NULL` | Adicione `NOT NULL` em campos obrigatorios |
| Tabela com nome no singular causa confusao | Convencao nao seguida | Renomeie para plural: `courses`, `students` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre chaves primarias, auto incremento e constraints
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes