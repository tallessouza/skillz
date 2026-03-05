# Code Examples: Populando Tabelas com INSERT INTO

## Exemplo exato da aula

```sql
-- Populando tabela de cursos com 10 registros
INSERT INTO cursos (nome) VALUES ('Html');
INSERT INTO cursos (nome) VALUES ('Css');
INSERT INTO cursos (nome) VALUES ('Javascript');
INSERT INTO cursos (nome) VALUES ('Typescript');
INSERT INTO cursos (nome) VALUES ('React');
INSERT INTO cursos (nome) VALUES ('Node.js');
INSERT INTO cursos (nome) VALUES ('Git');
INSERT INTO cursos (nome) VALUES ('Github');
INSERT INTO cursos (nome) VALUES ('Express.js');
INSERT INTO cursos (nome) VALUES ('Banco de dados');
```

Resultado esperado: `10/10` — todos inseridos.

## Verificação

```sql
-- Confirmar todos os registros
SELECT * FROM cursos;
```

Resultado:
```
id | nome
1  | Html
2  | Css
3  | Javascript
4  | Typescript
5  | React
6  | Node.js
7  | Git
8  | Github
9  | Express.js
10 | Banco de dados
```

## Variação: INSERT com múltiplas colunas

```sql
-- Se a tabela tiver mais colunas
INSERT INTO cursos (nome, duracao_horas, nivel) VALUES ('Html', 20, 'iniciante');
INSERT INTO cursos (nome, duracao_horas, nivel) VALUES ('React', 40, 'intermediario');
INSERT INTO cursos (nome, duracao_horas, nivel) VALUES ('Node.js', 60, 'avancado');

SELECT * FROM cursos;
```

## Variação: Multi-row INSERT (SQLite 3.7.11+)

```sql
-- Inserir todos de uma vez (mais eficiente)
INSERT INTO cursos (nome) VALUES
  ('Html'),
  ('Css'),
  ('Javascript'),
  ('Typescript'),
  ('React'),
  ('Node.js'),
  ('Git'),
  ('Github'),
  ('Express.js'),
  ('Banco de dados');

-- Verificar contagem
SELECT COUNT(*) FROM cursos;
-- Resultado: 10
```

## Variação: INSERT com dados numéricos e NULL

```sql
-- Colunas opcionais ficam como NULL se não especificadas
INSERT INTO cursos (nome) VALUES ('Docker');
-- Se houver coluna duracao_horas, ela será NULL

-- Para ser explícito sobre NULL:
INSERT INTO cursos (nome, duracao_horas) VALUES ('Docker', NULL);
```

## Armadilha: re-execução duplica dados

```sql
-- Se você executar os INSERTs duas vezes, terá 20 registros!
-- Para evitar, selecione apenas o SELECT ao verificar

-- Ou use INSERT OR IGNORE com UNIQUE constraint:
INSERT OR IGNORE INTO cursos (nome) VALUES ('Html');
```

## Executando seletivamente

No editor SQL (como o do SQLite):
1. Escreva todos os INSERTs + SELECT
2. Execute tudo uma vez (INSERTs + SELECT)
3. Para re-verificar: **selecione apenas a linha do SELECT** e execute a seleção
4. Isso evita duplicar os registros