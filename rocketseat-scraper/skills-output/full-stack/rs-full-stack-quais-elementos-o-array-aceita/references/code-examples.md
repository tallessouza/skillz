# Code Examples: Elementos que um Array Aceita

## Exemplo base da aula

```javascript
const myArray = [
  "um texto",           // índice 0 — string
  10,                   // índice 1 — number
  true,                 // índice 2 — boolean
  function () {         // índice 3 — function
    console.log("função dentro do array")
  },
  {                     // índice 4 — object
    name: "Rodrigo",
    email: "rodrigo@email.com"
  }
]

// Acessando string
console.log(myArray[0]) // "um texto"

// Acessando number
console.log(myArray[1]) // 10

// Acessando boolean
console.log(myArray[2]) // true

// Executando function (sem console.log externo, pois a função já tem)
myArray[3]() // "função dentro do array"

// Acessando propriedades do object
console.log(myArray[4].name)  // "Rodrigo"
console.log(myArray[4].email) // "rodrigo@email.com"
```

## Variação: Arrow functions no array

```javascript
const operations = [
  (a, b) => a + b,
  (a, b) => a - b,
  (a, b) => a * b,
  (a, b) => a / b
]

console.log(operations[0](10, 5)) // 15
console.log(operations[1](10, 5)) // 5
console.log(operations[2](10, 5)) // 50
console.log(operations[3](10, 5)) // 2
```

## Variação: Objetos complexos no array

```javascript
const users = [
  { name: "Ana", age: 28, active: true },
  { name: "Bruno", age: 35, active: false },
  { name: "Carla", age: 22, active: true }
]

// Acessando propriedade de um objeto específico
console.log(users[0].name)   // "Ana"
console.log(users[1].active) // false
console.log(users[2].age)    // 22
```

## Variação: Arrays dentro de arrays

```javascript
const mixed = [
  "texto",
  [1, 2, 3],
  { key: "value" }
]

console.log(mixed[0])       // "texto"
console.log(mixed[1][0])    // 1
console.log(mixed[1][2])    // 3
console.log(mixed[2].key)   // "value"
```

## Variação: Usando typeof para verificar o tipo

```javascript
const myArray = ["hello", 42, true, function() {}, { a: 1 }]

myArray.forEach((element, index) => {
  console.log(`Índice ${index}: tipo = ${typeof element}`)
})
// Índice 0: tipo = string
// Índice 1: tipo = number
// Índice 2: tipo = boolean
// Índice 3: tipo = function
// Índice 4: tipo = object
```

## Variação: Função que retorna valor dentro do array

```javascript
const arr = [
  "static value",
  () => new Date().toLocaleDateString(),
  () => Math.random()
]

console.log(arr[0])    // "static value"
console.log(arr[1]())  // data atual (ex: "01/03/2026")
console.log(arr[2]())  // número aleatório (ex: 0.7234...)
```

## Padrão prático: Middleware/pipeline

```javascript
const middlewares = [
  (req) => { req.timestamp = Date.now(); return req },
  (req) => { req.authenticated = true; return req },
  (req) => { console.log("Request processed:", req); return req }
]

let request = { url: "/api/users" }
for (const middleware of middlewares) {
  request = middleware(request)
}
// request = { url: "/api/users", timestamp: ..., authenticated: true }
```