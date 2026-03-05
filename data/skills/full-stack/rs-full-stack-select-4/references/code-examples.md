# Code Examples: Select com Query Builder (Knex.js)

## Exemplo 1: Select com raw SQL

```javascript
app.get("/courses", async (request, response) => {
  const courses = await knex.raw("SELECT * FROM courses")
  return response.json(courses)
})
```

Resultado: retorna todos os cursos na ordem padrão do banco (geralmente por id de inserção).

## Exemplo 2: Select com method chaining

```javascript
app.get("/courses", async (request, response) => {
  const courses = await knex("courses").select()
  return response.json(courses)
})
```

Resultado idêntico ao raw, mas composável.

## Exemplo 3: Select com orderBy ascendente

```javascript
const courses = await knex("courses").select().orderBy("name", "asc")
```

Resultado: HTML aparece antes de JavaScript (ordem A-Z).

## Exemplo 4: Select com orderBy descendente

```javascript
const courses = await knex("courses").select().orderBy("name", "desc")
```

Resultado: JavaScript aparece antes de HTML (ordem Z-A).

## Exemplo 5: OrderBy por coluna numérica

```javascript
const courses = await knex("courses").select().orderBy("id", "asc")
```

Resultado: ordenado do id 1 em diante.

## Variações úteis (extensões do padrão ensinado)

### Select com colunas específicas

```javascript
const courses = await knex("courses").select("id", "name")
```

### Select com múltiplos orderBy

```javascript
const courses = await knex("courses")
  .select()
  .orderBy("category", "asc")
  .orderBy("name", "asc")
```

### Select com where + orderBy (composabilidade em ação)

```javascript
const courses = await knex("courses")
  .select()
  .where("active", true)
  .orderBy("name", "asc")
```

Este último exemplo ilustra o poder do method chaining que o instrutor menciona — cada método adiciona uma camada à query sem reescrever as anteriores.