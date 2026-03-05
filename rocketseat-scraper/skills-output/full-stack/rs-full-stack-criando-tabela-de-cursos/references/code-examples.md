# Code Examples: Criando Tabelas SQL

## Exemplo da aula — Tabela de cursos

```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL
);
```

**Resultado:** Tabela com duas colunas — `id` (gerado automaticamente) e `name` (obrigatorio).

## Variacao 1 — Tabela com mais colunas

```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  duration_in_hours INTEGER NOT NULL
);
```

**Nota:** `description` sem NOT NULL porque e opcional. `duration_in_hours` inclui unidade no nome (boa pratica de nomenclatura).

## Variacao 2 — Sintaxe MySQL explicita

```sql
CREATE TABLE courses (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
```

**Nota:** MySQL permite declarar PRIMARY KEY separadamente. VARCHAR(255) em vez de TEXT quando ha limite de tamanho.

## Variacao 3 — PostgreSQL com SERIAL

```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);
```

**Nota:** `SERIAL` no PostgreSQL equivale a `INTEGER AUTO_INCREMENT`.

## Variacao 4 — PostgreSQL moderno com GENERATED

```sql
CREATE TABLE courses (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);
```

**Nota:** Forma mais moderna e recomendada no PostgreSQL 10+.

## Padrao completo — Tabela com timestamps

```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Nota:** Adicionar timestamps e pratica comum em tabelas de producao.

## INSERT apos criar a tabela

```sql
-- ID e gerado automaticamente, nao precisa informar
INSERT INTO courses (name) VALUES ('Full Stack');
INSERT INTO courses (name) VALUES ('Backend com Node.js');
INSERT INTO courses (name) VALUES ('Frontend com React');
```

**Resultado:**
| id | name |
|----|------|
| 1 | Full Stack |
| 2 | Backend com Node.js |
| 3 | Frontend com React |