# Code Examples: Select com Join

## 1. Select basico sem join (ponto de partida)

```typescript
app.get("/courses/:id/modules", async (request, response) => {
  const courses = await knex("courses").select()
  return response.json(courses)
})
// Retorna todos os cursos com todas as colunas
```

## 2. Select com colunas especificas

```typescript
const courses = await knex("courses").select("id", "name")
// Retorna apenas id e name de cada curso
```

**Erro comum — colunas numa string so:**
```typescript
// ERRADO: isso nao funciona como esperado
const courses = await knex("courses").select("id, name")

// CORRETO: argumentos separados
const courses = await knex("courses").select("id", "name")
```

## 3. Join entre courses e course_modules

```typescript
const courses = await knex("courses")
  .select()
  .join("course_modules", "courses.id", "course_modules.course_id")
// Retorna todas as colunas de ambas as tabelas para registros relacionados
```

## 4. Join com alias para evitar ambiguidade

```typescript
const modules = await knex("courses")
  .select(
    "course_modules.id as module_id",
    "course_modules.name as module",
    "courses.id as course_id",
    "courses.name as course"
  )
  .join("course_modules", "courses.id", "course_modules.course_id")
```

**Resultado:**
```json
[
  {
    "module_id": 5,
    "module": "Listar registro",
    "course_id": 22,
    "course": "Banco de dados"
  },
  {
    "module_id": 6,
    "module": "Banco de dados relacional",
    "course_id": 22,
    "course": "Banco de dados"
  },
  {
    "module_id": 7,
    "module": "Seletores",
    "course_id": 14,
    "course": "CSS"
  }
]
```

## 5. Variacao: filtrando por curso especifico

```typescript
app.get("/courses/:id/modules", async (request, response) => {
  const { id } = request.params

  const modules = await knex("courses")
    .select(
      "course_modules.id as module_id",
      "course_modules.name as module",
      "courses.name as course"
    )
    .join("course_modules", "courses.id", "course_modules.course_id")
    .where("courses.id", id)

  return response.json(modules)
})
```

## 6. Variacao: left join para incluir cursos sem modulos

```typescript
// INNER JOIN: so retorna cursos que TEM modulos
const withModules = await knex("courses")
  .select("courses.name as course", "course_modules.name as module")
  .join("course_modules", "courses.id", "course_modules.course_id")

// LEFT JOIN: retorna TODOS os cursos, mesmo sem modulos
const allCourses = await knex("courses")
  .select("courses.name as course", "course_modules.name as module")
  .leftJoin("course_modules", "courses.id", "course_modules.course_id")
```

## 7. Variacao: multiplos joins

```typescript
// Conectando tres tabelas
const fullData = await knex("courses")
  .select(
    "courses.name as course",
    "course_modules.name as module",
    "lessons.name as lesson"
  )
  .join("course_modules", "courses.id", "course_modules.course_id")
  .join("lessons", "course_modules.id", "lessons.module_id")
```