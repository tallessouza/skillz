# Code Examples: Relacionamento Um para Muitos

## Exemplo da aula: Cursos e Módulos

### Setup: tabela pai já existente

```sql
-- Tabela de cursos (já criada em aula anterior)
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Dados de exemplo
INSERT INTO courses (name) VALUES ('Full Stack');
INSERT INTO courses (name) VALUES ('DevOps');
```

### Criação da tabela filha

```sql
CREATE TABLE course_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  course_id INTEGER NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

### Inserindo módulos (demonstra o "muitos")

```sql
-- Curso 1 (Full Stack) com 3 módulos
INSERT INTO course_modules (name, course_id) VALUES ('Fundamentos', 1);
INSERT INTO course_modules (name, course_id) VALUES ('Banco de dados', 1);
INSERT INTO course_modules (name, course_id) VALUES ('Deploy', 1);

-- Curso 2 (DevOps) com 2 módulos
INSERT INTO course_modules (name, course_id) VALUES ('Docker', 2);
INSERT INTO course_modules (name, course_id) VALUES ('CI/CD', 2);
```

### Consultando com JOIN

```sql
-- Todos os módulos de um curso
SELECT c.name AS curso, m.name AS modulo
FROM courses c
JOIN course_modules m ON m.course_id = c.id
WHERE c.id = 1;
```

## Variações do padrão 1:N

### Produtos e Avaliações

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price_in_cents INTEGER NOT NULL
);

CREATE TABLE product_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Usuários e Posts

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### FK nullable (filho pode existir sem pai)

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  project_id INTEGER,  -- NULL permitido: task sem projeto
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

## Comparação: 1:1 vs 1:N

```sql
-- 1:1: UNIQUE na FK
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bio TEXT,
  user_id INTEGER NOT NULL UNIQUE,  -- UNIQUE = 1:1
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 1:N: SEM UNIQUE na FK
CREATE TABLE user_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  user_id INTEGER NOT NULL,  -- Sem UNIQUE = 1:N
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```