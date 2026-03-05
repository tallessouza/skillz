# Code Examples: O que são Funções

## Exemplo básico: definir e chamar

```javascript
// Definindo a função (criando o "botão")
function sayHello() {
  console.log('Olá, mundo!')
}

// Chamando/executando/invocando a função (apertando o "botão")
sayHello() // "Olá, mundo!"
sayHello() // "Olá, mundo!"
sayHello() // "Olá, mundo!"
```

## Função que calcula um valor

```javascript
function calculateArea(width, height) {
  return width * height
}

const roomArea = calculateArea(5, 3)    // 15
const gardenArea = calculateArea(10, 8) // 80
```

Definida uma vez, reutilizada com diferentes valores.

## Responsabilidade única em prática

### Errado: função fazendo múltiplas coisas

```javascript
function processOrder(order) {
  // calcula total
  let total = 0
  for (const item of order.items) {
    total += item.price * item.quantity
  }
  // aplica desconto
  if (total > 100) {
    total = total * 0.9
  }
  // formata
  const formatted = `R$ ${total.toFixed(2)}`
  // exibe
  console.log(`Pedido: ${formatted}`)
  // salva
  database.save({ ...order, total })
}
```

### Correto: cada função com uma responsabilidade

```javascript
function calculateOrderTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function applyDiscount(total, threshold, discountRate) {
  return total > threshold ? total * (1 - discountRate) : total
}

function formatPrice(value) {
  return `R$ ${value.toFixed(2)}`
}

function processOrder(order) {
  const subtotal = calculateOrderTotal(order.items)
  const total = applyDiscount(subtotal, 100, 0.1)
  console.log(`Pedido: ${formatPrice(total)}`)
  database.save({ ...order, total })
}
```

Agora cada "botão" faz uma coisa. `calculateOrderTotal` pode ser reutilizada em relatórios. `formatPrice` pode ser reutilizada em qualquer lugar que exibe preço.

## Analogia do controle expandida

```javascript
// Cada função = um botão do controle
function jump(player) {
  player.velocityY = -10
}

function moveLeft(player) {
  player.x -= player.speed
}

function moveRight(player) {
  player.x += player.speed
}

function attack(player) {
  player.isAttacking = true
}

// No game loop, "apertamos os botões" conforme necessário
if (pressedJump) jump(character)
if (pressedLeft) moveLeft(character)
if (pressedRight) moveRight(character)
if (pressedAttack) attack(character)
```

## Variações de uso

### Função chamada dentro de outra função

```javascript
function getFullName(firstName, lastName) {
  return `${firstName} ${lastName}`
}

function greetUser(firstName, lastName) {
  const fullName = getFullName(firstName, lastName)
  return `Bem-vindo, ${fullName}!`
}

greetUser('Maria', 'Silva') // "Bem-vindo, Maria Silva!"
```

### Função reutilizada em contextos diferentes

```javascript
function calculatePercentage(value, percentage) {
  return value * (percentage / 100)
}

// Mesmo cálculo, contextos diferentes
const tax = calculatePercentage(1000, 15)        // imposto
const tip = calculatePercentage(85, 10)           // gorjeta
const discount = calculatePercentage(250, 20)     // desconto
const commission = calculatePercentage(5000, 3)   // comissão
```