# Code Examples: Importando Tudo

## Exemplo base da aula

### calc.js (modulo exportando)
```javascript
export function sum(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}
```

### main.js — importacao individual
```javascript
import { sum, multiply } from './calc.js'

console.log(sum(2, 3))       // 5
console.log(multiply(2, 3))  // 6
```

### main.js — namespace import
```javascript
import * as calc from './calc.js'

console.log(calc.sum(2, 3))       // 5
console.log(calc.multiply(2, 3))  // 6
```

## Variacao: ordem na importacao individual

```javascript
// Estas duas linhas sao equivalentes:
import { sum, multiply } from './calc.js'
import { multiply, sum } from './calc.js'

// O que muda a ordem de exibicao e a ordem de USO:
console.log(multiply(2, 3))  // aparece primeiro
console.log(sum(2, 3))       // aparece segundo
```

## Variacao: modulo com muitas exportacoes

```javascript
// utils.js
export function formatDate(d) { /* ... */ }
export function formatCurrency(v) { /* ... */ }
export function formatName(n) { /* ... */ }
export function parseDate(s) { /* ... */ }
export function parseCurrency(s) { /* ... */ }

// main.js — namespace e mais limpo quando usa muitas funcoes
import * as utils from './utils.js'

utils.formatDate(new Date())
utils.formatCurrency(1999)
utils.formatName('joao')
utils.parseDate('2024-01-01')
```

## Variacao: misturando com default export

```javascript
// api.js
export default function fetchData() { /* ... */ }
export function formatResponse(r) { /* ... */ }

// Namespace import inclui o default como .default
import * as api from './api.js'
api.default()           // chama fetchData
api.formatResponse(res) // chama formatResponse

// Mais comum: separar default e named
import fetchData, { formatResponse } from './api.js'
```

## Erro comum demonstrado na aula

Ao trocar de importacao individual para namespace, esquecer de atualizar as chamadas:

```javascript
// ERRO: sum e multiply nao existem mais como variaveis soltas
import * as calc from './calc.js'
console.log(sum(2, 3))      // ❌ ReferenceError: sum is not defined

// CORRETO: usar o namespace
console.log(calc.sum(2, 3)) // ✅
```

## Autocompletar com namespace

Ao digitar `calc.` no editor, o IntelliSense mostra:
```
calc.sum
calc.multiply
```

Isso facilita descobrir o que o modulo oferece sem abrir o arquivo fonte.