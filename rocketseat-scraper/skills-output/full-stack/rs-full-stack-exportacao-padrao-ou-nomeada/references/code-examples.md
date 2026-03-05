# Code Examples: Exportação Padrão ou Nomeada

## Exemplo 1: Named exports inline (demonstrado na aula)

```javascript
// calc.js
export function sum(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}
```

```javascript
// index.js
import { sum, multiply } from './calc.js'

console.log(sum(2, 3))       // 5
console.log(multiply(2, 3))  // 6
```

## Exemplo 2: Import de tudo como objeto

```javascript
// index.js
import * as calc from './calc.js'

console.log(calc.sum(2, 3))       // 5
console.log(calc.multiply(2, 3))  // 6
```

## Exemplo 3: Default export (demonstrado na aula)

```javascript
// calc.js
export default function sum(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}
```

```javascript
// index.js — default sem chaves, named com chaves
import sum, { multiply } from './calc.js'

console.log(sum(2, 3))       // 5
console.log(multiply(2, 3))  // 6
```

## Exemplo 4: Nome arbitrário no default (demonstrado na aula)

```javascript
// calc.js — sum é export default
export default function sum(a, b) {
  return a + b
}
```

```javascript
// index.js — qualquer nome funciona para default!
import batata from './calc.js'

console.log(batata(2, 3))  // 5 — funciona!
```

**Por que funciona?** Porque `batata` é apenas um alias local para a binding `default` do módulo. O motor JS não se importa com o nome.

## Exemplo 5: Erro ao usar chaves com default

```javascript
// ERRO — sum é default, não pode usar chaves
import { sum } from './calc.js'
// SyntaxError: sum is not a named export
```

## Exemplo 6: Erro ao usar nome errado com named

```javascript
// calc.js
export function multiply(a, b) {
  return a * b
}
```

```javascript
// ERRO — "salada" não existe como named export
import { salada } from './calc.js'
// SyntaxError: salada is not exported from './calc.js'
```

## Exemplo 7: Export no final do arquivo (alternativa)

```javascript
// calc.js — export agrupado no final
function sum(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b
}

export { sum, multiply }
```

Equivalente ao inline, mas o instrutor prefere inline porque mantém export visível junto com a declaração.

## Exemplo 8: Renomeando named exports no import

```javascript
import { multiply as mult } from './calc.js'

console.log(mult(2, 3))  // 6
```

## Exemplo 9: Re-export (barrel file)

```javascript
// index.js (barrel)
export { sum } from './sum.js'
export { multiply } from './multiply.js'
```

```javascript
// consumer.js
import { sum, multiply } from './math/index.js'
```

## Exemplo 10: Padrão React (default aceitável)

```javascript
// Button.jsx — um componente por arquivo, default é convenção
export default function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}
```

```javascript
// App.jsx
import Button from './Button.jsx'
```