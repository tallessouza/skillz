# Code Examples: Sobrescrita de Métodos

## Exemplo base da aula

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }

  makeNoise() {
    console.log("Algum som genérico do animal")
  }
}

class Dog extends Animal {
  makeNoise() {
    console.log("Woof! Woof! Woof!")
  }
}

class Cat extends Animal {
  makeNoise() {
    console.log("Miau! Miau!")
  }
}

const dog = new Dog("Rex")
const cat = new Cat("Mimi")

dog.makeNoise() // Woof! Woof! Woof!
cat.makeNoise() // Miau! Miau!
```

## Variação: métodos específicos por classe

```javascript
class Dog extends Animal {
  makeNoise() {
    console.log("Woof!")
  }

  fetch(item) {
    console.log(`${this.name} buscou o ${item}!`)
  }
}

class Cat extends Animal {
  makeNoise() {
    console.log("Miau!")
  }

  purr() {
    console.log(`${this.name} está ronronando...`)
  }
}

const dog = new Dog("Rex")
dog.fetch("graveto") // Rex buscou o graveto!

const cat = new Cat("Luna")
cat.purr() // Luna está ronronando...

// dog.purr() → TypeError: dog.purr is not a function
// cat.fetch("bola") → TypeError: cat.fetch is not a function
```

## Variação: sobrescrita com super

```javascript
class Animal {
  describe() {
    return `Animal: ${this.name}`
  }
}

class Dog extends Animal {
  describe() {
    return `${super.describe()} (Cachorro)`
  }
}

const dog = new Dog("Rex")
console.log(dog.describe()) // Animal: Rex (Cachorro)
```

## Variação: múltiplos métodos sobrescritos

```javascript
class Vehicle {
  constructor(brand) {
    this.brand = brand
  }

  start() {
    console.log("Veículo ligando...")
  }

  fuelType() {
    return "combustível genérico"
  }
}

class ElectricCar extends Vehicle {
  start() {
    console.log(`${this.brand} ligando silenciosamente...`)
  }

  fuelType() {
    return "elétrico"
  }

  chargeBattery() {
    console.log(`${this.brand} carregando bateria...`)
  }
}

class GasCar extends Vehicle {
  start() {
    console.log(`${this.brand} ligando com ronco do motor...`)
  }

  fuelType() {
    return "gasolina"
  }
}
```

## Sem sobrescrita (problema)

```javascript
class Dog extends Animal {}
class Cat extends Animal {}

const dog = new Dog("Rex")
const cat = new Cat("Luna")

// Ambos exibem a mesma coisa — inútil
dog.makeNoise() // "Algum som genérico do animal"
cat.makeNoise() // "Algum som genérico do animal"
```