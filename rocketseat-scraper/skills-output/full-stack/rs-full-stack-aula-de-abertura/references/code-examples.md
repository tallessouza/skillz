# Code Examples: JavaScript Intermediário — Prévia

Exemplos introdutórios de cada tópico que será coberto no módulo.

## Objetos

```javascript
const user = {
  name: "Maria",
  age: 28,
  isActive: true
}

console.log(user.name) // "Maria"
user.age = 29 // modificando propriedade
```

## Métodos de texto

```javascript
const email = "  Usuario@Email.COM  "
const normalized = email.trim().toLowerCase()
console.log(normalized) // "usuario@email.com"

const fullName = "Maria Silva"
const firstName = fullName.split(" ")[0] // "Maria"
```

## Arrays

```javascript
const fruits = ["maçã", "banana", "laranja"]
fruits.push("uva") // adiciona ao final
console.log(fruits.length) // 4
console.log(fruits[0]) // "maçã"
```

## Repetições e iterações

```javascript
const numbers = [1, 2, 3, 4, 5]

// forEach — executar ação para cada item
numbers.forEach(number => console.log(number * 2))

// map — transformar cada item
const doubled = numbers.map(number => number * 2)

// filter — selecionar itens
const evenNumbers = numbers.filter(number => number % 2 === 0)
```

## Data e hora

```javascript
const now = new Date()
console.log(now.toLocaleDateString("pt-BR")) // "01/03/2026"
console.log(now.getHours()) // hora atual
```

## Classes

```javascript
class Product {
  constructor(name, priceInCents) {
    this.name = name
    this.priceInCents = priceInCents
  }

  formattedPrice() {
    return `R$ ${(this.priceInCents / 100).toFixed(2)}`
  }
}

const notebook = new Product("Notebook", 359990)
console.log(notebook.formattedPrice()) // "R$ 3599.90"
```