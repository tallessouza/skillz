# Code Examples: Renomeando Exportações

## Exemplo 1: Fluxo completo da aula

### calc.js — funcoes sem export inline

```javascript
function sum(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b
}

// Centraliza e renomeia
export { sum as sumTwoNumbers, multiply as multiplyTwoNumbers }
```

### main.js — importando os nomes renomeados

```javascript
import { sumTwoNumbers, multiplyTwoNumbers } from './calc.js'

console.log(sumTwoNumbers(2, 3))       // 5
console.log(multiplyTwoNumbers(4, 5))   // 20
```

## Exemplo 2: Sem renomeacao (centralizado mas sem `as`)

```javascript
// utils.js
function formatDate(date) {
  return date.toISOString()
}

function parseDate(str) {
  return new Date(str)
}

export { formatDate, parseDate }
```

```javascript
// main.js
import { formatDate, parseDate } from './utils.js'
```

## Exemplo 3: Renomear apenas uma funcao

```javascript
// auth.js
function check(token) {
  return token !== null
}

function login(user, pass) {
  // ...
}

// Renomeia apenas check, que e generico demais
export { check as isAuthenticated, login }
```

```javascript
// app.js
import { isAuthenticated, login } from './auth.js'

if (isAuthenticated(token)) {
  // ...
}
```

## Exemplo 4: Erro comum — importar nome antigo apos renomear

```javascript
// calc.js
function sum(a, b) { return a + b }
export { sum as sumTwoNumbers }

// main.js — ERRO!
import { sum } from './calc.js'
// SyntaxError: The requested module does not provide an export named 'sum'

// CORRETO:
import { sumTwoNumbers } from './calc.js'
```

## Exemplo 5: Comparando renomeacao no export vs no import

### Renomear no export (todos consumidores recebem o mesmo nome):

```javascript
// math.js
function add(a, b) { return a + b }
export { add as addNumbers }

// fileA.js
import { addNumbers } from './math.js'   // mesmo nome

// fileB.js
import { addNumbers } from './math.js'   // mesmo nome
```

### Renomear no import (cada consumidor pode dar nome diferente):

```javascript
// math.js
function add(a, b) { return a + b }
export { add }

// fileA.js
import { add as addNumbers } from './math.js'

// fileB.js
import { add as sum } from './math.js'   // nome diferente!
```

## Exemplo 6: Transicao de default para named com renomeacao

```javascript
// ANTES: export default
export default function sum(a, b) { return a + b }

// Import:
import sum from './calc.js'

// ---

// DEPOIS: named export com rename
function sum(a, b) { return a + b }
export { sum as sumTwoNumbers }

// Import:
import { sumTwoNumbers } from './calc.js'
```