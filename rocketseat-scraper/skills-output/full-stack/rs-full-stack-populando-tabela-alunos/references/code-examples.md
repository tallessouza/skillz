# Code Examples: Populando Tabelas com INSERT INTO

## Exemplo completo da aula — 10 registros de alunos

```sql
INSERT INTO students (name) VALUES ('Lucas Santos');
INSERT INTO students (name) VALUES ('Beatriz Lima');
INSERT INTO students (name) VALUES ('Gabriel Oliveira');
INSERT INTO students (name) VALUES ('Mariana Costa');
INSERT INTO students (name) VALUES ('Felipe Souza');
INSERT INTO students (name) VALUES ('Larissa Pereira');
INSERT INTO students (name) VALUES ('Rafael Mendes');
INSERT INTO students (name) VALUES ('Amanda Silva');
INSERT INTO students (name) VALUES ('Juliana Rodrigues');
INSERT INTO students (name) VALUES ('Pedro Ferreira');
```

## Verificação dos dados inseridos

```sql
SELECT * FROM students;
```

Resultado esperado:

| id | name |
|----|------|
| 1 | Lucas Santos |
| 2 | Beatriz Lima |
| 3 | Gabriel Oliveira |
| 4 | Mariana Costa |
| 5 | Felipe Souza |
| 6 | Larissa Pereira |
| 7 | Rafael Mendes |
| 8 | Amanda Silva |
| 9 | Juliana Rodrigues |
| 10 | Pedro Ferreira |

## Variação: INSERT com múltiplas colunas

Se a tabela tivesse mais colunas (ex: email):

```sql
INSERT INTO students (name, email) VALUES ('Lucas Santos', 'lucas.santos@email.com');
INSERT INTO students (name, email) VALUES ('Beatriz Lima', 'beatriz.lima@email.com');
INSERT INTO students (name, email) VALUES ('Gabriel Oliveira', 'gabriel.oliveira@email.com');
```

## Variação: Sintaxe de múltiplos VALUES (alternativa)

```sql
INSERT INTO students (name) VALUES
  ('Lucas Santos'),
  ('Beatriz Lima'),
  ('Gabriel Oliveira'),
  ('Mariana Costa'),
  ('Felipe Souza'),
  ('Larissa Pereira'),
  ('Rafael Mendes'),
  ('Amanda Silva'),
  ('Juliana Rodrigues'),
  ('Pedro Ferreira');
```

Esta sintaxe é mais compacta e performática para inserções em lote, mas menos flexível para debug individual.

## Variação: INSERT com SELECT (copiar dados entre tabelas)

```sql
INSERT INTO students_backup (name)
SELECT name FROM students;
```

## Cuidado: Não re-executar INSERTs

Se você executar o script de INSERT duas vezes, terá 20 registros ao invés de 10. Para evitar:

```sql
-- Verificar antes de inserir
SELECT COUNT(*) FROM students;

-- Se precisar limpar e reinserir
DELETE FROM students;
-- Depois execute os INSERTs novamente
```

## Padrão para seed de dados em projetos

```sql
-- seed.sql
-- Limpa dados anteriores (cuidado em produção!)
DELETE FROM students;

-- Reseta o auto-increment (SQLite)
DELETE FROM sqlite_sequence WHERE name = 'students';

-- Insere dados de exemplo
INSERT INTO students (name) VALUES ('Lucas Santos');
INSERT INTO students (name) VALUES ('Beatriz Lima');
-- ... demais registros

-- Verifica
SELECT * FROM students;
```