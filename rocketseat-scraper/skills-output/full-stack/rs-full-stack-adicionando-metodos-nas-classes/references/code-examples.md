# Code Examples: Métodos em Classes JavaScript

## Exemplo 1: Código exato da aula

```javascript
class User {
  constructor(name, email) {
    this.name = name
    this.email = email
  }

  sendEmail() {
    console.log(`E-mail enviado para ${this.name} no endereço eletrônico ${this.email}`)
  }
}

const user = new User("Rodrigo", "rodrigo@email.com")
user.sendEmail()
// Output: E-mail enviado para Rodrigo no endereço eletrônico rodrigo@email.com
```

## Exemplo 2: Classe com múltiplos métodos

```javascript
class BankAccount {
  constructor(owner, balanceInCents) {
    this.owner = owner
    this.balanceInCents = balanceInCents
  }

  deposit(amountInCents) {
    this.balanceInCents += amountInCents
    console.log(`Depósito de R$ ${(amountInCents / 100).toFixed(2)} realizado`)
  }

  withdraw(amountInCents) {
    if (amountInCents > this.balanceInCents) {
      console.log("Saldo insuficiente")
      return
    }
    this.balanceInCents -= amountInCents
    console.log(`Saque de R$ ${(amountInCents / 100).toFixed(2)} realizado`)
  }

  getBalance() {
    return `Saldo de ${this.owner}: R$ ${(this.balanceInCents / 100).toFixed(2)}`
  }
}

const account = new BankAccount("Rodrigo", 100000) // R$ 1000,00
account.deposit(5000)   // Depósito de R$ 50.00 realizado
account.withdraw(20000) // Saque de R$ 200.00 realizado
console.log(account.getBalance()) // Saldo de Rodrigo: R$ 850.00
```

## Exemplo 3: Método que retorna valor vs método que faz ação

```javascript
class Product {
  constructor(name, priceInCents) {
    this.name = name
    this.priceInCents = priceInCents
  }

  // Método que RETORNA um valor (getter-like)
  formatPrice() {
    return `R$ ${(this.priceInCents / 100).toFixed(2)}`
  }

  // Método que FAZ uma ação (side effect)
  printLabel() {
    console.log(`${this.name} - ${this.formatPrice()}`)
  }
}
```

## Exemplo 4: Método com parâmetros

```javascript
class Calculator {
  constructor(initialValue) {
    this.currentValue = initialValue
  }

  add(number) {
    this.currentValue += number
    return this // permite encadeamento
  }

  multiply(number) {
    this.currentValue *= number
    return this
  }

  getResult() {
    return this.currentValue
  }
}

const result = new Calculator(10)
  .add(5)
  .multiply(2)
  .getResult()

console.log(result) // 30
```

## Exemplo 5: Erro que o instrutor demonstrou

```javascript
// ERRADO — SyntaxError
class User {
  constructor(name) {
    this.name = name
  }

  function sendEmail() { // ← NÃO PODE usar function aqui
    console.log(`Email para ${this.name}`)
  }
}

// CORRETO
class User {
  constructor(name) {
    this.name = name
  }

  sendEmail() { // ← Direto, sem function
    console.log(`Email para ${this.name}`)
  }
}
```