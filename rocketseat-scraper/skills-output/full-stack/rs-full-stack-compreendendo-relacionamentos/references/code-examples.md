# Code Examples: Relacionamentos em Banco de Dados Relacional

## Exemplo 1: Pessoa e Carro

```sql
-- Tabela de pessoas (cada pessoa tem sua PK)
CREATE TABLE pessoas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT
);

-- Tabela de carros (FK pessoa_id conecta ao dono)
CREATE TABLE carros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  modelo TEXT NOT NULL,
  placa TEXT NOT NULL,
  pessoa_id INTEGER NOT NULL REFERENCES pessoas(id)
);

-- Inserindo dados
INSERT INTO pessoas (nome, email) VALUES ('Maria', 'maria@email.com');
INSERT INTO carros (modelo, placa, pessoa_id) VALUES ('Civic', 'ABC1234', 1);

-- Consultando: qual carro pertence a quem?
SELECT carros.modelo, carros.placa, pessoas.nome AS dono
FROM carros
JOIN pessoas ON pessoas.id = carros.pessoa_id;

-- Integridade: tentar deletar pessoa com carro vinculado
DELETE FROM pessoas WHERE id = 1;
-- ERRO: FOREIGN KEY constraint failed
```

## Exemplo 2: Restaurante e Pratos (sistema tipo iFood)

```sql
CREATE TABLE restaurantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  endereco TEXT
);

CREATE TABLE pratos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  preco REAL NOT NULL,
  restaurante_id INTEGER NOT NULL REFERENCES restaurantes(id)
);

-- Um restaurante com varios pratos
INSERT INTO restaurantes (nome, endereco) VALUES ('Sushi Place', 'Rua A, 123');
INSERT INTO pratos (nome, preco, restaurante_id) VALUES ('Temaki', 29.90, 1);
INSERT INTO pratos (nome, preco, restaurante_id) VALUES ('Sashimi', 45.00, 1);
INSERT INTO pratos (nome, preco, restaurante_id) VALUES ('Uramaki', 32.00, 1);

-- Listar pratos de um restaurante
SELECT pratos.nome, pratos.preco
FROM pratos
JOIN restaurantes ON restaurantes.id = pratos.restaurante_id
WHERE restaurantes.nome = 'Sushi Place';
```

## Exemplo 3: Livros e Autores (exemplo da aula)

```sql
CREATE TABLE autores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL
);

CREATE TABLE livros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  autor_id INTEGER NOT NULL REFERENCES autores(id)
);

-- Dados do exemplo da aula
INSERT INTO autores (nome) VALUES ('C.S. Lewis');    -- id = 1
INSERT INTO autores (nome) VALUES ('J.R.R. Tolkien'); -- id = 2

INSERT INTO livros (titulo, autor_id) VALUES ('As Cronicas de Narnia', 1);
INSERT INTO livros (titulo, autor_id) VALUES ('O Hobbit', 2);
INSERT INTO livros (titulo, autor_id) VALUES ('O Senhor dos Aneis', 2);

-- Consultar livros com nome do autor
SELECT livros.titulo, autores.nome AS autor
FROM livros
JOIN autores ON autores.id = livros.autor_id;

-- Resultado:
-- As Cronicas de Narnia | C.S. Lewis
-- O Hobbit              | J.R.R. Tolkien
-- O Senhor dos Aneis    | J.R.R. Tolkien
```

## Variacao: FK com ON DELETE CASCADE vs RESTRICT

```sql
-- RESTRICT (padrao): bloqueia delecao se existem dependentes
CREATE TABLE carros (
  id INTEGER PRIMARY KEY,
  modelo TEXT,
  pessoa_id INTEGER REFERENCES pessoas(id) ON DELETE RESTRICT
);

-- CASCADE: deleta dependentes automaticamente
CREATE TABLE carros (
  id INTEGER PRIMARY KEY,
  modelo TEXT,
  pessoa_id INTEGER REFERENCES pessoas(id) ON DELETE CASCADE
);

-- SET NULL: define FK como NULL quando referenciado e deletado
CREATE TABLE carros (
  id INTEGER PRIMARY KEY,
  modelo TEXT,
  pessoa_id INTEGER REFERENCES pessoas(id) ON DELETE SET NULL
);
```

## Variacao: Padrao de nomenclatura FK

```sql
-- CORRETO: nome_da_tabela_id
autor_id      -- referencia tabela autores
pessoa_id     -- referencia tabela pessoas
restaurante_id -- referencia tabela restaurantes

-- INCORRETO: nomes genericos ou confusos
fk1           -- impossivel saber o que referencia
ref           -- generico demais
id_autor      -- inverte o padrao (menos comum)
authorId      -- camelCase nao e padrao SQL
```