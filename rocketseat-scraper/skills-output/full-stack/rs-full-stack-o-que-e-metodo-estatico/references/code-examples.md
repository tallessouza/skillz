# Code Examples: Métodos Estáticos

## Exemplo 1: Fluxo completo da aula (método não estático)

```javascript
class User {
  showMessage() {
    console.log('essa é uma mensagem')
  }
}

// Precisa instanciar para usar
const user = new User()
user.showMessage() // "essa é uma mensagem"

// Sem instanciar: ERRO
User.showMessage() // TypeError: User.showMessage is not a function
```

## Exemplo 2: Adicionando static

```javascript
class User {
  static showMessage() {
    console.log('essa é uma mensagem')
  }
}

// Agora funciona sem instanciar
User.showMessage() // "essa é uma mensagem"
```

## Exemplo 3: A armadilha — this no método estático

```javascript
class User {
  constructor(message) {
    this.message = message
  }

  static showMessage() {
    console.log(this.message) // undefined
  }
}

// Mesmo passando no "new", o static não enxerga
User.showMessage('essa é uma mensagem') // undefined (parâmetro ignorado)
```

**O que acontece:** O constructor nunca executa porque não houve `new`. O `this.message` dentro do static referencia a classe User, que não tem propriedade `message`.

## Exemplo 4: Correção — receber por parâmetro

```javascript
class User {
  static showMessage(message) {
    console.log(message)
  }
}

User.showMessage('essa é uma mensagem') // "essa é uma mensagem"
```

## Exemplo 5: Classe utilitária (sem constructor)

```javascript
class StringUtils {
  static capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  static slugify(text) {
    return text.toLowerCase().replace(/\s+/g, '-')
  }

  static truncate(text, maxLength) {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }
}

StringUtils.capitalize('hello')       // "Hello"
StringUtils.slugify('Meu Post Legal') // "meu-post-legal"
StringUtils.truncate('Texto longo demais', 10) // "Texto long..."
```

## Exemplo 6: Factory method (padrão comum)

```javascript
class User {
  constructor(name, email) {
    this.name = name
    this.email = email
  }

  greet() {
    return `Olá, ${this.name}`
  }

  // Factory estático — cria instância a partir de JSON
  static fromJSON(json) {
    const data = JSON.parse(json)
    return new User(data.name, data.email)
  }

  // Factory estático — cria instância a partir de email
  static createFromEmail(email) {
    const name = email.split('@')[0]
    return new User(name, email)
  }
}

const user1 = User.fromJSON('{"name":"João","email":"joao@email.com"}')
const user2 = User.createFromEmail('maria@email.com')

user1.greet() // "Olá, João"
user2.greet() // "Olá, maria"
```

## Exemplo 7: Validação como método estático

```javascript
class Validator {
  static isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  static isStrongPassword(value) {
    return value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value)
  }

  static isValidCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '')
    return cleaned.length === 11
  }
}

Validator.isEmail('joao@email.com')      // true
Validator.isStrongPassword('Abc12345')    // true
Validator.isValidCPF('123.456.789-00')   // true
```

## Exemplo 8: Misturando estático e instância

```javascript
class Product {
  constructor(name, priceInCents) {
    this.name = name
    this.priceInCents = priceInCents
  }

  // Método de instância — usa this
  formattedPrice() {
    return `R$ ${(this.priceInCents / 100).toFixed(2)}`
  }

  // Método estático — não usa this, recebe por parâmetro
  static cheapest(products) {
    return products.reduce((min, product) =>
      product.priceInCents < min.priceInCents ? product : min
    )
  }
}

const products = [
  new Product('Camiseta', 5990),
  new Product('Calça', 12990),
  new Product('Meia', 1990),
]

const cheapest = Product.cheapest(products)
console.log(cheapest.name)            // "Meia"
console.log(cheapest.formattedPrice()) // "R$ 19.90"
```