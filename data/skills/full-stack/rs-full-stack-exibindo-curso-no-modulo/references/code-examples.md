# Code Examples: INNER JOIN com Alias de Tabelas

## Exemplo 1: Query inicial sem o nome do curso

Apenas selecionando colunas do modulo com alias:

```sql
SELECT
  m.id,
  m.name,
  m.course_id
FROM modules m
INNER JOIN courses c ON c.id = m.course_id;
```

Resultado: retorna id, nome e course_id de cada modulo, mas sem mostrar o nome do curso.

## Exemplo 2: Adicionando o nome do curso

Incluindo `c.name` para exibir o nome do curso ao lado de cada modulo:

```sql
SELECT
  m.id,
  m.name,
  c.name
FROM modules m
INNER JOIN courses c ON c.id = m.course_id;
```

Resultado:
| id | name | name |
|----|------|------|
| 1 | Fundamentos do CSS | CSS |
| 2 | Layout | CSS |
| 3 | Introducao | HTML |

## Exemplo 3: Sem usar alias (nome completo da tabela)

```sql
SELECT
  modules.id,
  modules.name,
  courses.name
FROM modules
INNER JOIN courses ON courses.id = modules.course_id;
```

Funciona identicamente ao exemplo com alias. Mais verboso, mas igualmente valido.

## Exemplo 4: Erro comum — coluna repetida

O que o instrutor fez por engano:

```sql
SELECT
  m.id,
  m.name,
  m.name  -- repetiu m.name em vez de c.name
FROM modules m
INNER JOIN courses c ON c.id = m.course_id;
```

O SQL executa sem erro, mas o resultado mostra o nome do modulo duas vezes em vez de mostrar o nome do curso.

## Variacoes praticas

### JOIN com 3 tabelas

```sql
SELECT
  l.id,
  l.title,
  m.name AS module_name,
  c.name AS course_name
FROM lessons l
INNER JOIN modules m ON m.id = l.module_id
INNER JOIN courses c ON c.id = m.course_id;
```

### JOIN com filtro WHERE

```sql
SELECT
  m.id,
  m.name,
  c.name AS course_name
FROM modules m
INNER JOIN courses c ON c.id = m.course_id
WHERE c.name = 'CSS';
```

### JOIN com AS para desambiguar colunas no resultado

```sql
SELECT
  m.id AS module_id,
  m.name AS module_name,
  c.id AS course_id,
  c.name AS course_name
FROM modules m
INNER JOIN courses c ON c.id = m.course_id;
```

Usar `AS` no SELECT resolve a ambiguidade no resultado quando ambas as tabelas tem colunas chamadas `id` e `name`.