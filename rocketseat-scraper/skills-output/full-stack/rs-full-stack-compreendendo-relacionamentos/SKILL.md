---
name: rs-full-stack-compreendendo-relacionamentos
description: "Applies relational database relationship patterns when designing schemas or writing SQL. Use when user asks to 'create a table', 'design a schema', 'add a foreign key', 'connect tables', or 'model relationships'. Enforces primary key and foreign key conventions, naming patterns like table_name_id for FKs, and referential integrity. Make sure to use this skill whenever creating or modifying database tables that reference other tables. Not for NoSQL databases, application code, or ORM configuration."
---

# Relacionamentos em Banco de Dados Relacional

> Ao projetar tabelas, separe dados por assunto e conecte-os via chaves primarias e estrangeiras — nunca duplique dados entre tabelas.

## Key concept

Relacionamentos definem como tabelas se conectam e interagem. Cada tabela cuida de um unico assunto (pessoas, carros, livros, autores). Para conectar tabelas, use chaves primarias (PK) como identificador unico de cada registro e chaves estrangeiras (FK) como referencia a uma PK de outra tabela.

## Rules

1. **Uma tabela por assunto** — carros numa tabela, pessoas noutra, porque misturar assuntos causa redundancia e dificulta manutencao
2. **Toda tabela tem PK** — identificador unico gerado dentro da propria tabela, porque sem PK nao ha como referenciar registros
3. **FK segue o padrao `tabela_id`** — `autor_id`, `pessoa_id`, `restaurante_id`, porque esse padrao torna imediatamente claro de onde vem a referencia
4. **FK referencia PK de outra tabela** — nunca referencie colunas que nao sao PK, porque a integridade referencial depende de unicidade garantida
5. **Nunca duplique dados que pertencem a outra tabela** — use FK para conectar, porque redundancia causa inconsistencia quando um lado e atualizado e o outro nao
6. **Respeite restricoes de integridade** — o banco impede deletar um registro que tem dependentes (ex: nao deleta pessoa se tem carro vinculado), porque isso protege a consistencia dos dados

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Dois tipos de entidade no mesmo escopo | Crie tabelas separadas e conecte com FK |
| Dados repetidos em varias linhas | Extraia para tabela propria e use FK |
| Necessidade de identificar "pertence a quem" | Adicione coluna FK com padrao `tabela_id` |
| Tentativa de deletar registro referenciado | Verifique dependencias antes, trate o cascade adequadamente |

## How to think about it

### Pessoa e Carro
Uma pessoa possui um carro. Tabela `pessoas` com PK `id`, tabela `carros` com PK `id` e FK `pessoa_id`. O campo `pessoa_id` na tabela de carros identifica o dono.

### Restaurante e Pratos
Um restaurante possui varios pratos. Tabela `restaurantes` com PK `id`, tabela `pratos` com PK `id` e FK `restaurante_id`. Cada prato aponta para seu restaurante.

### Livros e Autores
Um autor escreve varios livros. Tabela `autores` com PK `id`, tabela `livros` com PK `id` e FK `autor_id`. O campo `autor_id` conecta cada livro ao seu autor.

## Example

**Errado (dados duplicados):**
```sql
CREATE TABLE livros (
  id INTEGER PRIMARY KEY,
  titulo TEXT,
  autor_nome TEXT,    -- duplicando dado do autor
  autor_email TEXT    -- duplicando dado do autor
);
```

**Correto (tabelas separadas com FK):**
```sql
CREATE TABLE autores (
  id INTEGER PRIMARY KEY,
  nome TEXT,
  email TEXT
);

CREATE TABLE livros (
  id INTEGER PRIMARY KEY,
  titulo TEXT,
  autor_id INTEGER REFERENCES autores(id)
);
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Colocar tudo numa tabela e mais simples | Gera redundancia, inconsistencia e dificulta queries |
| FK e so uma coluna normal com numero | FK tem restricao de integridade — o banco valida que o valor existe na tabela referenciada |
| Posso deletar qualquer registro livremente | Se existe FK apontando para ele, o banco bloqueia a delecao (a menos que configure CASCADE) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Repetir nome/email do autor em cada livro | Use `autor_id` FK referenciando tabela `autores` |
| Nomear FK como `fk1` ou `ref` | Use padrao `tabela_id` (`autor_id`, `pessoa_id`) |
| Criar tabela sem PK | Toda tabela deve ter `id` como PK |
| Guardar lista separada por virgula numa coluna | Crie tabela intermediaria com FKs |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes