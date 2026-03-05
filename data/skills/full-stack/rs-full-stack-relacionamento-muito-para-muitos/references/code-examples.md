# Code Examples: Relacionamento Muitos para Muitos

## Exemplo base da aula

Contexto: conectar alunos a cursos em um relacionamento N:M.

### Tabelas pre-existentes

```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

### Tabela pivot

```sql
CREATE TABLE students_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

### Inserindo dados

```sql
-- Alunos
INSERT INTO students (name) VALUES ('Maria');
INSERT INTO students (name) VALUES ('Joao');

-- Cursos
INSERT INTO courses (name) VALUES ('JavaScript');
INSERT INTO courses (name) VALUES ('SQL');
INSERT INTO courses (name) VALUES ('React');

-- Matriculas (N:M)
INSERT INTO students_courses (student_id, course_id) VALUES (1, 1); -- Maria faz JavaScript
INSERT INTO students_courses (student_id, course_id) VALUES (1, 2); -- Maria faz SQL
INSERT INTO students_courses (student_id, course_id) VALUES (1, 3); -- Maria faz React
INSERT INTO students_courses (student_id, course_id) VALUES (2, 1); -- Joao faz JavaScript
INSERT INTO students_courses (student_id, course_id) VALUES (2, 3); -- Joao faz React
```

### Consultando: cursos de um aluno

```sql
SELECT courses.name
FROM courses
INNER JOIN students_courses ON courses.id = students_courses.course_id
WHERE students_courses.student_id = 1;
-- Resultado: JavaScript, SQL, React
```

### Consultando: alunos de um curso

```sql
SELECT students.name
FROM students
INNER JOIN students_courses ON students.id = students_courses.student_id
WHERE students_courses.course_id = 1;
-- Resultado: Maria, Joao
```

## Variacao: pivot com dados extras

```sql
CREATE TABLE students_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  enrolled_at TEXT DEFAULT (datetime('now')),
  grade REAL,
  status TEXT DEFAULT 'active',
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## Variacao: com constraint UNIQUE no par

```sql
CREATE TABLE students_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  UNIQUE(student_id, course_id)
);
```

## Variacao: self-referencing N:M (seguidores)

```sql
CREATE TABLE user_followers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  follower_id INTEGER NOT NULL,
  followed_id INTEGER NOT NULL,
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (followed_id) REFERENCES users(id),
  UNIQUE(follower_id, followed_id)
);
```

## Variacao: N:M com CASCADE

```sql
CREATE TABLE students_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
```

## Consulta completa com JOIN triplo

```sql
SELECT
  students.name AS aluno,
  courses.name AS curso
FROM students_courses
INNER JOIN students ON students.id = students_courses.student_id
INNER JOIN courses ON courses.id = students_courses.course_id
ORDER BY students.name, courses.name;
```