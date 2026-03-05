# Code Examples: Select em Muitos para Muitos

## Exemplo 1: Query basica na junction table

```sql
-- Ponto de partida: apenas dados da junction
SELECT sc.id, sc.student_id, sc.course_id
FROM students_courses sc;
```

**Resultado esperado:**
| id | student_id | course_id |
|----|-----------|-----------|
| 1  | 1         | 2         |
| 2  | 2         | 1         |
| 3  | 1         | 1         |

## Exemplo 2: Primeiro INNER JOIN (students)

```sql
-- Adiciona nome do estudante
SELECT
  sc.id,
  sc.student_id,
  sc.course_id,
  s.name
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id;
```

## Exemplo 3: Segundo INNER JOIN (courses)

```sql
-- Adiciona nome do curso (nota: duas colunas "name")
SELECT
  sc.id,
  sc.student_id,
  sc.course_id,
  s.name,
  c.name
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id
INNER JOIN courses c ON c.id = sc.course_id;
```

**Problema:** Duas colunas `name` no resultado — ambiguo para o frontend.

## Exemplo 4: Com aliases nas colunas (versao final)

```sql
SELECT
  sc.id,
  s.name AS student_name,
  c.name AS course_name
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id
INNER JOIN courses c ON c.id = sc.course_id;
```

**Resultado esperado:**
| id | student_name | course_name |
|----|-------------|-------------|
| 1  | Ana         | JavaScript  |
| 2  | Pedro       | SQL         |
| 3  | Ana         | SQL         |

## Exemplo 5: Com aspas no alias (funciona mas desnecessario)

```sql
-- Funciona, mas sem aspas e mais limpo
SELECT
  s.name AS "student_name",
  c.name AS "course_name"
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id
INNER JOIN courses c ON c.id = sc.course_id;
```

O instrutor mostra que tanto com aspas quanto sem aspas funciona. Prefira sem aspas quando o alias nao tem espacos.

## Variacao: M:N com campos adicionais na junction

```sql
-- Junction tables frequentemente tem campos extras (enrolled_at, grade, etc.)
SELECT
  s.name AS student_name,
  c.name AS course_name,
  sc.enrolled_at,
  sc.grade
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id
INNER JOIN courses c ON c.id = sc.course_id
ORDER BY sc.enrolled_at DESC;
```

## Variacao: Filtrar por estudante especifico

```sql
SELECT
  s.name AS student_name,
  c.name AS course_name
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id
INNER JOIN courses c ON c.id = sc.course_id
WHERE s.id = 1;
```

## Variacao: Contar cursos por estudante

```sql
SELECT
  s.name AS student_name,
  COUNT(c.id) AS total_courses
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id
INNER JOIN courses c ON c.id = sc.course_id
GROUP BY s.id, s.name;
```

## Variacao: Outro dominio (products <-> categories)

```sql
-- Mesmo padrao, dominio diferente
SELECT
  p.title AS product_title,
  cat.name AS category_name
FROM products_categories pc
INNER JOIN products p ON p.id = pc.product_id
INNER JOIN categories cat ON cat.id = pc.category_id;
```

## Anti-pattern: SELECT * em M:N

```sql
-- RUIM: retorna todas as colunas de 3 tabelas, nomes duplicados
SELECT *
FROM students_courses
INNER JOIN students ON students.id = students_courses.student_id
INNER JOIN courses ON courses.id = students_courses.course_id;

-- BOM: explicito, limpo, frontend-friendly
SELECT
  sc.id,
  s.name AS student_name,
  c.name AS course_name
FROM students_courses sc
INNER JOIN students s ON s.id = sc.student_id
INNER JOIN courses c ON c.id = sc.course_id;
```