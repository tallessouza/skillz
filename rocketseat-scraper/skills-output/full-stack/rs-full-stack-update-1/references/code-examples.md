# Code Examples: Knex Update com Query Builder

## Exemplo base do curso

```typescript
// Rota PUT para atualizar curso por ID
app.put('/courses/:id', async (request, response) => {
  const { id } = request.params
  const { name } = request.body

  await knex('courses').update({ name }).where({ id })

  return response.json()
})
```

## Variacao: retornar registro atualizado

```typescript
app.put('/courses/:id', async (request, response) => {
  const { id } = request.params
  const { name } = request.body

  await knex('courses').update({ name }).where({ id })

  const course = await knex('courses').where({ id }).first()

  return response.json(course)
})
```

## Variacao: multiplos campos

```typescript
app.put('/courses/:id', async (request, response) => {
  const { id } = request.params
  const { name, duration, instructor } = request.body

  await knex('courses')
    .update({ name, duration, instructor })
    .where({ id })

  return response.json()
})
```

## Variacao: com validacao basica

```typescript
app.put('/courses/:id', async (request, response) => {
  const { id } = request.params
  const { name } = request.body

  if (!name) {
    return response.status(400).json({ error: 'Name is required' })
  }

  const rowsUpdated = await knex('courses').update({ name }).where({ id })

  if (rowsUpdated === 0) {
    return response.status(404).json({ error: 'Course not found' })
  }

  return response.json()
})
```

## Contexto completo: CRUD ate agora no curso

```typescript
// GET - listar
app.get('/courses', async (request, response) => {
  const courses = await knex('courses')
  return response.json(courses)
})

// POST - criar
app.post('/courses', async (request, response) => {
  const { name } = request.body
  await knex('courses').insert({ name })
  return response.json()
})

// PUT - atualizar
app.put('/courses/:id', async (request, response) => {
  const { id } = request.params
  const { name } = request.body
  await knex('courses').update({ name }).where({ id })
  return response.json()
})
```

## Teste no Insomnia

```
Metodo: PUT
URL: http://localhost:3333/courses/2
Body (JSON):
{
  "name": "CSS"
}

Resposta esperada: Status 200 OK
```