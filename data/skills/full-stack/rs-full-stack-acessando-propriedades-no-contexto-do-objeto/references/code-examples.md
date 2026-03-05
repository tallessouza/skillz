# Code Examples: Acessando Propriedades no Contexto do Objeto

## Exemplo 1: Objeto basico da aula

```javascript
const user = {
  name: "Rodrigo",
  message: function () {
    console.log(`Ola ${user.name}`) // forma 1: pelo nome do objeto
  },
}

user.message() // Ola Rodrigo
```

## Exemplo 2: Usando this (forma recomendada)

```javascript
const user = {
  name: "Rodrigo",
  message: function () {
    console.log(`Ola ${this.name}`) // forma 2: pelo this
  },
}

user.message() // Ola Rodrigo
```

## Exemplo 3: Acessando diferentes propriedades com this

```javascript
const user = {
  name: "Rodrigo",
  email: "rodrigo@email.com",
  message: function () {
    console.log(`Ola ${this.name}`) // acessa name
    console.log(`Email: ${this.email}`) // acessa email
  },
}

user.message()
// Ola Rodrigo
// Email: rodrigo@email.com
```

## Exemplo 4: Arrow function NAO funciona (pegadinha da aula)

```javascript
const user = {
  name: "Rodrigo",
  message: () => {
    console.log(`Ola ${this.name}`) // undefined!
  },
}

user.message() // Ola undefined
```

## Exemplo 5: Shorthand method (ES6) — funciona com this

```javascript
const user = {
  name: "Rodrigo",
  message() {
    console.log(`Ola ${this.name}`)
  },
}

user.message() // Ola Rodrigo
```

## Exemplo 6: Multiplos metodos acessando propriedades

```javascript
const product = {
  name: "Notebook",
  priceInCents: 250000,
  quantity: 5,
  summary: function () {
    console.log(`${this.name} - R$${this.priceInCents / 100}`)
  },
  totalValue: function () {
    return this.priceInCents * this.quantity
  },
}

product.summary() // Notebook - R$2500
console.log(product.totalValue()) // 1250000
```

## Exemplo 7: Prova de acesso dinamico

```javascript
const user = {
  name: "Joao",
  message: function () {
    console.log(`Ola ${this.name}`)
  },
}

user.message() // Ola Joao
user.name = "Maria"
user.message() // Ola Maria — prova que e dinamico
```

## Exemplo 8: Por que hardcode do nome e fragil

```javascript
const user = {
  name: "Rodrigo",
  message: function () {
    console.log(`Ola ${user.name}`) // depende da variavel "user" existir
  },
}

const admin = user
// user = null // se reatribuir, admin.message() quebra!
admin.message() // com this.name, funcionaria independente
```