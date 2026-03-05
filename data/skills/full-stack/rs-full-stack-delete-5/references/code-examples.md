# Code Examples: Delete com Knex Query Builder

## Exemplo base da aula

```typescript
// Rota DELETE para remover um curso pelo id
app.delete('/curse/:id', async (request, response) => {
  const { id } = request.params

  await knex('curse')
    .where({ id })
    .delete()

  return response.json()
})
```

Testado no Insomnia:
- Metodo: DELETE
- URL: `http://localhost:3303/curse/2`
- Resultado: registro com id 2 (CSS) removido

## Variacao: retornando status 204 (No Content)

```typescript
app.delete('/courses/:id', async (request, response) => {
  const { id } = request.params

  await knex('courses')
    .where({ id })
    .delete()

  return response.status(204).send()
})
```

204 e o status HTTP mais semantico para delete bem-sucedido sem conteudo no body.

## Variacao: verificando existencia antes de deletar

```typescript
app.delete('/courses/:id', async (request, response) => {
  const { id } = request.params

  const course = await knex('courses')
    .where({ id })
    .first()

  if (!course) {
    return response.status(404).json({ error: 'Course not found' })
  }

  await knex('courses')
    .where({ id })
    .delete()

  return response.status(204).send()
})
```

## Variacao: retornando o registro deletado (PostgreSQL)

```typescript
app.delete('/courses/:id', async (request, response) => {
  const { id } = request.params

  const [deletedCourse] = await knex('courses')
    .where({ id })
    .returning('*')
    .delete()

  if (!deletedCourse) {
    return response.status(404).json({ error: 'Course not found' })
  }

  return response.json(deletedCourse)
})
```

Nota: `.returning()` so funciona em PostgreSQL e MSSQL. SQLite nao suporta.

## Variacao: delete com multiplas condicoes

```typescript
app.delete('/enrollments', async (request, response) => {
  const { courseId, studentId } = request.body

  await knex('enrollments')
    .where({ courseId, studentId })
    .delete()

  return response.status(204).send()
})
```

## SQL gerado pelo Knex

```sql
-- Delete simples por id
DELETE FROM courses WHERE id = 2;

-- Delete com multiplas condicoes
DELETE FROM enrollments WHERE course_id = 1 AND student_id = 5;

-- Delete com returning (PostgreSQL)
DELETE FROM courses WHERE id = 2 RETURNING *;
```

## CRUD completo para referencia

```typescript
// CREATE
app.post('/courses', async (request, response) => {
  const { name } = request.body
  await knex('courses').insert({ name })
  return response.status(201).json()
})

// READ (all)
app.get('/courses', async (request, response) => {
  const courses = await knex('courses').select()
  return response.json(courses)
})

// UPDATE
app.put('/courses/:id', async (request, response) => {
  const { id } = request.params
  const { name } = request.body
  await knex('courses').where({ id }).update({ name })
  return response.json()
})

// DELETE
app.delete('/courses/:id', async (request, response) => {
  const { id } = request.params
  await knex('courses').where({ id }).delete()
  return response.json()
})
```