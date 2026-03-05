# Code Examples: Intersecção de Tipos

## Exemplo base da aula

```typescript
// Type base com propriedades comuns
type Person = {
  id: number
  name: string
}

// Teacher = Person + propriedades específicas
type Teacher = Person & {
  subjects: string[]
}

// Student = Person + propriedades específicas
type Student = Person & {
  age: number
}

let teacher: Teacher
let student: Student

// teacher tem: id, name, subjects
// student tem: id, name, age
```

## Demonstração do problema (sem intersecção)

```typescript
type TeacherWithout = {
  subjects: string[]
}

let t: TeacherWithout
// t. → só subjects disponível
// id e name NÃO existem
```

## Variação: múltiplas composições

```typescript
type HasTimestamps = {
  createdAt: Date
  updatedAt: Date
}

type HasId = {
  id: number
}

type BaseEntity = HasId & HasTimestamps

type Product = BaseEntity & {
  name: string
  priceInCents: number
}

type Order = BaseEntity & {
  items: Product[]
  total: number
}
```

## Variação: composição com objetos inline

```typescript
type Authenticated = {
  token: string
  expiresAt: Date
}

type AuthenticatedUser = Person & Authenticated & {
  roles: string[]
}
// Tem: id, name, token, expiresAt, roles
```

## Variação: uso em parâmetros de função

```typescript
type Person = {
  id: number
  name: string
}

type Student = Person & {
  age: number
}

function enrollStudent(student: Student): void {
  console.log(`Enrolling ${student.name}, age ${student.age}`)
  // Acesso a id, name, age — todos disponíveis
}
```

## Variação: intersecção para API responses

```typescript
type ApiMeta = {
  requestId: string
  timestamp: number
}

type UsersResponse = ApiMeta & {
  users: Person[]
  total: number
}

type OrdersResponse = ApiMeta & {
  orders: Order[]
  page: number
}
// Ambos têm requestId e timestamp sem repetição
```