# Code Examples: Classes em JavaScript

## Exemplo 1: Classe basica (do transcript)

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }

  makeSound() {
    return `${this.name} makes a sound`
  }
}

const animal = new Animal("Cat")
console.log(animal.makeSound()) // "Cat makes a sound"
```

### Passo a passo:
1. `class Animal` — declara o modelo
2. `constructor(name)` — recebe o nome ao instanciar
3. `this.name = name` — armazena no objeto
4. `makeSound()` — metodo que descreve comportamento
5. `new Animal("Cat")` — cria instancia, chama constructor automaticamente

## Exemplo 2: Heranca com extends (do transcript)

```javascript
class Dog extends Animal {
  makeSound() {
    return `${this.name} barks`
  }
}

const dog = new Dog("Rex")
console.log(dog.makeSound()) // "Rex barks"
console.log(dog.name)        // "Rex" (herdado de Animal)
```

### O que acontece:
- `Dog` nao define construtor proprio → usa o de `Animal` automaticamente
- `Dog` sobrescreve `makeSound()` → comportamento especifico
- `dog.name` funciona porque foi definido no construtor de `Animal`

## Exemplo 3: Heranca com construtor proprio

```javascript
class Cat extends Animal {
  constructor(name, indoor) {
    super(name)        // OBRIGATORIO: chama construtor do pai
    this.indoor = indoor
  }

  makeSound() {
    return `${this.name} meows`
  }

  describe() {
    const location = this.indoor ? "indoor" : "outdoor"
    return `${this.name} is an ${location} cat`
  }
}

const cat = new Cat("Mimi", true)
console.log(cat.makeSound()) // "Mimi meows"
console.log(cat.describe())  // "Mimi is an indoor cat"
```

## Exemplo 4: Comparacao prototype vs class

### Antes (prototype):
```javascript
function Vehicle(brand) {
  this.brand = brand
}

Vehicle.prototype.start = function() {
  return `${this.brand} is starting`
}

function Car(brand, model) {
  Vehicle.call(this, brand)
  this.model = model
}

Car.prototype = Object.create(Vehicle.prototype)
Car.prototype.constructor = Car

Car.prototype.describe = function() {
  return `${this.brand} ${this.model}`
}
```

### Depois (class):
```javascript
class Vehicle {
  constructor(brand) {
    this.brand = brand
  }

  start() {
    return `${this.brand} is starting`
  }
}

class Car extends Vehicle {
  constructor(brand, model) {
    super(brand)
    this.model = model
  }

  describe() {
    return `${this.brand} ${this.model}`
  }
}
```

Mesmo resultado, muito menos codigo, muito mais legivel.

## Exemplo 5: Multiplos niveis de heranca

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }

  eat() {
    return `${this.name} is eating`
  }
}

class Dog extends Animal {
  bark() {
    return `${this.name} barks!`
  }
}

class Puppy extends Dog {
  constructor(name) {
    super(name)
    this.isSmall = true
  }

  play() {
    return `${this.name} is playing!`
  }
}

const puppy = new Puppy("Buddy")
console.log(puppy.eat())   // "Buddy is eating"   (de Animal)
console.log(puppy.bark())  // "Buddy barks!"       (de Dog)
console.log(puppy.play())  // "Buddy is playing!"  (de Puppy)
```

## Exemplo 6: Metodos estaticos

```javascript
class MathUtils {
  static sum(a, b) {
    return a + b
  }

  static multiply(a, b) {
    return a * b
  }
}

// Chamado na classe, nao na instancia
console.log(MathUtils.sum(2, 3))      // 5
console.log(MathUtils.multiply(4, 5)) // 20
```

## Exemplo 7: Getters e Setters

```javascript
class User {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  set fullName(value) {
    const [first, last] = value.split(" ")
    this.firstName = first
    this.lastName = last
  }
}

const user = new User("John", "Doe")
console.log(user.fullName)     // "John Doe" (getter)
user.fullName = "Jane Smith"   // setter
console.log(user.firstName)    // "Jane"
```