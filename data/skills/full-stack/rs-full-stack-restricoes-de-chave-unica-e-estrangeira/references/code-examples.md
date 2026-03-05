# Code Examples: Restricoes de Chave Unica e Estrangeira

## Setup: Tabela de estudantes (contexto)

```sql
-- Tabela pai (ja existente na aula)
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

-- 10 estudantes inseridos (ids 1 a 10)
```

## Criacao da tabela com FK + UNIQUE (relacionamento 1:1)

```sql
CREATE TABLE student_address (
  id SERIAL PRIMARY KEY,
  student_id INTEGER UNIQUE REFERENCES students(id),
  street VARCHAR(255),
  city VARCHAR(255)
);
```

**Decomposicao:**
- `SERIAL PRIMARY KEY` — id auto-incremento
- `INTEGER` — tipo compativel com students.id
- `UNIQUE` — impoe unicidade (1:1)
- `REFERENCES students(id)` — foreign key para students

## Teste 1: Insert com FK invalida

```sql
-- Estudante 15 NAO existe
INSERT INTO student_address (student_id, street, city)
VALUES (15, 'Rua Sao Joao', 'Sao Paulo');

-- Resultado: ERROR
-- foreign key constraint violation
-- Motivo: nao existe registro com id=15 em students
```

## Teste 2: Insert com FK valida

```sql
-- Estudante 1 existe
INSERT INTO student_address (student_id, street, city)
VALUES (1, 'Rua Sao Joao', 'Sao Paulo');

-- Resultado: sucesso
-- student_address agora tem: id=1, student_id=1, street='Rua Sao Joao', city='Sao Paulo'
```

## Teste 3: Insert violando UNIQUE

```sql
-- Estudante 1 JA tem endereco
INSERT INTO student_address (student_id, street, city)
VALUES (1, 'Rua Dom Pedro', 'Rio de Janeiro');

-- Resultado: ERROR
-- unique constraint on student_address.student_id
-- Motivo: ja existe registro com student_id=1
```

## Teste 4: Insert para outro estudante (sucesso)

```sql
-- Estudante 2 NAO tem endereco ainda
INSERT INTO student_address (student_id, street, city)
VALUES (2, 'Rua Dom Pedro', 'Rio de Janeiro');

-- Resultado: sucesso
-- student_address agora tem 2 registros:
-- id=1, student_id=1, street='Rua Sao Joao', city='Sao Paulo'
-- id=2, student_id=2, street='Rua Dom Pedro', city='Rio de Janeiro'
```

## Verificacao dos dados

```sql
-- Ver todos os enderecos
SELECT * FROM student_address;

-- Ver endereco com nome do estudante (JOIN)
SELECT s.name, sa.street, sa.city
FROM students s
JOIN student_address sa ON s.id = sa.student_id;
```

## Variacoes: 1:1 vs 1:N

```sql
-- 1:1 (com UNIQUE)
CREATE TABLE student_address_one_to_one (
  id SERIAL PRIMARY KEY,
  student_id INTEGER UNIQUE REFERENCES students(id),
  street VARCHAR(255),
  city VARCHAR(255)
);

-- 1:N (sem UNIQUE) — um estudante pode ter VARIOS enderecos
CREATE TABLE student_address_one_to_many (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  street VARCHAR(255),
  city VARCHAR(255)
);
```

## Variacao: ON DELETE CASCADE

```sql
CREATE TABLE student_address (
  id SERIAL PRIMARY KEY,
  student_id INTEGER UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  street VARCHAR(255),
  city VARCHAR(255)
);

-- Se deletar o estudante, o endereco e deletado automaticamente
DELETE FROM students WHERE id = 1;
-- student_address com student_id=1 tambem e removido
```

## Variacao: ON DELETE SET NULL

```sql
CREATE TABLE student_address (
  id SERIAL PRIMARY KEY,
  student_id INTEGER UNIQUE REFERENCES students(id) ON DELETE SET NULL,
  street VARCHAR(255),
  city VARCHAR(255)
);

-- Se deletar o estudante, student_id vira NULL (endereco orfao intencional)
DELETE FROM students WHERE id = 1;
-- student_address: id=1, student_id=NULL, street='Rua Sao Joao', city='Sao Paulo'
```