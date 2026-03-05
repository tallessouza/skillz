# Code Examples: Rotas no Elysia com Drizzle ORM

## Exemplo completo da aula: Cadastro de restaurante

```typescript
import { db } from '../db/connection'
import { users, restaurants } from '../db/schema'

app.post('/restaurants', async ({ body, set }) => {
  // Cast temporário — será tipado com Elysia schema na próxima aula
  const { restaurantName, managerName, email, phone } = body as any

  // 1. Inserir o manager primeiro (pai na relação)
  const [manager] = await db
    .insert(users)
    .values({
      name: managerName,
      email,
      phone,
      role: 'manager', // padrão na tabela é 'customer', precisa explicitar
    })
    .returning({ id: users.id })
  // returning() sempre retorna array, desestruture com [manager]
  // Se quiser todos os campos: .returning() sem argumentos

  // 2. Inserir o restaurante com o managerId do passo anterior
  await db.insert(restaurants).values({
    name: restaurantName,
    managerId: manager.id,
  })

  // 3. Responder com 204 No Content (sucesso sem corpo)
  set.status = 204
})
```

## Testando com HTTPie

```bash
http POST localhost:3333/restaurants \
  restaurantName="Skillz Pizza" \
  managerName="Diego" \
  email="diego@skillz.com.br" \
  phone="11999999999"
# Resposta esperada: HTTP/1.1 204 No Content
```

## Variação: returning() com todos os campos

```typescript
// Se precisar de todos os dados do registro inserido:
const [manager] = await db
  .insert(users)
  .values({ name: managerName, email, phone, role: 'manager' })
  .returning()
// manager agora tem: id, name, email, phone, role, createdAt, etc.
```

## Variação: Rota que retorna o recurso criado (201)

```typescript
app.post('/restaurants', async ({ body, set }) => {
  const { restaurantName, managerName, email, phone } = body as any

  const [manager] = await db
    .insert(users)
    .values({ name: managerName, email, phone, role: 'manager' })
    .returning({ id: users.id })

  const [restaurant] = await db
    .insert(restaurants)
    .values({ name: restaurantName, managerId: manager.id })
    .returning()

  set.status = 201
  return restaurant // retorna o restaurante criado
})
```

## Contexto completo do handler Elysia

```typescript
app.get('/debug', async ({ body, cookie, headers, params, path, query, request, set, store }) => {
  console.log('Body:', body)           // corpo da requisição
  console.log('Cookies:', cookie)       // cookies
  console.log('Headers:', headers)      // cabeçalhos HTTP
  console.log('Params:', params)        // :id da URL
  console.log('Path:', path)            // /debug
  console.log('Query:', query)          // ?page=1&limit=10
  console.log('Request:', request.url)  // objeto Request nativo
  console.log('Store:', store)          // estado compartilhado entre middlewares

  set.status = 200
  return { ok: true }
})
```

## Padrão: Rota com parâmetro de URL

```typescript
app.get('/restaurants/:id', async ({ params, set }) => {
  const restaurant = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, params.id))

  if (!restaurant.length) {
    set.status = 404
    return { message: 'Restaurant not found' }
  }

  return restaurant[0]
})
```

## Verificando no Drizzle Studio

```bash
bun run drizzle-kit studio
# ou
bunx drizzle-kit studio
# Abre interface visual para verificar os dados inseridos
```