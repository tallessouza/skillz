# Code Examples: SQL Fundamentals

## Criacao de tabela

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Consultas com filtros

```sql
-- Filtro simples
SELECT * FROM users WHERE email = 'joao@email.com';

-- Combinacao de filtros
SELECT * FROM users WHERE name LIKE 'J%' AND created_at > '2025-01-01';

-- Filtro com IN
SELECT * FROM products WHERE category IN ('eletronicos', 'livros', 'games');

-- Filtro com BETWEEN
SELECT * FROM orders WHERE total BETWEEN 100 AND 500;
```

## Inserir dados

```sql
INSERT INTO users (name, email) VALUES ('Maria', 'maria@email.com');

-- Inserir multiplos registros
INSERT INTO users (name, email) VALUES
  ('Ana', 'ana@email.com'),
  ('Pedro', 'pedro@email.com');
```

## Atualizar dados

```sql
-- Sempre com WHERE
UPDATE users SET name = 'Maria Silva' WHERE id = 1;

-- Atualizar multiplas colunas
UPDATE products SET price = 29.90, updated_at = NOW() WHERE id = 42;
```

## Deletar dados

```sql
-- Sempre com WHERE
DELETE FROM users WHERE id = 1;

-- Deletar com condicao composta
DELETE FROM sessions WHERE expires_at < NOW() AND active = false;
```

## Relacionamento 1:1

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
  bio TEXT,
  avatar_url VARCHAR(500)
);
```

## Relacionamento 1:N

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buscar pedidos de um usuario
SELECT orders.* FROM orders WHERE user_id = 1;

-- Buscar com JOIN
SELECT users.name, orders.total
FROM users
JOIN orders ON orders.user_id = users.id;
```

## Relacionamento N:N

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

-- Tabela intermediaria
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, course_id)
);

-- Buscar cursos de um aluno
SELECT courses.title
FROM courses
JOIN enrollments ON enrollments.course_id = courses.id
WHERE enrollments.student_id = 1;

-- Buscar alunos de um curso
SELECT students.name
FROM students
JOIN enrollments ON enrollments.student_id = students.id
WHERE enrollments.course_id = 1;
```