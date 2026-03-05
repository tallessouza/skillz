# Code Examples: Cadastrando Módulos com Knex e SQLite

## 1. Rota POST para cadastrar módulo

```typescript
// server.ts
app.post('/modules', async (request, response) => {
  const { name, course_id } = request.body

  await knex('course_modules').insert({
    name,
    course_id,
  })

  return response.status(201).json()
})
```

**Corpo da requisição (Insomnia/Postman):**
```json
{
  "name": "Introdução a banco de dados",
  "course_id": 12
}
```

## 2. Rota GET para listar módulos

```typescript
app.get('/modules', async (request, response) => {
  const modules = await knex('course_modules').select()

  return response.json(modules)
})
```

**Resposta esperada:**
```json
[
  {
    "id": 1,
    "name": "Introdução a banco de dados",
    "course_id": 22
  },
  {
    "id": 2,
    "name": "Inserindo registros",
    "course_id": 22
  }
]
```

## 3. Migration com NOT NULL e foreign key

```typescript
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('course_modules', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table
      .integer('course_id')
      .notNullable()
      .references('id')
      .inTable('courses')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('course_modules')
}
```

## 4. Configuração do Knex com PRAGMA foreign_keys

```typescript
// knexfile.ts
import { Knex } from 'knex'

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './src/database/database.db',
  },
  pool: {
    afterCreate: (connection: any, done: Function) => {
      connection.run('PRAGMA foreign_keys = ON', done)
    },
  },
  useNullAsDefault: true,
  migrations: {
    directory: './src/database/migrations',
    extension: 'ts',
  },
}

export default config
```

## 5. Comandos de migration utilizados

```bash
# Executar migrations pendentes
npm run knex -- migrate:latest

# Desfazer migration específica (inclua extensão .ts!)
npm run knex -- migrate:down 20240101120000_create_course_modules.ts

# Listar migrations e seus status
npm run knex -- migrate:list

# Desfazer última migration executada
npm run knex -- migrate:rollback
```

## 6. Cenários de teste demonstrados

### Teste: INSERT sem course_id (sem NOT NULL)
```
POST /modules
Body: { "name": "Teste" }
→ 201 Created (course_id salvo como NULL) ❌ indesejado
```

### Teste: INSERT sem course_id (com NOT NULL)
```
POST /modules
Body: { "name": "Teste" }
→ 500 Error: NOT NULL constraint failed: course_modules.course_id ✅
```

### Teste: INSERT com course_id inexistente (sem PRAGMA)
```
POST /modules
Body: { "name": "Teste", "course_id": 54 }
→ 201 Created (registro órfão criado) ❌ indesejado
```

### Teste: INSERT com course_id inexistente (com PRAGMA)
```
POST /modules
Body: { "name": "Teste", "course_id": 54 }
→ 500 Error: FOREIGN KEY constraint failed ✅
```

### Teste: INSERT com course_id válido
```
POST /modules
Body: { "name": "Selecionando registros", "course_id": 22 }
→ 201 Created ✅
```