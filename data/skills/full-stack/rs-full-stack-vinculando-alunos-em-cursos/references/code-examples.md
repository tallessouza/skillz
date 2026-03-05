# Code Examples: Vinculando Alunos em Cursos

## Exemplo 1: Insert basico na junction table

```sql
-- Vincular estudante 1 (Lucas) ao curso 2 (CSS)
INSERT INTO students_courses (student_id, course_id)
VALUES (1, 2);
```

## Exemplo 2: Verificar dados antes de inserir

```sql
-- Ver todos os estudantes
SELECT * FROM students;

-- Ver todos os cursos
SELECT * FROM courses;
```

## Exemplo 3: Confirmar insercao

```sql
SELECT * FROM students_courses;
-- Resultado: student_id=1, course_id=2
```

## Exemplo 4: Testando FK constraint com estudante inexistente

```sql
-- Estudante 42 NAO existe
INSERT INTO students_courses (student_id, course_id)
VALUES (42, 2);
-- ERRO: violacao de foreign key constraint
```

## Exemplo 5: Testando FK constraint com curso inexistente

```sql
-- Curso 245 NAO existe
INSERT INTO students_courses (student_id, course_id)
VALUES (1, 245);
-- ERRO: violacao de foreign key constraint
```

## Exemplo 6: Vinculando outro aluno

```sql
-- Mariana (id=4) no curso de HTML (id=1)
INSERT INTO students_courses (student_id, course_id)
VALUES (4, 1);
```

## Exemplo 7: Um aluno em multiplos cursos

```sql
-- Lucas (id=1) tambem no curso de HTML (id=1)
INSERT INTO students_courses (student_id, course_id)
VALUES (1, 1);
```

## Exemplo 8: Resultado final — muitos-para-muitos

```sql
SELECT * FROM students_courses;

-- Resultado:
-- | id | student_id | course_id |
-- |----|-----------|-----------|
-- | 1  | 1         | 2         |  -- Lucas faz CSS
-- | 2  | 4         | 1         |  -- Mariana faz HTML
-- | 3  | 1         | 1         |  -- Lucas faz HTML

-- Estudante 1 faz cursos 1 e 2 (um aluno → muitos cursos)
-- Curso 1 tem estudantes 1 e 4 (um curso → muitos alunos)
-- = Relacionamento MUITOS PARA MUITOS
```

## Variacoes comuns

### Com timestamps (padrao em producao)

```sql
INSERT INTO students_courses (student_id, course_id, enrolled_at)
VALUES (1, 2, NOW());
```

### Multiplas insercoes de uma vez

```sql
INSERT INTO students_courses (student_id, course_id)
VALUES
  (1, 2),
  (4, 1),
  (1, 1);
```

### Com verificacao de duplicata

```sql
INSERT INTO students_courses (student_id, course_id)
VALUES (1, 2)
ON CONFLICT (student_id, course_id) DO NOTHING;
```

### JOIN para ver nomes ao inves de IDs

```sql
SELECT s.name AS student, c.name AS course
FROM students_courses sc
JOIN students s ON s.id = sc.student_id
JOIN courses c ON c.id = sc.course_id;
```