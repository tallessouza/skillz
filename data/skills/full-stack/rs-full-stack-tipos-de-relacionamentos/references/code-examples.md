# Code Examples: Tipos de Relacionamentos

## 1:1 — Autor e Endereco

### SQL puro
```sql
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  author_id INTEGER UNIQUE NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20)
);
```

### Consulta
```sql
-- Buscar autor com seu endereco
SELECT a.name, ad.street, ad.city
FROM authors a
JOIN addresses ad ON ad.author_id = a.id
WHERE a.id = 1;
```

### Variacao: 1:1 opcional (endereco pode nao existir)
```sql
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  author_id INTEGER UNIQUE REFERENCES authors(id), -- nullable = opcional
  street VARCHAR(255) NOT NULL
);

-- LEFT JOIN para incluir autores sem endereco
SELECT a.name, ad.street
FROM authors a
LEFT JOIN addresses ad ON ad.author_id = a.id;
```

## 1:N — Post e Comentarios

### SQL puro
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index na FK para performance em JOINs
CREATE INDEX idx_comments_post_id ON comments(post_id);
```

### Consultas
```sql
-- Todos os comentarios de um post
SELECT c.author_name, c.content
FROM comments c
WHERE c.post_id = 42
ORDER BY c.created_at;

-- Contagem de comentarios por post
SELECT p.title, COUNT(c.id) AS comment_count
FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
GROUP BY p.id, p.title
ORDER BY comment_count DESC;
```

## N:M — Livros e Autores

### SQL puro
```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  published_at DATE
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Tabela intermediaria
CREATE TABLE book_authors (
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, author_id)
);
```

### Consultas
```sql
-- Todos os autores de um livro
SELECT a.name
FROM authors a
JOIN book_authors ba ON ba.author_id = a.id
WHERE ba.book_id = 1;

-- Todos os livros de um autor
SELECT b.title
FROM books b
JOIN book_authors ba ON ba.book_id = b.id
WHERE ba.author_id = 5;

-- Livros com mais de um autor
SELECT b.title, COUNT(ba.author_id) AS author_count
FROM books b
JOIN book_authors ba ON ba.book_id = b.id
GROUP BY b.id, b.title
HAVING COUNT(ba.author_id) > 1;
```

### Variacao: N:M com atributos na associacao
```sql
CREATE TABLE book_authors (
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'author', -- 'author', 'co-author', 'editor'
  contribution_order INTEGER,         -- ordem de aparicao na capa
  PRIMARY KEY (book_id, author_id)
);
```

## Prisma ORM equivalents

### 1:1
```prisma
model Author {
  id      Int      @id @default(autoincrement())
  name    String
  address Address?
}

model Address {
  id       Int    @id @default(autoincrement())
  street   String
  authorId Int    @unique
  author   Author @relation(fields: [authorId], references: [id])
}
```

### 1:N
```prisma
model Post {
  id       Int       @id @default(autoincrement())
  title    String
  comments Comment[]
}

model Comment {
  id      Int    @id @default(autoincrement())
  content String
  postId  Int
  post    Post   @relation(fields: [postId], references: [id])
}
```

### N:M (implicito no Prisma)
```prisma
model Book {
  id      Int      @id @default(autoincrement())
  title   String
  authors Author[]
}

model Author {
  id    Int    @id @default(autoincrement())
  name  String
  books Book[]
}
```

### N:M (explicito com tabela intermediaria)
```prisma
model Book {
  id      Int          @id @default(autoincrement())
  title   String
  authors BookAuthor[]
}

model Author {
  id    Int          @id @default(autoincrement())
  name  String
  books BookAuthor[]
}

model BookAuthor {
  bookId   Int
  authorId Int
  role     String @default("author")
  book     Book   @relation(fields: [bookId], references: [id])
  author   Author @relation(fields: [authorId], references: [id])

  @@id([bookId, authorId])
}
```