# Code Examples: Criando Tabelas SQL (SQLite)

## Exemplo da aula — Tabela students

### Versão com erro (como o instrutor digitou primeiro)

```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCRMENT,
  name TEXT NOT NULL
);
-- Erro: AUTOINCRMENT não é reconhecido
-- Resultado: erro de sintaxe
```

### Versão corrigida (resultado final da aula)

```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

### Resultado esperado

Após executar, duas entradas aparecem no banco:
1. Tabela `students` com colunas `id` (INTEGER) e `name` (TEXT)
2. Tabela `sqlite_sequence` com registro `(students, 0)` — controla o autoincrement

## Variações do mesmo padrão

### Tabela com mais campos

```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  duration_in_hours INTEGER NOT NULL,
  description TEXT
);
```

### Tabela com campo de data

```sql
CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  enrolled_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Tabela com constraint UNIQUE

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);
```

## Padrão completo: criação + verificação

```sql
-- Criar tabela apenas se não existir
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Verificar estrutura
PRAGMA table_info(students);
```

## Erros comuns e correções

### Erro 1: Espaço no AUTOINCREMENT

```sql
-- ERRADO
id INTEGER PRIMARY KEY AUTO INCREMENT
-- CORRETO
id INTEGER PRIMARY KEY AUTOINCREMENT
```

### Erro 2: Vírgula após última coluna

```sql
-- ERRADO
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,  -- vírgula aqui causa erro
);

-- CORRETO
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

### Erro 3: INT em vez de INTEGER para PRIMARY KEY

```sql
-- FUNCIONA mas sem autoincrement behavior completo
id INT PRIMARY KEY

-- CORRETO para autoincrement
id INTEGER PRIMARY KEY AUTOINCREMENT
-- No SQLite, AUTOINCREMENT só funciona com INTEGER (não INT)
```