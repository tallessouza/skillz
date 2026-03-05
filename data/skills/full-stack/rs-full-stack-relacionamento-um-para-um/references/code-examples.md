# Code Examples: Relacionamento Um para Um

## Exemplo completo da aula

### Contexto: tabelas pre-existentes

```sql
-- Tabela de cursos (ja existente)
SELECT * FROM courses;

-- Tabela de estudantes (ja existente)  
SELECT * FROM students;
```

### Criacao da tabela student_address

```sql
CREATE TABLE student_address (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER UNIQUE NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  FOREIGN KEY(student_id) REFERENCES students(id)
);
```

## Variacao: tabela de endereco mais completa

```sql
CREATE TABLE student_address (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER UNIQUE NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  FOREIGN KEY(student_id) REFERENCES students(id)
);
```

## Variacao: outro exemplo de 1:1 (perfil de usuario)

```sql
CREATE TABLE user_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  birth_date TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

## Comparacao: 1:1 vs 1:N

```sql
-- 1:1: Um estudante tem UM endereco (UNIQUE no FK)
CREATE TABLE student_address (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER UNIQUE NOT NULL,  -- UNIQUE = 1:1
  street TEXT NOT NULL,
  FOREIGN KEY(student_id) REFERENCES students(id)
);

-- 1:N: Um estudante tem VARIOS telefones (sem UNIQUE no FK)
CREATE TABLE student_phones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,          -- Sem UNIQUE = 1:N
  phone TEXT NOT NULL,
  FOREIGN KEY(student_id) REFERENCES students(id)
);
```

## Erro comum: REFERENCES sem parenteses

```sql
-- ERRADO — causa erro de sintaxe
FOREIGN KEY(student_id) REFERENCES students id

-- CORRETO — parenteses obrigatorio
FOREIGN KEY(student_id) REFERENCES students(id)
```

## Erro comum: foreign key sem constraints

```sql
-- FRACO — permite dados inconsistentes
student_id INTEGER

-- FORTE — garante integridade 1:1
student_id INTEGER UNIQUE NOT NULL
```