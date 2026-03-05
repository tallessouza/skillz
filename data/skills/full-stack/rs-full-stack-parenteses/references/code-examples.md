# Code Examples: Parênteses e Precedência em SQL

## Exemplo 1: AND e OR juntos sem parênteses

```sql
-- Cenário: buscar produtos com preço entre 45-1000 OU da categoria imagem
SELECT * FROM products
WHERE price > 45 AND price < 1000 OR category = 'image';
```

**Resultado:** retorna produtos com preço entre 45-1000 (qualquer categoria) E TAMBÉM todos os produtos de categoria imagem (qualquer preço).

| id | name | price | category |
|----|------|-------|----------|
| 2 | Headset | 89.90 | audio |
| 3 | Microfone | 120.00 | audio |
| 5 | Mouse | 45.90 | periférico |
| 4 | Webcam | 1200.00 | image |

A Webcam (1200) entrou porque `category = 'image'` é verdadeiro, mesmo falhando no filtro de preço.

## Exemplo 2: Adicionando AND category antes do OR

```sql
-- Tentativa de filtrar por áudio E permitir imagem
SELECT * FROM products
WHERE price > 45 AND price < 1000 AND category = 'audio' OR category = 'image';
```

**Avaliação implícita do SQL:**
```
(price > 45 AND price < 1000 AND category = 'audio') OR (category = 'image')
```

**Resultado:** produtos de áudio com preço 45-1000, mais TODOS de imagem independente do preço.

## Exemplo 3: Com parênteses (resultado correto)

```sql
-- Agrupando explicitamente: preço entre 45-1000 E (áudio OU imagem)
SELECT * FROM products
WHERE (price > 45 AND price < 1000)
  AND (category = 'audio' OR category = 'image');
```

**Resultado:** apenas produtos de áudio ou imagem que TAMBÉM atendem o filtro de preço.

| id | name | price | category |
|----|------|-------|----------|
| 2 | Headset | 89.90 | audio |
| 3 | Microfone | 120.00 | audio |

Webcam (1200, imagem) ficou de fora porque 1200 não é < 1000.

## Variações práticas

### Filtro de e-commerce: categoria + faixa de preço + disponibilidade

```sql
-- SEM parênteses (bug)
SELECT * FROM products
WHERE stock > 0 AND price < 500 OR featured = true;
-- Produtos featured aparecem mesmo sem estoque!

-- COM parênteses (correto)
SELECT * FROM products
WHERE stock > 0 AND (price < 500 OR featured = true);
-- Apenas produtos em estoque que são baratos OU destaques
```

### Filtro de usuários: status + role

```sql
-- SEM parênteses (bug)
SELECT * FROM users
WHERE is_active = true AND role = 'admin' OR role = 'superadmin';
-- Superadmins inativos aparecem!

-- COM parênteses (correto)
SELECT * FROM users
WHERE is_active = true AND (role = 'admin' OR role = 'superadmin');
-- Apenas ativos que são admin ou superadmin
```

### Filtro de pedidos: data + status + valor

```sql
-- Query complexa com múltiplos grupos
SELECT * FROM orders
WHERE (created_at >= '2024-01-01' AND created_at < '2024-02-01')
  AND (status = 'completed' OR status = 'shipped')
  AND (total_amount > 100);
```

### Regra prática para construir queries

1. Identifique os grupos lógicos independentes
2. Coloque cada grupo entre parênteses
3. Conecte os grupos com AND ou OR
4. Leia em voz alta: "quero registros onde (grupo1) E (grupo2)"