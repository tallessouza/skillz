---
name: rs-full-stack-populando-tabela-de-cursos
description: "Applies correct INSERT INTO syntax when populating SQLite tables with multiple records. Use when user asks to 'insert data', 'populate table', 'add records', 'seed database', or 'INSERT INTO'. Enforces semicolon separation for batch inserts, string quoting, and verification with SELECT. Make sure to use this skill whenever writing SQL INSERT statements for SQLite. Not for CREATE TABLE, ALTER TABLE, or non-SQLite databases."
---

# Populando Tabelas com INSERT INTO (SQLite)

> Ao inserir registros em SQLite, use INSERT INTO com valores explícitos e verifique com SELECT após a inserção.

## Rules

1. **Sempre especifique as colunas** — `INSERT INTO cursos (nome) VALUES ('HTML')` não `INSERT INTO cursos VALUES ('HTML')`, porque colunas explícitas protegem contra mudanças de schema
2. **Strings entre aspas simples** — `'JavaScript'` não `"JavaScript"`, porque aspas simples são o padrão SQL
3. **Ponto e vírgula obrigatório entre múltiplos INSERTs** — cada INSERT termina com `;` quando há vários em sequência, porque SQLite exige separação entre statements
4. **Verifique após inserir** — execute `SELECT * FROM tabela` após batch insert para confirmar que todos os registros foram inseridos
5. **Mantenha consistência nos dados** — padronize capitalização (ex: primeira letra maiúscula) desde o início, porque inconsistência gera bugs em filtros e buscas

## How to write

### Batch INSERT com verificação

```sql
-- Inserir múltiplos registros (cada um com ;)
INSERT INTO cursos (nome) VALUES ('HTML');
INSERT INTO cursos (nome) VALUES ('CSS');
INSERT INTO cursos (nome) VALUES ('JavaScript');
INSERT INTO cursos (nome) VALUES ('TypeScript');
INSERT INTO cursos (nome) VALUES ('React');

-- Verificar inserção
SELECT * FROM cursos;
```

### INSERT múltiplo em um único statement

```sql
-- Alternativa: múltiplos VALUES em um INSERT
INSERT INTO cursos (nome) VALUES
  ('HTML'),
  ('CSS'),
  ('JavaScript'),
  ('TypeScript'),
  ('React');

SELECT * FROM cursos;
```

## Example

**Before (erros comuns):**
```sql
INSERT INTO cursos VALUES ("HTML")
INSERT INTO cursos VALUES ("CSS")
INSERT INTO cursos VALUES ("JavaScript")
```

**After (com esta skill aplicada):**
```sql
INSERT INTO cursos (nome) VALUES ('HTML');
INSERT INTO cursos (nome) VALUES ('CSS');
INSERT INTO cursos (nome) VALUES ('JavaScript');

-- Verificação: espera-se 3/3 inseridos
SELECT * FROM cursos;
```

## Heuristics

| Situação | Faça |
|----------|------|
| Inserindo 1 registro | `;` opcional mas recomendado |
| Inserindo múltiplos registros separados | `;` obrigatório entre cada INSERT |
| Após batch insert | Sempre rode SELECT para confirmar contagem |
| Dados com texto | Aspas simples, capitalização consistente |
| Executando parcial no editor | Selecione apenas a linha desejada para não re-inserir |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `INSERT INTO t VALUES ('x')` sem colunas | `INSERT INTO t (coluna) VALUES ('x')` |
| Strings com aspas duplas `"texto"` | Aspas simples `'texto'` |
| Múltiplos INSERTs sem `;` | Cada INSERT termina com `;` |
| Inserir sem verificar | Sempre `SELECT * FROM t` após inserção |
| Capitalização inconsistente nos dados | Padronizar desde o primeiro registro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separadores, aspas e verificação
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações