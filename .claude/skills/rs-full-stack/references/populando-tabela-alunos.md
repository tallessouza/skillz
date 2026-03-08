---
name: rs-full-stack-populando-tabela-alunos
description: "Generates SQL INSERT INTO statements to populate database tables with sample data. Use when user asks to 'insert data', 'populate table', 'add sample records', 'seed database', or 'create test data' in SQL. Applies correct INSERT INTO syntax with VALUES, semicolon-separated multiple inserts, and SELECT verification. Make sure to use this skill whenever generating SQL insert statements or seeding tables. Not for CREATE TABLE, ALTER TABLE, or schema design tasks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql-fundamentals
  tags:
    - sql
    - insert
    - database
    - seed
---

# Populando Tabelas com INSERT INTO

> Ao inserir dados em tabelas SQL, use INSERT INTO com colunas explícitas, um statement por registro, e sempre verifique com SELECT após inserção.

## Rules

1. **Sempre especifique as colunas no INSERT** — `INSERT INTO students (name)` não `INSERT INTO students`, porque colunas explícitas protegem contra mudanças de schema
2. **Um INSERT por registro com ponto e vírgula** — cada statement termina com `;`, porque múltiplos inserts separados são mais legíveis e debugáveis que INSERT com múltiplos VALUES
3. **Use strings entre aspas simples** — `'Lucas Santos'` não `"Lucas Santos"`, porque SQL padrão usa aspas simples para valores texto
4. **Verifique após inserção** — sempre execute `SELECT * FROM tabela` após inserts, porque confirma visualmente que os dados foram inseridos corretamente
5. **Colunas auto-incremento são omitidas** — não inclua `id` no INSERT quando é auto-increment, porque o banco gera automaticamente

## How to write

### INSERT básico (uma coluna)

```sql
INSERT INTO students (name) VALUES ('Lucas Santos');
INSERT INTO students (name) VALUES ('Beatriz Lima');
INSERT INTO students (name) VALUES ('Gabriel Oliveira');
```

### INSERT com múltiplas colunas

```sql
INSERT INTO students (name, email) VALUES ('Lucas Santos', 'lucas@email.com');
INSERT INTO students (name, email) VALUES ('Beatriz Lima', 'beatriz@email.com');
```

### Verificação após inserção

```sql
SELECT * FROM students;
```

## Example

**Before (erros comuns):**

```sql
INSERT INTO students VALUES ('Lucas Santos')
INSERT INTO students VALUES ('Beatriz Lima')
```

**After (com esta skill aplicada):**

```sql
INSERT INTO students (name) VALUES ('Lucas Santos');
INSERT INTO students (name) VALUES ('Beatriz Lima');
INSERT INTO students (name) VALUES ('Gabriel Oliveira');
INSERT INTO students (name) VALUES ('Mariana Costa');
INSERT INTO students (name) VALUES ('Felipe Souza');

-- Verificar dados inseridos
SELECT * FROM students;
```

## Heuristics

| Situação | Faça |
|----------|------|
| Populando tabela para testes | Crie 5-10 registros com nomes realistas |
| Coluna tem auto-increment (id) | Omita do INSERT, deixe o banco gerar |
| Inserindo muitos registros de uma vez | Um INSERT por linha, todos com `;` |
| Após qualquer batch de inserts | Execute `SELECT * FROM tabela` para confirmar |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `INSERT INTO students VALUES (...)` | `INSERT INTO students (name) VALUES (...)` |
| INSERT sem `;` no final | Sempre termine com `;` |
| Inserir sem verificar depois | Adicione `SELECT * FROM tabela` após inserts |
| Incluir id auto-increment no INSERT | Omita colunas auto-geradas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre INSERT INTO e boas práticas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Erro "table has N columns but M values were supplied" | INSERT sem colunas explicitas e quantidade de valores diferente | Sempre especifique as colunas: `INSERT INTO t (col) VALUES (...)` |
| Registros duplicados apos rodar script novamente | Script de seed sem verificacao de existencia | Adicione `DELETE FROM tabela` antes dos INSERTs ou use `INSERT OR IGNORE` |
| Erro de tipo no valor inserido | String sem aspas simples ou numero com aspas | Strings usam aspas simples `'texto'`, numeros sem aspas |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-populando-tabela-alunos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-populando-tabela-alunos/references/code-examples.md)
