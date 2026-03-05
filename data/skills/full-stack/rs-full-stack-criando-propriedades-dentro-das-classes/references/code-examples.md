# Code Examples: Propriedades em Classes JavaScript

## Exemplo 1: Classe basica com uma propriedade (do instrutor)

```javascript
class Product {
  constructor(name) {
    this.name = name
  }
}

const product1 = new Product("Teclado")
const product2 = new Product("Mouse")

console.log(product1.name) // "Teclado"
console.log(product2.name) // "Mouse"
```

## Exemplo 2: Sem this — propriedade inacessivel

```javascript
class Product {
  constructor(name) {
    // name e apenas um parametro local
    // nao atribuido a instancia
  }
}

const product = new Product("Teclado")
console.log(product.name) // undefined
```

## Exemplo 3: Multiplas propriedades

```javascript
class Product {
  constructor(name, price, category) {
    this.name = name
    this.price = price
    this.category = category
  }
}

const keyboard = new Product("Teclado Mecanico", 350, "Perifericos")
console.log(keyboard.name)     // "Teclado Mecanico"
console.log(keyboard.price)    // 350
console.log(keyboard.category) // "Perifericos"
```

## Exemplo 4: Propriedade calculada no construtor

```javascript
class Product {
  constructor(name, priceInCents) {
    this.name = name
    this.priceInCents = priceInCents
    this.priceFormatted = `R$ ${(priceInCents / 100).toFixed(2)}`
  }
}

const product = new Product("Mouse", 8990)
console.log(product.priceFormatted) // "R$ 89.90"
```

## Exemplo 5: Instancias sao independentes

```javascript
class Counter {
  constructor(initialValue) {
    this.count = initialValue
  }
}

const counterA = new Counter(0)
const counterB = new Counter(10)

counterA.count = 5
console.log(counterA.count) // 5
console.log(counterB.count) // 10 — nao foi afetado
```

## Exemplo 6: TypeScript — mesma ideia com tipos

```typescript
class Product {
  name: string
  price: number

  constructor(name: string, price: number) {
    this.name = name
    this.price = price
  }
}

const product = new Product("Teclado", 250)
```

## Exemplo 7: Propriedade com valor padrao

```javascript
class Product {
  constructor(name) {
    this.name = name
    this.available = true  // valor padrao, nao vem do parametro
    this.createdAt = new Date()
  }
}

const product = new Product("Webcam")
console.log(product.available) // true
console.log(product.createdAt) // data atual
```