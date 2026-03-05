# Code Examples: Renomeando Importações

## Exemplo 1: Importacao basica sem renomeacao

```javascript
// math.js
export function sum(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}

// main.js
import { sum, multiply } from './math.js'

console.log(sum(1, 2))       // 3
console.log(multiply(3, 4))  // 12
```

## Exemplo 2: Renomeacao simples com letras

```javascript
import { sum as s, multiply as m } from './math.js'

console.log(s(1, 2))   // 3
console.log(m(3, 4))   // 12
```

## Exemplo 3: Renomeacao parcial

```javascript
import { sum as s, multiply } from './math.js'

console.log(s(1, 2))          // 3
console.log(multiply(3, 4))   // 12
```

## Exemplo 4: Resolvendo conflito de nomes

```javascript
// Funcao local ja existe
function multiply(a, b) {
  console.log(`Multiplicando ${a} por ${b}`)
  return a * b
}

// Importar com alias para evitar conflito
import { multiply as externalMultiply } from './math.js'

// Ambas podem coexistir
multiply(2, 3)              // log + retorna 6
externalMultiply(2, 3)      // retorna 6 direto
```

## Exemplo 5: Dois modulos com nomes iguais

```javascript
import { validate as validateEmail } from './email-validator.js'
import { validate as validatePhone } from './phone-validator.js'

validateEmail('user@test.com')
validatePhone('+5511999999999')
```

## Exemplo 6: Combinando default e named com renomeacao

```javascript
import Calculator, { sum as add, multiply as mult } from './calculator.js'

const calc = new Calculator()
console.log(add(1, 2))
console.log(mult(3, 4))
```

## Exemplo 7: Rename na importacao vs variavel intermediaria

```javascript
// ERRADO — variavel intermediaria desnecessaria
import { multiply } from './math.js'
const mult = multiply

// CORRETO — renomeacao nativa
import { multiply as mult } from './math.js'
```