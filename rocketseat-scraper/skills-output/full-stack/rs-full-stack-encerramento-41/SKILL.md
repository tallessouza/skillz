---
name: rs-full-stack-encerramento-41
description: "Applies SQL fundamentals decision framework when writing database code. Use when user asks to 'create a table', 'write a query', 'design a schema', 'add a relationship', or 'insert/update/delete data'. Covers table creation, filtered queries, CRUD operations, and relationship types (one-to-one, one-to-many, many-to-many). Make sure to use this skill whenever working with relational databases or SQL in full-stack projects. Not for NoSQL databases, ORMs without raw SQL, or database administration/DevOps tasks."
---

# SQL Fundamentals — Decision Framework

> Ao trabalhar com banco de dados relacional, escolha a operacao e o tipo de relacionamento corretos antes de escrever qualquer SQL.

## Decision framework

| Quando voce precisa | Operacao SQL | Exemplo |
|---------------------|-------------|---------|
| Definir estrutura de dados | `CREATE TABLE` com tipos e constraints | Nova entidade no dominio |
| Buscar dados com condicoes | `SELECT ... WHERE` com filtros combinados | Listar usuarios ativos |
| Adicionar registros | `INSERT INTO ... VALUES` | Cadastrar novo usuario |
| Modificar registros existentes | `UPDATE ... SET ... WHERE` | Alterar email do usuario |
| Remover registros | `DELETE FROM ... WHERE` | Excluir conta inativa |

## Relacionamentos — Quando usar cada tipo

| Tipo | Quando aplicar | Implementacao |
|------|---------------|---------------|
| **Um para um** (1:1) | Cada registro A tem exatamente um registro B (ex: usuario ↔ perfil) | FK com `UNIQUE` na tabela dependente |
| **Um para muitos** (1:N) | Um registro A tem varios B (ex: usuario → pedidos) | FK simples na tabela "muitos" |
| **Muitos para muitos** (N:N) | Registros A e B se relacionam livremente (ex: alunos ↔ cursos) | Tabela intermediaria (junction table) com duas FKs |

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de filtro complexo | Combine `WHERE` com `AND`, `OR`, `LIKE`, `IN`, `BETWEEN` |
| Dados vem de duas tabelas | Use `JOIN` adequado ao relacionamento |
| Relacionamento N:N | Crie tabela intermediaria com PKs compostas ou separadas |
| `DELETE` ou `UPDATE` sem `WHERE` | Pare — isso afeta TODOS os registros, porque nao tem filtro |
| Duvida sobre qual relacionamento usar | Pergunte: "Um X pode ter quantos Y? E um Y pode ter quantos X?" |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `DELETE FROM users` sem `WHERE` | `DELETE FROM users WHERE id = $1` — sempre filtre |
| `UPDATE orders SET status = 'done'` sem `WHERE` | `UPDATE orders SET status = 'done' WHERE id = $1` |
| Colocar array/JSON para simular N:N | Criar tabela intermediaria com FKs e constraints |
| Ignorar constraints (`NOT NULL`, `UNIQUE`, `FK`) | Definir constraints na criacao da tabela, porque o banco valida por voce |
| Criar uma tabela gigante com tudo junto | Normalizar em tabelas separadas com relacionamentos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar cada operacao e tipo de relacionamento
- [code-examples.md](references/code-examples.md) — Exemplos de SQL para cada operacao e tipo de relacionamento