# Code Examples: Herança e Cadeia de Protótipos

## Exemplo 1: Visualizando a cadeia de um array (do instrutor)

```javascript
const names = ["Rodrigo", "João", "Ana"]

// Verificando a cadeia:
console.log(Object.getPrototypeOf(names) === Array.prototype)        // true
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype)  // true
console.log(Object.getPrototypeOf(Object.prototype) === null)        // true

// Cadeia: names → Array.prototype → Object.prototype → null
```

## Exemplo 2: Criando herança com Object.create

```javascript
const animal = {
  speak() {
    return `${this.name} faz um som`
  }
}

const dog = Object.create(animal)
dog.name = "Rex"
dog.bark = function() {
  return `${this.name} late: Au au!`
}

console.log(dog.bark())   // "Rex late: Au au!" (propriedade própria)
console.log(dog.speak())  // "Rex faz um som" (herdada via prototype)

// Cadeia: dog → animal → Object.prototype → null
```

## Exemplo 3: Class como syntax sugar

```javascript
// Com class (syntax sugar):
class Vehicle {
  constructor(brand) {
    this.brand = brand
  }
  describe() {
    return `Veículo: ${this.brand}`
  }
}

class Car extends Vehicle {
  constructor(brand, model) {
    super(brand)
    this.model = model
  }
  describe() {
    return `Carro: ${this.brand} ${this.model}`
  }
}

const car = new Car("Toyota", "Corolla")

// Por baixo, a cadeia é:
// car → Car.prototype → Vehicle.prototype → Object.prototype → null
console.log(Object.getPrototypeOf(car) === Car.prototype)                    // true
console.log(Object.getPrototypeOf(Car.prototype) === Vehicle.prototype)      // true
console.log(Object.getPrototypeOf(Vehicle.prototype) === Object.prototype)   // true
```

## Exemplo 4: hasOwnProperty vs propriedades herdadas

```javascript
const base = { shared: true }
const instance = Object.create(base)
instance.own = "mine"

console.log(instance.own)      // "mine"
console.log(instance.shared)   // true (herdada)

console.log(instance.hasOwnProperty("own"))     // true
console.log(instance.hasOwnProperty("shared"))  // false (não é própria)

// Object.keys retorna apenas próprias
console.log(Object.keys(instance))  // ["own"]
```

## Exemplo 5: Shadowing de propriedades

```javascript
const parent = {
  greet() { return "Olá do parent" }
}

const child = Object.create(parent)

console.log(child.greet())  // "Olá do parent" (percorre cadeia)

// Shadowing: definir mesma propriedade no child
child.greet = function() { return "Olá do child" }

console.log(child.greet())  // "Olá do child" (para no próprio objeto)

// O parent não foi alterado
console.log(parent.greet()) // "Olá do parent"
```

## Exemplo 6: Percorrendo a cadeia manualmente

```javascript
function getPrototypeChain(obj) {
  const chain = []
  let current = obj

  while (current !== null) {
    chain.push(current)
    current = Object.getPrototypeOf(current)
  }

  chain.push(null) // final da cadeia
  return chain
}

const names = ["Rodrigo", "João"]
const chain = getPrototypeChain(names)
// [["Rodrigo","João"], Array.prototype, Object.prototype, null]
```

## Exemplo 7: Por que for...in pode surpreender

```javascript
const base = { inherited: true }
const obj = Object.create(base)
obj.own = "value"

// for...in percorre TODA a cadeia
for (const key in obj) {
  console.log(key)
  // "own" (própria)
  // "inherited" (herdada!)
}

// Filtrar apenas próprias:
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key)  // apenas "own"
  }
}

// Ou usar Object.keys (mais moderno):
Object.keys(obj).forEach(key => console.log(key))  // apenas "own"
```

## Exemplo 8: Diferentes tipos e suas cadeias

```javascript
// String
const str = "hello"
// str (primitivo, boxing) → String.prototype → Object.prototype → null

// Function
function greet() {}
// greet → Function.prototype → Object.prototype → null

// RegExp
const regex = /abc/
// regex → RegExp.prototype → Object.prototype → null

// Date
const now = new Date()
// now → Date.prototype → Object.prototype → null

// Todos convergem para Object.prototype → null
```