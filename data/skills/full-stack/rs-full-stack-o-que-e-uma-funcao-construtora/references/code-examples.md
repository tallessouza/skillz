# Code Examples: Funções Construtoras

## Exemplo 1: Funcao construtora classica (createProduct)

```javascript
// Abordagem classica: cria objeto explicito e retorna
function createProduct(name) {
  const product = {}

  product.name = name

  product.details = function () {
    console.log(`O nome do produto é ${this.name}`)
  }

  return product
}

// Instanciando dois produtos
const product1 = new createProduct("Teclado")
const product2 = new createProduct("Mouse")

console.log(product1.name)    // "Teclado"
product1.details()            // "O nome do produto é Teclado"

console.log(product2.name)    // "Mouse"
product2.details()            // "O nome do produto é Mouse"

// Sao objetos diferentes na memoria
console.log(product1 === product2) // false
```

## Exemplo 2: Funcoes construtoras nativas do JavaScript

```javascript
// String como funcao construtora
const myName = new String("Rodrigo")
console.log(myName) // [String: 'Rodrigo']

// Usando metodos de String em variaveis
const price = String(40.6)
const priceFormatted = price.replace(".", "")
console.log(priceFormatted) // "406"

// Date como funcao construtora
const date = new Date(2024, 1, 1)
console.log(date) // 2024-02-01T00:00:00.000Z (horario zerado porque nao foi definido)
```

## Exemplo 3: Abordagem com this (Person)

```javascript
// Abordagem com this: propriedades atribuidas diretamente
// Nota: JavaScript recomenda converter para class
function Person(name) {
  this.name = name
  this.message = function () {
    console.log(`Olá, ${this.name}`)
  }
}

const person1 = new Person("Rodrigo")
console.log(person1)       // Person { name: 'Rodrigo', message: [Function] }
console.log(person1.name)  // "Rodrigo"
person1.message()          // "Olá, Rodrigo"

const person2 = new Person("João")
console.log(person2)       // Person { name: 'João', message: [Function] }
console.log(person2.name)  // "João"
person2.message()          // "Olá, João"
```

## Variacao: Construtora com multiplas propriedades

```javascript
function createProduct(name, priceInCents, category) {
  const product = {}

  product.name = name
  product.priceInCents = priceInCents
  product.category = category

  product.details = function () {
    console.log(`${this.name} - R$ ${(this.priceInCents / 100).toFixed(2)} (${this.category})`)
  }

  product.applyDiscount = function (percentageDiscount) {
    this.priceInCents = Math.round(this.priceInCents * (1 - percentageDiscount / 100))
  }

  return product
}

const keyboard = new createProduct("Teclado Mecânico", 35000, "Periféricos")
keyboard.details()          // "Teclado Mecânico - R$ 350.00 (Periféricos)"
keyboard.applyDiscount(10)
keyboard.details()          // "Teclado Mecânico - R$ 315.00 (Periféricos)"
```

## Variacao: Equivalente com class (para comparacao)

```javascript
// A mesma Person, mas como class (recomendado pelo JS moderno)
class Person {
  constructor(name) {
    this.name = name
  }

  message() {
    console.log(`Olá, ${this.name}`)
  }
}

const person1 = new Person("Rodrigo")
person1.message() // "Olá, Rodrigo"
```

## Comparacao lado a lado

```javascript
// FUNCAO CONSTRUTORA (classica)     | FUNCAO CONSTRUTORA (this)     | CLASS
function createUser(name) {          | function User(name) {         | class User {
  const user = {}                    |   this.name = name            |   constructor(name) {
  user.name = name                   |   this.greet = function() {   |     this.name = name
  user.greet = function() {          |     console.log(this.name)    |   }
    console.log(this.name)           |   }                           |   greet() {
  }                                  | }                             |     console.log(this.name)
  return user                        |                               |   }
}                                    |                               | }
```