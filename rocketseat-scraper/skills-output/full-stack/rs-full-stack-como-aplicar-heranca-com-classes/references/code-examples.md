# Code Examples: Herança com Classes

## Exemplo 1: Herança básica (da aula)

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }

  makeNoise() {
    console.log("Som genérico do animal")
  }
}

class Dog extends Animal {}
class Cat extends Animal {}

const dog = new Dog("Bilu")
console.log(dog.name) // "Bilu"
dog.makeNoise() // "Som genérico do animal"

const cat = new Cat("Mel")
console.log(cat.name) // "Mel"
cat.makeNoise() // "Som genérico do animal"
```

## Exemplo 2: Classe filha com método sobrescrito

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }

  makeNoise() {
    console.log("Som genérico")
  }
}

class Dog extends Animal {
  makeNoise() {
    console.log("Au au!")
  }
}

class Cat extends Animal {
  makeNoise() {
    console.log("Miau!")
  }
}

const dog = new Dog("Bilu")
dog.makeNoise() // "Au au!"

const cat = new Cat("Mel")
cat.makeNoise() // "Miau!"
```

## Exemplo 3: Classe filha com construtor próprio e super()

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }

  makeNoise() {
    console.log("Som genérico")
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }

  makeNoise() {
    console.log(`${this.name} faz: Au au!`)
  }
}

const dog = new Dog("Bilu", "Vira-lata")
console.log(dog.name)  // "Bilu"
console.log(dog.breed) // "Vira-lata"
dog.makeNoise()         // "Bilu faz: Au au!"
```

## Exemplo 4: Chamando método do pai com super

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }

  describe() {
    return `Animal: ${this.name}`
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }

  describe() {
    const base = super.describe()
    return `${base}, Raça: ${this.breed}`
  }
}

const dog = new Dog("Bilu", "Golden")
console.log(dog.describe()) // "Animal: Bilu, Raça: Golden"
```

## Exemplo 5: Múltiplas propriedades na classe pai

```javascript
class Animal {
  constructor(name, age, size) {
    this.name = name
    this.age = age
    this.size = size
  }

  makeNoise() {
    console.log("Som genérico")
  }

  describe() {
    return `${this.name}, ${this.age} anos, porte ${this.size}`
  }
}

class Dog extends Animal {}
class Cat extends Animal {}

const dog = new Dog("Bilu", 3, "médio")
console.log(dog.describe()) // "Bilu, 3 anos, porte médio"

const cat = new Cat("Mel", 2, "pequeno")
console.log(cat.describe()) // "Mel, 2 anos, porte pequeno"
```

## Exemplo 6: Verificando herança com instanceof

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }
}

class Dog extends Animal {}

const dog = new Dog("Bilu")

console.log(dog instanceof Dog)    // true
console.log(dog instanceof Animal) // true
console.log(dog instanceof Object) // true
```