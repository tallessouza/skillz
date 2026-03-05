# Code Examples: Atualizando Objetos em JavaScript

## Exemplo 1: Fluxo completo da aula

```javascript
// Criacao do objeto
const product = {
  name: "teclado",
  quantity: 100
}

// Verificando valor atual
console.log(product.name) // "teclado"

// Atualizando com notacao de ponto
product.quantity = 90
console.log(product.quantity) // 90

// Atualizando o nome
product.name = "mouse"
console.log(product.name) // "mouse"

// Atualizando com notacao de colchetes
product["quantity"] = 50

// Exibindo objeto completo
console.log(product) // { name: "mouse", quantity: 50 }
```

## Exemplo 2: Antes e depois (padrao de debug)

```javascript
const user = { name: "Ana", role: "viewer" }

console.log("Antes:", user.role) // "viewer"
user.role = "admin"
console.log("Depois:", user.role) // "admin"
```

## Exemplo 3: Notacao de colchetes com variavel

```javascript
const product = { name: "teclado", quantity: 100, price: 250 }

function updateField(obj, field, value) {
  obj[field] = value
}

updateField(product, "quantity", 75)
updateField(product, "price", 199)

console.log(product) // { name: "teclado", quantity: 75, price: 199 }
```

## Exemplo 4: Atualizacao de multiplas propriedades

```javascript
const config = {
  theme: "light",
  language: "pt-BR",
  fontSize: 14
}

// Atualizando uma por vez (explicito e rastreavel)
config.theme = "dark"
config.fontSize = 16

console.log(config)
// { theme: "dark", language: "pt-BR", fontSize: 16 }
```

## Exemplo 5: Cuidado com propriedades inexistentes

```javascript
const product = { name: "teclado", quantity: 100 }

// Typo cria propriedade nova ao inves de atualizar
product.quantty = 90 // ERRO: criou "quantty", "quantity" continua 100

console.log(product)
// { name: "teclado", quantity: 100, quantty: 90 }
```