# Code Examples: For...of

## Exemplo 1: Iteracao basica (do instrutor)

```javascript
const students = ["Rodrigo", "Amanda", "John"]

// for...of — mostra os VALORES
for (const student of students) {
  console.log(student)
}
// Output:
// Rodrigo
// Amanda
// John

// for...in — mostra os INDICES (propriedades)
for (const index in students) {
  console.log(index)
}
// Output:
// 0
// 1
// 2
```

## Exemplo 2: Objeto nao-iteravel (erro demonstrado)

```javascript
const user = {
  name: "Rodrigo",
  email: "email.com"
}

// ERRO: TypeError: user is not iterable
for (const value of user) {
  console.log(value)
}
```

## Exemplo 3: Objeto dentro de array (solucao do instrutor)

```javascript
const user = {
  name: "Rodrigo",
  email: "email.com"
}

// Funciona: array e iteravel
for (const value of [user]) {
  console.log(value.name)  // "Rodrigo"
  console.log(value.email) // "email.com"
}
```

## Exemplo 4: Iterando valores de um objeto com Object.values()

```javascript
const user = {
  name: "Rodrigo",
  email: "email.com"
}

for (const value of Object.values(user)) {
  console.log(value)
}
// Output:
// Rodrigo
// email.com
```

## Exemplo 5: Iterando com Object.entries() para chave e valor

```javascript
const user = {
  name: "Rodrigo",
  email: "email.com"
}

for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`)
}
// Output:
// name: Rodrigo
// email: email.com
```

## Exemplo 6: Array de objetos (cenario real)

```javascript
const products = [
  { name: "Notebook", priceInCents: 350000 },
  { name: "Mouse", priceInCents: 8900 },
  { name: "Teclado", priceInCents: 15000 }
]

for (const product of products) {
  const priceFormatted = (product.priceInCents / 100).toFixed(2)
  console.log(`${product.name}: R$ ${priceFormatted}`)
}
```

## Exemplo 7: Usando break e continue (vantagem sobre forEach)

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Pula pares, para ao encontrar 7
for (const number of numbers) {
  if (number % 2 === 0) continue
  if (number === 7) break
  console.log(number)
}
// Output: 1, 3, 5
```

## Exemplo 8: Iterando sobre string

```javascript
const greeting = "Olá"

for (const char of greeting) {
  console.log(char)
}
// Output:
// O
// l
// á
```

## Exemplo 9: Iterando com indice usando entries()

```javascript
const colors = ["red", "green", "blue"]

for (const [index, color] of colors.entries()) {
  console.log(`${index}: ${color}`)
}
// Output:
// 0: red
// 1: green
// 2: blue
```