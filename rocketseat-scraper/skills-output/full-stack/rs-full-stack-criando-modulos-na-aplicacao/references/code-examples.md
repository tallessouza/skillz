# Code Examples: Modulos JavaScript (ES Modules)

## Exemplo 1: Modulo basico de calculadora (do instrutor)

### calc.js — com export inline
```javascript
export function sum(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}
```

### calc.js — com export agrupado
```javascript
function sum(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b
}

export { sum, multiply }
```

### main.js
```javascript
import { sum, multiply } from "./calc.js"

console.log(`4 + 6 = ${sum(4, 6)}`)       // 4 + 6 = 10
console.log(`4 x 6 = ${multiply(4, 6)}`)   // 4 x 6 = 24
```

### index.html
```html
<!DOCTYPE html>
<html>
<head>
  <title>Modulos JS</title>
</head>
<body>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

## Exemplo 2: Modulo com funcao privada

```javascript
// utils.js
function formatInternal(value) {
  // funcao privada — NAO exportada
  return String(value).padStart(2, "0")
}

export function formatDate(date) {
  const day = formatInternal(date.getDate())
  const month = formatInternal(date.getMonth() + 1)
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
```

```javascript
// main.js
import { formatDate } from "./utils.js"

console.log(formatDate(new Date())) // "01/03/2026"
// formatInternal NAO esta disponivel aqui — e privada ao modulo
```

## Exemplo 3: Importando apenas o que precisa

```javascript
// math.js
export function sum(a, b) { return a + b }
export function subtract(a, b) { return a - b }
export function multiply(a, b) { return a * b }
export function divide(a, b) { return a / b }
```

```javascript
// main.js — so preciso de sum e multiply
import { sum, multiply } from "./math.js"

console.log(sum(10, 5))      // 15
console.log(multiply(10, 5)) // 50
// subtract e divide existem no modulo mas nao foram importados
```

## Exemplo 4: Multiplos modulos

```javascript
// user.js
export function createUser(name, email) {
  return { name, email, createdAt: new Date() }
}

export function greetUser(user) {
  return `Ola, ${user.name}!`
}
```

```javascript
// calc.js
export function sum(a, b) { return a + b }
export function multiply(a, b) { return a * b }
```

```javascript
// main.js
import { createUser, greetUser } from "./user.js"
import { sum } from "./calc.js"

const user = createUser("Joao", "joao@email.com")
console.log(greetUser(user))  // "Ola, Joao!"
console.log(sum(2, 3))         // 5
```

## Erro classico: esquecer type="module"

```html
<!-- ERRADO: vai dar erro no console -->
<script src="./main.js"></script>
<!-- Erro: Uncaught SyntaxError: Cannot use import statement outside a module -->

<!-- CORRETO -->
<script type="module" src="./main.js"></script>
```

## Erro classico: esquecer o export

```javascript
// calc.js
function sum(a, b) { return a + b }  // sem export!
```

```javascript
// main.js
import { sum } from "./calc.js"
// Erro: The requested module './calc.js' does not provide an export named 'sum'
```