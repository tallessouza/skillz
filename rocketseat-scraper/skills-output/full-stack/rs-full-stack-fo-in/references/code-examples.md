# Code Examples: For In

## Exemplo 1: Percorrendo propriedades de objeto (da aula)

```javascript
const person = {
  name: "Rodrigo",
  surname: "Goncalves",
  email: "rodrigo@email.com"
}

// Exibe nome da propriedade
for (let property in person) {
  console.log(property)
}
// Output:
// name
// surname
// email

// Exibe conteudo da propriedade
for (let property in person) {
  console.log(person[property])
}
// Output:
// Rodrigo
// Goncalves
// rodrigo@email.com
```

## Exemplo 2: Contando iteracoes (da aula — didatico)

```javascript
const person = {
  name: "Rodrigo",
  surname: "Goncalves",
  email: "rodrigo@email.com"
}

let steps = 1

for (let property in person) {
  console.log(`Volta: ${steps}`)
  console.log(property)
  console.log(person[property])
  steps++
}
// Output:
// Volta: 1
// name
// Rodrigo
// Volta: 2
// surname
// Goncalves
// Volta: 3
// email
// rodrigo@email.com
```

## Exemplo 3: For...in com array (da aula)

```javascript
const students = ["Rodrigo", "Joao", "Amanda"]

// Exibe indices
for (let index in students) {
  console.log(index)
}
// Output:
// 0
// 1
// 2

// Exibe elementos pelo indice
for (let index in students) {
  console.log(students[index])
}
// Output:
// Rodrigo
// Joao
// Amanda
```

## Exemplo 4: Exibindo chave e valor juntos

```javascript
const product = {
  name: "Notebook",
  price: 2500,
  brand: "Dell"
}

for (let key in product) {
  console.log(`${key}: ${product[key]}`)
}
// Output:
// name: Notebook
// price: 2500
// brand: Dell
```

## Exemplo 5: Construindo um novo objeto a partir de outro

```javascript
const original = {
  firstName: "Ana",
  lastName: "Silva",
  age: 28
}

const copy = {}

for (let property in original) {
  copy[property] = original[property]
}

console.log(copy)
// { firstName: "Ana", lastName: "Silva", age: 28 }
```

## Exemplo 6: Filtrando propriedades com for...in

```javascript
const config = {
  host: "localhost",
  port: 3000,
  debug: true,
  verbose: false
}

const booleanKeys = []

for (let key in config) {
  if (typeof config[key] === "boolean") {
    booleanKeys.push(key)
  }
}

console.log(booleanKeys)
// ["debug", "verbose"]
```

## Armadilha: notacao de ponto com variavel

```javascript
const user = { name: "Carlos", age: 30 }

for (let prop in user) {
  console.log(user.prop)  // undefined, undefined — ERRADO
  console.log(user[prop]) // "Carlos", 30 — CORRETO
}
```