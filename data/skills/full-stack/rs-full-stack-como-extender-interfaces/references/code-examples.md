# Code Examples: Como Estender Interfaces

## Exemplo base da aula

```typescript
// Interface base com propriedades comuns
interface Person {
  id: number
  name: string
}

// Teacher herda id e name, adiciona subjects
interface Teacher extends Person {
  subjects: string[]
}

// Student herda id e name, adiciona age
interface Student extends Person {
  age: number
}

let teacher: Teacher = { id: 1, name: "Rodrigo", subjects: ["JavaScript", "TypeScript"] }
let student: Student = { id: 2, name: "João", age: 23 }
```

## Variacao: adicionando propriedade na base

```typescript
interface Person {
  id: number
  name: string
  email: string  // Nova propriedade — reflete em Teacher E Student
}

// Agora teacher e student PRECISAM de email
let teacher: Teacher = { id: 1, name: "Rodrigo", email: "rodrigo@escola.com", subjects: ["JS"] }
let student: Student = { id: 2, name: "João", email: "joao@escola.com", age: 23 }
```

## Variacao: heranca multipla

```typescript
interface Identifiable {
  id: number
}

interface Nameable {
  name: string
}

// TypeScript permite estender multiplas interfaces
interface Teacher extends Identifiable, Nameable {
  subjects: string[]
}
```

## Variacao: heranca em cadeia

```typescript
interface Entity {
  id: number
  createdAt: Date
}

interface Person extends Entity {
  name: string
  email: string
}

interface Teacher extends Person {
  subjects: string[]
}

// Teacher tem: id, createdAt, name, email, subjects
```

## Variacao: contexto real — API Response

```typescript
interface ApiResponse {
  status: number
  timestamp: string
}

interface UserResponse extends ApiResponse {
  user: { id: number; name: string }
}

interface ErrorResponse extends ApiResponse {
  error: { code: string; message: string }
}
```

## Sem extends (para comparacao)

```typescript
// Abordagem sem extends — propriedades duplicadas
interface Teacher {
  id: number       // duplicado
  name: string     // duplicado
  subjects: string[]
}

interface Student {
  id: number       // duplicado
  name: string     // duplicado
  age: number
}
// Problema: adicionar email exige mudar AMBAS as interfaces manualmente
```