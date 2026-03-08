---
name: rs-full-stack-encerramento-41
description: "Applies SQL fundamentals decision framework when writing database code. Use when user asks to 'create a table', 'write a query', 'design a schema', 'add a relationship', or 'insert/update/delete data'. Covers table creation, filtered queries, CRUD operations, and relationship types (one-to-one, one-to-many, many-to-many). Make sure to use this skill whenever working with relational databases or SQL in full-stack projects. Not for NoSQL databases, ORMs without raw SQL, or database administration/DevOps tasks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql
  tags: [sql, banco-de-dados, crud, relacionamentos, queries]
---

# SQL Fundamentals — Decision Framework

> Ao trabalhar com banco de dados relacional, escolha a operacao e o tipo de relacionamento corretos antes de escrever qualquer SQL.

## Key concepts

- SQL e a linguagem padrao para interagir com bancos de dados relacionais
- CRUD (Create, Read, Update, Delete) forma a base de todas as operacoes
- Relacionamentos (1:1, 1:N, N:N) definem como as tabelas se conectam
- Constraints (NOT NULL, UNIQUE, FK) garantem integridade dos dados

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

## Example

```sql
-- Criar tabela com constraints
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

-- Inserir registro
INSERT INTO users (name, email) VALUES ('Diego', 'diego@example.com');

-- Buscar com filtro
SELECT * FROM users WHERE email LIKE '%@example.com';
```

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

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| DELETE sem WHERE apagou todos os registros | Faltou filtro na query DELETE | SEMPRE use WHERE em DELETE e UPDATE — faca backup antes |
| Foreign key constraint violation | Tentou inserir FK que nao existe na tabela pai | Insira primeiro na tabela pai, depois na tabela filha |
| JOIN retorna linhas duplicadas | Relacionamento N:N sem tabela intermediaria | Crie junction table com FKs e use JOIN corretamente |
| Coluna ambigua em query com JOIN | Mesmo nome de coluna em tabelas diferentes | Qualifique com alias: tabela.coluna |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar cada operacao e tipo de relacionamento
- [code-examples.md](references/code-examples.md) — Exemplos de SQL para cada operacao e tipo de relacionamento