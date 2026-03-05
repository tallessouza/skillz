# Code Examples: DELETE Seguro em SQL

## Exemplo 1: Inserindo multiplos registros

Contexto: Cadastrar produtos adicionais na tabela.

```sql
INSERT INTO products (name, price, category) VALUES ('Microfone', 550, 'Áudio');
INSERT INTO products (name, price, category) VALUES ('Webcam', 1200, 'Imagem');
INSERT INTO products (name, price, category) VALUES ('Headset', 800, 'Áudio');
```

Notas:
- O campo `id` nao e informado porque e auto-incremento
- Cada INSERT termina com `;` porque sao multiplas instrucoes
- Os valores seguem a mesma ordem das colunas declaradas

## Exemplo 2: Consultando todos os registros

```sql
SELECT * FROM products;
```

Resultado esperado apos os inserts:

| id | name | price | category |
|----|------|-------|----------|
| 1 | Mouse | ... | ... |
| 2 | Teclado | ... | ... |
| 3 | Microfone | 550 | Áudio |
| 4 | Webcam | 1200 | Imagem |
| 5 | Headset | 800 | Áudio |

## Exemplo 3: Deletando um registro especifico

```sql
DELETE FROM products WHERE id = 3;
```

Resultado: "1 row affected"

SELECT apos o delete:

| id | name | price | category |
|----|------|-------|----------|
| 1 | Mouse | ... | ... |
| 2 | Teclado | ... | ... |
| 4 | Webcam | 1200 | Imagem |
| 5 | Headset | 800 | Áudio |

Note o gap: de 2 pula para 4.

## Exemplo 4: Reinserindo registro deletado

```sql
INSERT INTO products (name, price, category) VALUES ('Microfone', 550, 'Áudio');
```

Resultado apos reinsercao:

| id | name | price | category |
|----|------|-------|----------|
| 1 | Mouse | ... | ... |
| 2 | Teclado | ... | ... |
| 4 | Webcam | 1200 | Imagem |
| 5 | Headset | 800 | Áudio |
| 6 | Microfone | 550 | Áudio |

O Microfone agora tem ID 6, nao 3.

## Variacoes praticas

### DELETE com confirmacao previa

```sql
-- Passo 1: Confirme o alvo
SELECT * FROM products WHERE id = 3;

-- Passo 2: Delete
DELETE FROM products WHERE id = 3;
```

### DELETE por criterio (use com cautela)

```sql
-- Deletar todos os produtos de audio
DELETE FROM products WHERE category = 'Áudio';
```

### O que NUNCA fazer

```sql
-- PERIGO: deleta TODOS os registros
DELETE FROM products;
```