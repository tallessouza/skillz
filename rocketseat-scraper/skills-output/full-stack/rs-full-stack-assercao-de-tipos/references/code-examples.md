# Code Examples: Asserção de Tipos

## Exemplo 1: Basico da aula (objeto vazio)

```typescript
// Definir o tipo primeiro — SEMPRE antes de usar
type UserResponse = {
  id: number
  name: string
  avatar: string
}

// Sem assertion: TypeScript nao sabe o que tem dentro
let semAssertion = {}
// semAssertion. → nenhuma propriedade sugerida

// Com assertion: TypeScript reconhece as propriedades
let userResponse = {} as UserResponse
// userResponse. → avatar, id, name aparecem
```

## Exemplo 2: Consumo de API (caso de uso principal)

```typescript
type UserResponse = {
  id: number
  name: string
  avatar: string
}

// Sem assertion
async function fetchUserSemAssertion() {
  const response = await fetch('/api/users/1')
  const data = await response.json() // tipo: any
  console.log(data.name) // sem autocomplete, sem verificacao
}

// Com assertion
async function fetchUserComAssertion() {
  const response = await fetch('/api/users/1')
  const data = await response.json() as UserResponse
  console.log(data.name) // autocomplete funciona, tipo verificado
}
```

## Exemplo 3: Lista de objetos da API

```typescript
type Product = {
  id: number
  title: string
  priceInCents: number
}

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products')
  const products = await response.json() as Product[]

  // Agora TypeScript sabe que e um array de Product
  products.forEach(product => {
    console.log(product.title) // autocomplete funciona
  })

  return products
}
```

## Exemplo 4: Assertion com DOM

```typescript
// getElementById retorna HTMLElement | null
// Voce sabe que e um canvas
const canvas = document.getElementById('game') as HTMLCanvasElement
const context = canvas.getContext('2d') // metodo especifico de canvas disponivel
```

## Exemplo 5: Assertion vs Generics (preferencia)

```typescript
type User = {
  id: number
  name: string
}

// Abordagem com assertion
const data = await response.json() as User

// Abordagem com generic (quando a funcao suporta)
// Mais seguro — tipo propagado desde a chamada
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return response.json() as T
}

const user = await fetchJson<User>('/api/users/1')
// user ja e tipado como User
```

## Exemplo 6: Assertion parcial em testes

```typescript
type Config = {
  apiUrl: string
  apiKey: string
  timeout: number
  retries: number
  debug: boolean
}

// Em testes, voce nao precisa preencher tudo
const mockConfig = {
  apiUrl: 'http://localhost',
  apiKey: 'test-key',
} as Config

// Util para testes, mas cuidado: timeout, retries, debug sao undefined em runtime
```

## Exemplo 7: Quando NAO usar assertion

```typescript
// ERRADO: forcar tipo incompativel
const value: string = "42"
// const num = value as number  // TypeScript vai reclamar

// ERRADO: silenciar erros com any
const response = getResponse()
// const data = response as any  // Perde toda seguranca

// CERTO: usar type guard para narrowing
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj
}

const data: unknown = await response.json()
if (isUser(data)) {
  console.log(data.name) // tipo narrowed para User, seguro
}
```