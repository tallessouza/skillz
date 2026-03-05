# Code Examples: Método find()

## Exemplo 1: Busca em array de números (da aula)

```javascript
const values = [5, 12, 8, 130, 44]

const found = values.find(value => value > 10)
console.log(found) // 12

// Por que 12 e não 130?
// Porque find() retorna o PRIMEIRO que atende.
// Ordem de verificação: 5(não) → 12(SIM, para aqui)
```

## Exemplo 2: Busca em array de objetos (da aula)

```javascript
const fruits = [
  { name: "apple", quantity: 23 },
  { name: "banana", quantity: 25 },
  { name: "orange", quantity: 52 },
]

// Busca por nome exato
const result = fruits.find(fruit => fruit.name === "banana")
console.log(result) // { name: "banana", quantity: 25 }

// Busca inexistente
const notFound = fruits.find(fruit => fruit.name === "watermelon")
console.log(notFound) // undefined

// Busca com string errada (plural vs singular)
const wrong = fruits.find(fruit => fruit.name === "bananas")
console.log(wrong) // undefined — match exato!
```

## Exemplo 3: Variações práticas

### Buscar usuário por ID
```javascript
const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Carol", role: "user" },
]

const admin = users.find(user => user.role === "admin")
// { id: 1, name: "Alice", role: "admin" }

const userById = users.find(user => user.id === 2)
// { id: 2, name: "Bob", role: "user" }
```

### Buscar com condição composta
```javascript
const products = [
  { name: "Laptop", price: 2500, inStock: true },
  { name: "Phone", price: 1200, inStock: false },
  { name: "Tablet", price: 800, inStock: true },
]

const affordableInStock = products.find(
  product => product.price < 1000 && product.inStock
)
// { name: "Tablet", price: 800, inStock: true }
```

### Tratar undefined com segurança
```javascript
const found = users.find(user => user.id === 999)

// Sem tratamento (perigoso):
// console.log(found.name) // TypeError: Cannot read property 'name' of undefined

// Com optional chaining:
console.log(found?.name) // undefined (sem erro)

// Com verificação explícita:
if (found) {
  console.log(found.name)
} else {
  console.log("Usuário não encontrado")
}
```

## Exemplo 4: find() vs filter() lado a lado

```javascript
const numbers = [5, 12, 8, 130, 44]

// find() → primeiro match
const first = numbers.find(n => n > 10)
// 12

// filter() → todos os matches
const all = numbers.filter(n => n > 10)
// [12, 130, 44]
```

## Exemplo 5: findIndex() complementar

```javascript
const fruits = [
  { name: "apple", quantity: 23 },
  { name: "banana", quantity: 25 },
  { name: "orange", quantity: 52 },
]

// find() → retorna o objeto
const fruit = fruits.find(f => f.name === "banana")
// { name: "banana", quantity: 25 }

// findIndex() → retorna a posição
const index = fruits.findIndex(f => f.name === "banana")
// 1

// Útil para remover:
fruits.splice(index, 1) // remove banana do array
```