# Code Examples: Tipagem em Objetos TypeScript

## 1. Objeto tipado com propriedades obrigatorias

```typescript
// Declaracao com tipo inline
let user: { name: string, age: number } = {
  name: "Rodrigo",
  age: 17
}

// ERRO: faltando 'age'
let user2: { name: string, age: number } = {
  name: "Rodrigo"
  // Error: Property 'age' is missing
}

// ERRO: tipo errado
let user3: { name: string, age: number } = {
  name: "Rodrigo",
  age: "dezessete" // Error: Type 'string' is not assignable to type 'number'
}
```

## 2. Propriedade opcional com `?`

```typescript
let user: { name: string, age: number, avatarUrl?: string } = {
  name: "Rodrigo",
  age: 17
  // avatarUrl omitido — OK porque e opcional
}

// Tambem valido com avatar
let user2: { name: string, age: number, avatarUrl?: string } = {
  name: "Rodrigo",
  age: 17,
  avatarUrl: "https://example.com/avatar.png"
}
```

## 3. Acesso a propriedades

```typescript
let user: { name: string, age: number, avatarUrl?: string } = {
  name: "Rodrigo",
  age: 17
}

console.log(user.name)     // OK
console.log(user.age)      // OK
console.log(user.avatarUrl) // OK (pode ser undefined)
console.log(user.password)  // ERRO: Property 'password' does not exist
```

## 4. Funcao com parametros posicionais (forma tradicional)

```typescript
function signIn(email: string, password: string) {
  // Logica de conectar usuario na aplicacao
}

signIn("rodrigo@email.com", "123")
```

## 5. Funcao com objeto desestruturado (forma recomendada)

```typescript
function signIn({ email, password }: { email: string, password: string }) {
  console.log("Usuario " + email + " conectado!")
}

signIn({ email: "rodrigo@email.com", password: "123" })

// ERRO: typo no nome da propriedade
signIn({ email: "rodrigo@email.com", pasword: "123" })
// Error: Did you mean 'password'?

// ERRO: propriedade extra
signIn({ email: "rodrigo@email.com", password: "123", avatar: "https://img.url" })
// Error: 'avatar' does not exist in type

// ERRO: propriedade faltando
signIn({ email: "rodrigo@email.com" })
// Error: Property 'password' is missing
```

## 6. Funcao com objeto nomeado (sem desestruturar)

```typescript
function signIn(data: { email: string, password: string }) {
  console.log("Usuario " + data.email + " conectado!")
  // Acesso via data.email, data.password
}

signIn({ email: "rodrigo@email.com", password: "123" })
```

## 7. Variacoes praticas

### Objeto com mais propriedades

```typescript
let product: {
  name: string,
  priceInCents: number,
  description?: string,
  inStock: boolean
} = {
  name: "Camiseta",
  priceInCents: 4990,
  inStock: true
}
```

### Funcao retornando objeto tipado

```typescript
function createUser({ name, email }: { name: string, email: string }): { name: string, email: string, createdAt: Date } {
  return {
    name,
    email,
    createdAt: new Date()
  }
}
```

### Autocomplete em acao

```typescript
// Dentro de signIn({ ... }), pressionar Ctrl+Space mostra:
// - email
// - password
// O editor sabe exatamente o que o objeto aceita
```