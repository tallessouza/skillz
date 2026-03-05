# Code Examples: Inner Join

## Exemplo 1: SELECT simples sem join (contexto)

```sql
-- Consultando cada tabela separadamente
SELECT * FROM students;
-- Resultado: id=1 Lucas Santos, id=2 Beatriz Lima...

SELECT * FROM student_address;
-- Resultado: student_id=1 com rua/cidade, student_id=2 com rua/cidade...
-- Problema: não sei quem é student_id=1 sem consultar outra tabela
```

## Exemplo 2: Primeira tentativa (erro de ambiguidade)

```sql
SELECT id, student_id, street, city
FROM student_address
INNER JOIN students ON students.id = student_address.student_id;
-- ERROR: column reference "id" is ambiguous
-- Causa: ambas tabelas possuem coluna "id"
```

## Exemplo 3: Corrigido com aliases

```sql
SELECT
  a.id,
  a.student_id,
  a.street,
  a.city
FROM student_address AS a
INNER JOIN students AS s ON s.id = a.student_id;
-- Funciona, mas ainda não traz dados da tabela students
```

## Exemplo 4: Trazendo colunas da outra tabela

```sql
SELECT
  a.id,
  a.student_id,
  s.name,
  a.street,
  a.city
FROM student_address AS a
INNER JOIN students AS s ON s.id = a.student_id;
-- Agora traz o nome do estudante junto com o endereço
-- Lucas Santos aparece ao lado do endereço com student_id=1
-- Beatriz Lima aparece ao lado do endereço com student_id=2
```

## Variação: Ordem diferente no FROM

```sql
-- Começando pela tabela de estudantes
SELECT
  s.id,
  s.name,
  a.street,
  a.city
FROM students AS s
INNER JOIN student_address AS a ON a.student_id = s.id;
-- Mesmo resultado, perspectiva diferente (estudante → endereço)
```

## Variação: Join com 3 tabelas

```sql
-- Exemplo hipotético: estudante + endereço + matrícula
SELECT
  s.name,
  a.city,
  e.course_name
FROM students AS s
INNER JOIN student_address AS a ON a.student_id = s.id
INNER JOIN enrollments AS e ON e.student_id = s.id;
-- Cada INNER JOIN adicional requer seu próprio ON
```

## Variação: Com filtro WHERE

```sql
SELECT
  a.id,
  s.name,
  a.city
FROM student_address AS a
INNER JOIN students AS s ON s.id = a.student_id
WHERE a.city = 'São Paulo';
-- WHERE vem depois de todos os JOINs
```