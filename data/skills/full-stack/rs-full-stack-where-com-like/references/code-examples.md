# Code Examples: WHERE com LIKE

## Exemplos basicos da aula

### Busca exata vs parcial

```sql
-- Busca exata: encontra apenas se o nome for EXATAMENTE "mouse"
SELECT * FROM products WHERE name = 'mouse';
-- Resultado: Mouse

-- Busca exata: "web" nao encontra nada
SELECT * FROM products WHERE name = 'web';
-- Resultado: vazio

-- Busca parcial com LIKE: "web" encontra Webcam
SELECT * FROM products WHERE name LIKE '%web%';
-- Resultado: Webcam
```

### Tres posicoes do %

```sql
-- 1. Termina com "cam"
SELECT * FROM products WHERE name LIKE '%cam';
-- Resultado: Webcam

-- 2. Comeca com "Web"
SELECT * FROM products WHERE name LIKE 'Web%';
-- Resultado: Webcam

-- 3. Contem "eb" em qualquer posicao
SELECT * FROM products WHERE name LIKE '%eb%';
-- Resultado: Webcam
```

### Buscas por letras individuais

```sql
-- Produtos que contem "a"
SELECT * FROM products WHERE name LIKE '%a%';
-- Resultado: Teclado, Webcam, Headset

-- Produtos que contem "e"
SELECT * FROM products WHERE name LIKE '%e%';
-- Resultado: todos os produtos

-- Produtos que contem "s"
SELECT * FROM products WHERE name LIKE '%s%';
-- Resultado: Mouse, Headset
```

### Busca por palavra parcial

```sql
-- Produtos que contem "head"
SELECT * FROM products WHERE name LIKE '%head%';
-- Resultado: Headset
```

## Aplicacao pratica: campo de busca

### Implementacao basica em Node.js

```typescript
// Endpoint de busca de produtos
app.get('/products/search', async (request, reply) => {
  const { query } = request.query

  const products = await db
    .select()
    .from(productsTable)
    .where(like(productsTable.name, `%${query}%`))

  return { products }
})
```

### Com Knex.js

```typescript
const products = await knex('products')
  .where('name', 'like', `%${searchTerm}%`)
```

### Com Prisma

```typescript
const products = await prisma.product.findMany({
  where: {
    name: {
      contains: searchTerm, // Prisma abstrai o LIKE '%termo%'
    },
  },
})
```

### SQL puro com parametros (prevencao de SQL injection)

```sql
-- NUNCA concatene strings diretamente
-- ERRADO: SELECT * FROM products WHERE name LIKE '%' + userInput + '%'

-- CORRETO: use parametros
SELECT * FROM products WHERE name LIKE $1;
-- Passe o valor: `%${userInput}%` como parametro
```

## Variacoes avancadas

### Combinando LIKE com outros filtros

```sql
-- Produtos que contem "a" E custam menos de 100
SELECT * FROM products
WHERE name LIKE '%a%'
  AND price < 100;

-- Produtos que comecam com "Web" OU terminam com "set"
SELECT * FROM products
WHERE name LIKE 'Web%'
   OR name LIKE '%set';
```

### ILIKE no PostgreSQL (case-insensitive)

```sql
-- PostgreSQL: LIKE e case-sensitive
SELECT * FROM products WHERE name LIKE '%web%';  -- NAO encontra "Webcam"
SELECT * FROM products WHERE name ILIKE '%web%'; -- Encontra "Webcam"
```

### Wildcard _ (underscore) para caractere unico

```sql
-- Encontra nomes com exatamente 5 caracteres
SELECT * FROM products WHERE name LIKE '_____';
-- Resultado: Mouse

-- Encontra nomes que tem qualquer letra + "ouse"
SELECT * FROM products WHERE name LIKE '_ouse';
-- Resultado: Mouse
```