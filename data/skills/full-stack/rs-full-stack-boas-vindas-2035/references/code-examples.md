# Code Examples: Banco de Dados — Mapa de Aprendizado

## Nota

Esta é uma aula introdutória (Boas Vindas) que não contém exemplos de código. Os exemplos de código serão cobertos nas aulas seguintes do módulo.

## Preview dos tópicos que serão cobertos

### Criar tabela
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);
```

### Inserir registro
```sql
INSERT INTO users (name, email) VALUES ('João', 'joao@email.com');
```

### Consultar
```sql
SELECT * FROM users;
SELECT name, email FROM users WHERE id = 1;
```

### Atualizar
```sql
UPDATE users SET name = 'João Silva' WHERE id = 1;
```

### Deletar
```sql
DELETE FROM users WHERE id = 1;
```

### Filtros
```sql
SELECT * FROM users WHERE name LIKE 'Jo%';
SELECT * FROM users WHERE id > 5 AND email IS NOT NULL;
```

### Relacionamentos
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10,2)
);

SELECT users.name, orders.total
FROM users
JOIN orders ON orders.user_id = users.id;
```

> Estes são exemplos preview. Cada tópico será detalhado em sua própria skill conforme as aulas avançam.