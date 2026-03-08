# Code Examples: API de Restaurante com Express, Zod e Knex

## Estrutura tipica do projeto construido

```
restaurant-api/
├── src/
│   ├── server.js          # Express app setup
│   ├── routes/            # Route definitions
│   ├── controllers/       # Request handlers
│   ├── validations/       # Zod schemas
│   └── database/
│       ├── knexfile.js    # Knex configuration
│       ├── migrations/    # Database migrations
│       └── seeds/         # Seed data
├── package.json
└── README.md
```

## Express — Setup basico da API

```javascript
const express = require('express')
const routes = require('./routes')

const app = express()
app.use(express.json())
app.use(routes)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## Zod — Validacao de entrada

```javascript
const { z } = require('zod')

const createDishSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio'),
  description: z.string().optional(),
  price: z.number().positive('Preco deve ser positivo'),
  category: z.enum(['entrada', 'principal', 'sobremesa', 'bebida']),
})

// No controller
function createDish(request, response) {
  const result = createDishSchema.safeParse(request.body)

  if (!result.success) {
    return response.status(400).json({ errors: result.error.flatten() })
  }

  const validatedDish = result.data
  // ... salvar no banco
}
```

## Knex — Query Builder

### Migration

```javascript
exports.up = function (knex) {
  return knex.schema.createTable('dishes', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('description')
    table.decimal('price', 10, 2).notNullable()
    table.string('category').notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('dishes')
}
```

### Queries com Knex

```javascript
const knex = require('../database')

// Listar todos
const dishes = await knex('dishes').select('*')

// Buscar por id
const dish = await knex('dishes').where({ id }).first()

// Inserir
const [id] = await knex('dishes').insert({
  name: 'Feijoada',
  price: 35.90,
  category: 'principal',
})

// Atualizar
await knex('dishes').where({ id }).update({ price: 39.90 })

// Deletar
await knex('dishes').where({ id }).delete()
```

## Controller completo com validacao

```javascript
const { z } = require('zod')
const knex = require('../database')

const dishSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.enum(['entrada', 'principal', 'sobremesa', 'bebida']),
})

class DishesController {
  async index(request, response) {
    const dishes = await knex('dishes').select('*')
    return response.json(dishes)
  }

  async create(request, response) {
    const result = dishSchema.safeParse(request.body)

    if (!result.success) {
      return response.status(400).json({ errors: result.error.flatten() })
    }

    const [id] = await knex('dishes').insert(result.data)
    return response.status(201).json({ id })
  }

  async update(request, response) {
    const { id } = request.params
    const result = dishSchema.partial().safeParse(request.body)

    if (!result.success) {
      return response.status(400).json({ errors: result.error.flatten() })
    }

    const updated = await knex('dishes').where({ id }).update(result.data)

    if (!updated) {
      return response.status(404).json({ error: 'Prato nao encontrado' })
    }

    return response.json({ message: 'Atualizado com sucesso' })
  }

  async delete(request, response) {
    const { id } = request.params
    const deleted = await knex('dishes').where({ id }).delete()

    if (!deleted) {
      return response.status(404).json({ error: 'Prato nao encontrado' })
    }

    return response.json({ message: 'Removido com sucesso' })
  }
}

module.exports = new DishesController()
```

## Rotas organizadas

```javascript
const { Router } = require('express')
const DishesController = require('./controllers/DishesController')

const routes = Router()
const dishesController = new DishesController()

routes.get('/dishes', dishesController.index)
routes.post('/dishes', dishesController.create)
routes.put('/dishes/:id', dishesController.update)
routes.delete('/dishes/:id', dishesController.delete)

module.exports = routes
```