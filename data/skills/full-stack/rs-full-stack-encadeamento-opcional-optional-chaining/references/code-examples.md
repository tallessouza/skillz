# Code Examples: Encadeamento Opcional (Optional Chaining)

## Objeto base usado na aula

```javascript
const user = {
  id: 1,
  name: "Rodrigo",
  address: {
    street: "Avenida Brasil",
    city: "São Paulo",
    geo: {
      latitude: 47.8080,
      longitude: 17.5674
    }
  },
  message() {
    return `Olá, ${this.name}!`
  }
}
```

## Cenario 1: Acessando propriedades normalmente (tudo existe)

```javascript
console.log(user)              // objeto completo
console.log(user.name)         // "Rodrigo"
console.log(user.address.street) // "Avenida Brasil"
```

## Cenario 2: Propriedade address removida (simulando campo opcional)

```javascript
const user = {
  id: 1,
  name: "Rodrigo"
  // address nao existe
}

// SEM optional chaining — ERRO
console.log(user.address.street)
// TypeError: Cannot read properties of undefined (reading 'street')

// COM optional chaining — retorna undefined
console.log(user.address?.street)   // undefined
console.log(user?.address)          // undefined
console.log(user.address?.street)   // undefined
```

## Cenario 3: Metodo opcional

```javascript
const user = {
  id: 1,
  name: "Rodrigo"
  // message() nao existe
}

// SEM optional chaining — ERRO
user.message()
// TypeError: user.message is not a function

// COM optional chaining — nao executa, sem erro
user.message?.()
// nada acontece
```

## Cenario 4: Metodo existe e e executado

```javascript
const user = {
  id: 1,
  name: "Rodrigo",
  message() {
    return `Olá, ${this.name}!`
  }
}

user.message?.()  // "Olá, Rodrigo!"
// Funciona normalmente quando o metodo existe
```

## Variacoes praticas adicionais

### Combinando com nullish coalescing (??)

```javascript
const city = user.address?.city ?? "Cidade nao informada"
const photo = user.profile?.avatar?.url ?? "/default-avatar.png"
```

### Em arrays de objetos

```javascript
const users = [
  { id: 1, name: "Rodrigo", address: { city: "São Paulo" } },
  { id: 2, name: "Maria" }  // sem address
]

users.map(user => ({
  name: user.name,
  city: user.address?.city ?? "Nao informado"
}))
// [{ name: "Rodrigo", city: "São Paulo" }, { name: "Maria", city: "Nao informado" }]
```

### Em respostas de API

```javascript
const response = await fetch("/api/user/1")
const data = await response.json()

const street = data?.user?.address?.street
const lat = data?.user?.address?.geo?.latitude
const greeting = data?.user?.greet?.()
```

### Com bracket notation

```javascript
const key = "address"
const street = user?.[key]?.street
```

### Em callbacks opcionais

```javascript
function fetchUser(id, onSuccess, onError) {
  try {
    const user = database.find(id)
    onSuccess?.(user)  // so chama se onSuccess foi passado
  } catch (error) {
    onError?.(error)   // so chama se onError foi passado
  }
}

// Pode chamar sem os callbacks
fetchUser(1)
```