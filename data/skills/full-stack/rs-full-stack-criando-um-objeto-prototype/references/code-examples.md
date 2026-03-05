# Code Examples: Prototype Chain em JavaScript

## Exemplo 1: Objeto literal (da aula)

```javascript
const address = { city: "São Paulo", country: "Brasil" }

// No console, console.dir mostra:
// ▶ Object
//   city: "São Paulo"
//   country: "Brasil"
//   ▶ [[Prototype]]: Object
//       ▶ constructor: ƒ Object()
//       ▶ hasOwnProperty: ƒ hasOwnProperty()
//       ▶ toString: ƒ toString()
//       ... (outros metodos de Object.prototype)
//       ▶ [[Prototype]]: null  ← FIM DA CADEIA

// Verificacao programatica:
console.log(Object.getPrototypeOf(address) === Object.prototype) // true
console.log(Object.getPrototypeOf(Object.prototype) === null)     // true
```

## Exemplo 2: Array (da aula)

```javascript
const users = ["Rodrigo", "João", "Maria"]

// console.dir(users) mostra:
// ▶ Array(3)
//   0: "Rodrigo"
//   1: "João"
//   2: "Maria"
//   length: 3
//   ▶ [[Prototype]]: Array(0)
//       ▶ concat: ƒ concat()
//       ▶ filter: ƒ filter()
//       ▶ map: ƒ map()
//       ... (metodos de Array.prototype)
//       ▶ [[Prototype]]: Object  ← segundo nivel
//           ▶ [[Prototype]]: null  ← FIM

// Verificacao:
console.log(Object.getPrototypeOf(users) === Array.prototype)       // true
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype) // true
console.log(Object.getPrototypeOf(Object.prototype) === null)        // true
```

## Exemplo 3: String com __proto__ (da aula)

```javascript
const username = "Rodrigo Gonçalves"

// console.dir(username) NAO mostra prototype diretamente
// Para visualizar, use __proto__:
console.dir(username.__proto__)
// ▶ String
//   ▶ charAt: ƒ charAt()
//   ▶ includes: ƒ includes()
//   ▶ split: ƒ split()
//   ... (metodos de String.prototype)
//   ▶ [[Prototype]]: Object
//       ▶ [[Prototype]]: null

// Cadeia completa:
console.log(username.__proto__ === String.prototype)                  // true
console.log(username.__proto__.__proto__ === Object.prototype)        // true
console.log(username.__proto__.__proto__.__proto__ === null)           // true
```

## Exemplo 4: Funcao para navegar toda a cadeia

```javascript
function logPrototypeChain(value) {
  let current = Object.getPrototypeOf(value)
  let level = 0
  while (current !== null) {
    console.log(`Nivel ${level}:`, current.constructor?.name || "Object")
    current = Object.getPrototypeOf(current)
    level++
  }
  console.log(`Nivel ${level}: null (fim da cadeia)`)
}

logPrototypeChain({})
// Nivel 0: Object
// Nivel 1: null (fim da cadeia)

logPrototypeChain([])
// Nivel 0: Array
// Nivel 1: Object
// Nivel 2: null (fim da cadeia)

logPrototypeChain("")
// Nivel 0: String
// Nivel 1: Object
// Nivel 2: null (fim da cadeia)

logPrototypeChain(42)
// Nivel 0: Number
// Nivel 1: Object
// Nivel 2: null (fim da cadeia)
```

## Exemplo 5: Comparando tipos diferentes

```javascript
// Todos convergem para Object.prototype → null
const values = [
  { name: "objeto", value: {} },
  { name: "array", value: [] },
  { name: "string", value: "" },
  { name: "number", value: 0 },
  { name: "function", value: function() {} },
  { name: "regex", value: /test/ },
  { name: "date", value: new Date() },
]

values.forEach(({ name, value }) => {
  let depth = 0
  let current = value
  while (Object.getPrototypeOf(current) !== null) {
    current = Object.getPrototypeOf(current)
    depth++
  }
  console.log(`${name}: ${depth} niveis ate null`)
})
// objeto: 1 niveis ate null
// array: 2 niveis ate null
// string: 2 niveis ate null
// number: 2 niveis ate null
// function: 2 niveis ate null
// regex: 2 niveis ate null
// date: 2 niveis ate null
```

## Exemplo 6: Object.create(null) — sem prototype

```javascript
const bareObject = Object.create(null)
bareObject.name = "sem prototype"

console.log(Object.getPrototypeOf(bareObject)) // null
console.log(bareObject.hasOwnProperty)          // undefined
console.log(bareObject.toString)                // undefined
// Este objeto nao herda NADA — util para dicionarios puros
```