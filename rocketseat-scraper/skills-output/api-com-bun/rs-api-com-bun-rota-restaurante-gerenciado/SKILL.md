---
name: rs-api-com-bun-rota-restaurante-gerenciado
description: "Applies authenticated resource ownership pattern when building API routes that return data owned by the logged-in user. Use when user asks to 'create an API route', 'get managed resource', 'return user-owned data', or 'build authenticated endpoint'. Enforces getCurrentUser extraction, undefined-check with descriptive error, and query-by-ownership-id pattern. Make sure to use this skill whenever creating routes that fetch resources belonging to the authenticated user. Not for public routes, listing endpoints, or authentication/login flows."
---

# Rota de Recurso Gerenciado pelo Usuario Autenticado

> Ao criar rotas que retornam recursos pertencentes ao usuario logado, extraia o ID de ownership do token, valide que existe, e busque o recurso por esse ID.

## Rules

1. **Extraia o ID de ownership do token** — use `getCurrentUser()` e desestruture o campo especifico (ex: `restaurantId`), porque o token ja carrega a relacao usuario-recurso
2. **Valide undefined antes de consultar** — se o ID de ownership pode ser `undefined`, lance erro descritivo antes do query, porque evita queries desnecessarias e da feedback claro
3. **Use mensagem de erro sobre o papel, nao sobre o dado** — `"user is not a manager"` nao `"restaurantId is undefined"`, porque o consumidor da API precisa entender o contexto de negocio
4. **Busque por findFirst com eq no ID** — use `db.query.{table}.findFirst({ where: eq(fields.id, ownershipId) })`, porque ownership e sempre 1:1
5. **Nomeie a variavel pelo contexto** — `managedRestaurant` nao `restaurant` ou `data`, porque explicita a relacao de ownership

## How to write

### Rota de recurso gerenciado

```typescript
export const getManagedRestaurant = new Elysia().use(auth).get(
  '/managed-restaurant',
  async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new Error('User is not a manager.')
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    return { managedRestaurant }
  }
)
```

## Example

**Before (sem validacao de ownership):**
```typescript
// Busca restaurante sem verificar se usuario gerencia
const restaurant = await db.query.restaurants.findFirst({
  where: eq(fields.id, someId)
})
return { restaurant }
```

**After (com pattern de ownership):**
```typescript
const { restaurantId } = await getCurrentUser()

if (!restaurantId) {
  throw new Error('User is not a manager.')
}

const managedRestaurant = await db.query.restaurants.findFirst({
  where(fields, { eq }) {
    return eq(fields.id, restaurantId)
  },
})

return { managedRestaurant }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recurso pertence ao usuario logado (1:1) | Extraia ID do token, valide, busque com `findFirst` |
| ID de ownership pode ser undefined | Lance erro descritivo ANTES do query |
| Rota similar a uma existente (ex: getProfile) | Copie a estrutura, troque userId por ownershipId |
| Registrar rota no server | `app.use(getManagedRestaurant)` no arquivo principal |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `throw new Error('restaurantId is undefined')` | `throw new Error('User is not a manager.')` |
| `const data = await db.query...` | `const managedRestaurant = await db.query...` |
| Buscar sem validar undefined primeiro | `if (!restaurantId) throw` antes do query |
| Receber ID via parametro de rota para recurso owned | Extrair do token via `getCurrentUser()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
