# Code Examples: Inserindo Modulos

## Exemplo 1: Testando restricao de FK (erro proposital)

```sql
-- Tentar inserir modulo para curso inexistente (id=105)
INSERT INTO courses_modules (name, course_id)
VALUES ('Modulo Teste', 105);

-- Resultado: ERRO - violacao de chave estrangeira
-- "foreign key constraint" porque nao existe curso com id=105
```

## Exemplo 2: Verificando cursos existentes

```sql
SELECT * FROM courses;
-- Resultado: cursos de id 1 ate 10
-- id=1: HTML, id=2: CSS, etc.
```

## Exemplo 3: INSERT multi-row para CSS (curso id=2)

```sql
INSERT INTO courses_modules (name, course_id)
VALUES
  ('Fundamentos do CSS', 2),
  ('Layout com CSS', 2),
  ('CSS Functions', 2);

-- Resultado: 3 rows affected
```

## Exemplo 4: INSERT para outro curso — HTML (id=1)

```sql
INSERT INTO courses_modules (name, course_id)
VALUES
  ('Fundamentos do HTML', 1),
  ('Formularios', 1);

-- Resultado: 2 rows affected
```

## Exemplo 5: Verificando todos os modulos

```sql
SELECT * FROM courses_modules;

-- Resultado:
-- id=1 | name='Fundamentos do CSS' | course_id=2
-- id=2 | name='Layout com CSS'     | course_id=2
-- id=3 | name='CSS Functions'      | course_id=2
-- id=4 | name='Fundamentos do HTML'| course_id=1
-- id=5 | name='Formularios'        | course_id=1
```

## Variacao: INSERT individual (alternativa menos eficiente)

```sql
-- Funciona, mas menos eficiente que multi-row
INSERT INTO courses_modules (name, course_id) VALUES ('Fundamentos do CSS', 2);
INSERT INTO courses_modules (name, course_id) VALUES ('Layout com CSS', 2);
INSERT INTO courses_modules (name, course_id) VALUES ('CSS Functions', 2);
```

## Variacao: INSERT com RETURNING (PostgreSQL)

```sql
-- Ver o que foi inserido imediatamente
INSERT INTO courses_modules (name, course_id)
VALUES
  ('Fundamentos do CSS', 2),
  ('Layout com CSS', 2)
RETURNING id, name, course_id;
```

## Variacao: Validar antes de inserir com subquery

```sql
-- Inserir apenas se o curso existir (alternativa programatica)
INSERT INTO courses_modules (name, course_id)
SELECT 'Novo Modulo', id FROM courses WHERE id = 2;
```