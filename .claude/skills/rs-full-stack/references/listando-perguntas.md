---
name: rs-full-stack-listando-perguntas
description: "Applies Prisma findMany pattern when implementing list/index endpoints in Node.js APIs. Use when user asks to 'list records', 'create an index endpoint', 'fetch all items', 'implement GET route', or 'query all rows with Prisma'. Ensures correct controller structure with async/await and Prisma client usage. Make sure to use this skill whenever generating CRUD list endpoints with Prisma ORM. Not for single-record queries, filtering, pagination, or complex Prisma queries."
---

# Listando Registros com Prisma (Index Endpoint)

> Ao criar um endpoint de listagem, use o metodo `findMany` do Prisma dentro da action `index` da controller, retornando diretamente o resultado.

## Rules

1. **Use `findMany` para listagem** — `prisma.model.findMany()` sem argumentos retorna todos os registros, porque e o metodo padrao do Prisma para queries de colecao
2. **Coloque na action `index`** — o metodo index da controller e responsavel por listar recursos, porque segue a convencao RESTful padrao
3. **Use `await` sempre** — queries Prisma sao assincronas, porque o acesso ao banco e I/O e deve ser non-blocking
4. **Retorne diretamente** — o resultado do findMany ja e um array serializavel, porque o Prisma retorna objetos JS puros

## How to write

### Index action na controller

```typescript
// Controller de listagem — action index
async index() {
  const questions = await prisma.questions.findMany()

  return questions
}
```

### Rota GET correspondente

```typescript
// Registrar rota GET para o recurso
router.get('/questions', questionsController.index)
```

## Example

**Before (incompleto):**
```typescript
async index() {
  // TODO: listar perguntas
}
```

**After (com Prisma findMany):**
```typescript
async index() {
  const questions = await prisma.questions.findMany()

  return questions
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listar todos os registros de um model | `prisma.model.findMany()` sem argumentos |
| Endpoint REST de listagem | Usar metodo HTTP GET + action index |
| Testar no Insomnia/Postman | GET `http://localhost:3333/{recurso}` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `prisma.questions.findFirst()` para listar | `prisma.questions.findMany()` |
| Callback sem await | `await prisma.questions.findMany()` |
| Query SQL raw para listagem simples | `prisma.model.findMany()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o padrao index e convencoes REST
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-listando-perguntas/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-listando-perguntas/references/code-examples.md)
