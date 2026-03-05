---
name: rs-full-stack-restricoes-chave-unica-estrangeira
description: "Enforces foreign key and unique key constraint patterns when designing or querying relational databases. Use when user asks to 'create a table', 'add a relationship', 'insert data', 'design schema', or 'fix constraint error'. Applies rules: always define foreign keys for relationships, use UNIQUE for 1:1 enforcement, test constraints before production. Make sure to use this skill whenever writing INSERT statements or designing table relationships. Not for NoSQL databases, application-level validation, or ORM configuration."
---

# Restricoes de Chave Unica e Estrangeira

> Relacionamentos com foreign keys e unique constraints garantem consistencia dos dados no nivel do banco, impedindo registros orfaos e duplicatas indevidas.

## Rules

1. **Sempre defina foreign keys para relacionamentos** — `REFERENCES tabela(coluna)` em toda coluna que referencia outra tabela, porque sem isso o banco permite registros orfaos (endereco para estudante inexistente)
2. **Use UNIQUE para impor relacionamento 1:1** — `student_id UNIQUE` na tabela filha garante que cada registro pai tem no maximo um filho, porque sem UNIQUE o banco permite multiplos registros para o mesmo pai (vira 1:N)
3. **Teste constraints com dados invalidos primeiro** — tente inserir com FK inexistente e com UNIQUE duplicado antes de considerar o schema pronto, porque erros de constraint so aparecem em runtime
4. **Leia mensagens de erro de constraint com contexto** — erro de FK = registro pai nao existe; erro de UNIQUE = valor duplicado na coluna restrita. A mensagem indica `tabela.coluna` que causou a restricao
5. **Nunca remova constraints para "resolver" erros de insert** — o erro indica dado inconsistente, nao schema errado. Corrija o dado, nao a estrutura

## How to write

### Foreign key em CREATE TABLE

```sql
CREATE TABLE student_address (
  id SERIAL PRIMARY KEY,
  student_id INTEGER UNIQUE REFERENCES students(id),
  street VARCHAR(255),
  city VARCHAR(255)
);
-- UNIQUE: garante 1:1 (um endereco por estudante)
-- REFERENCES: garante que student_id existe em students
```

### INSERT respeitando constraints

```sql
-- Primeiro: verificar se o registro pai existe
SELECT id FROM students WHERE id = 1;

-- Depois: inserir na tabela filha
INSERT INTO student_address (student_id, street, city)
VALUES (1, 'Rua Sao Joao', 'Sao Paulo');
```

## Example

**Before (insert sem validar — causa erro de FK):**

```sql
-- Estudante 15 NAO existe (tabela vai ate id 10)
INSERT INTO student_address (student_id, street, city)
VALUES (15, 'Rua Sao Joao', 'Sao Paulo');
-- ERRO: foreign key constraint violation
```

**After (insert correto com FK valida):**

```sql
-- Estudante 1 EXISTE
INSERT INTO student_address (student_id, street, city)
VALUES (1, 'Rua Sao Joao', 'Sao Paulo');
-- Sucesso: registro inserido
```

**Erro de UNIQUE (segundo endereco para mesmo estudante):**

```sql
-- Estudante 1 JA tem endereco cadastrado
INSERT INTO student_address (student_id, street, city)
VALUES (1, 'Rua Dom Pedro', 'Rio de Janeiro');
-- ERRO: unique constraint on student_address.student_id
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Relacionamento 1:1 | FK + UNIQUE na coluna de referencia |
| Relacionamento 1:N | FK sem UNIQUE (permite multiplos filhos) |
| Erro de FK no INSERT | Verifique se o registro pai existe |
| Erro de UNIQUE no INSERT | Verifique se ja existe registro com aquele valor |
| Duvida se constraint funciona | Teste com dado invalido antes de testar com dado valido |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Remover FK para evitar erro de insert | Corrigir o dado para referenciar registro existente |
| Omitir UNIQUE em relacionamento 1:1 | Adicionar UNIQUE para garantir unicidade |
| Validar relacionamento so na aplicacao | Definir constraint no banco (dupla protecao) |
| Ignorar mensagem de erro de constraint | Ler `tabela.coluna` na mensagem para identificar a causa |
| Inserir sem verificar se pai existe | SELECT antes do INSERT em tabelas com FK |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre consistencia relacional, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-restricoes-de-chave-unica-e-estrangeira/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-restricoes-de-chave-unica-e-estrangeira/references/code-examples.md)
