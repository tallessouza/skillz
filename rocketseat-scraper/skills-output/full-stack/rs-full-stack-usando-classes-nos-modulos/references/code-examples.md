# Code Examples: Classes em Módulos JavaScript

## Exemplo 1: Refatoração completa (da aula)

### Antes — funções exportadas individualmente

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
// main.js
import { sum, multiply } from './calc.js'

console.log(sum(4, 6))
console.log(multiply(5, 9))
```

### Depois — classe exportada

```javascript
// calc.js
export class Calc {
  sum(a, b) {
    return a + b
  }

  multiply(a, b) {
    return a * b
  }
}
```

```javascript
// main.js
import { Calc } from './calc.js'

const calc = new Calc()
console.log(calc.sum(4, 6))
console.log(calc.multiply(5, 9))
```

## Exemplo 2: Classe com propriedades (da aula)

```javascript
// calc.js
export class Calc {
  name = 'Rodrigo'

  sum(a, b) {
    return a + b
  }

  multiply(a, b) {
    return a * b
  }
}
```

```javascript
// main.js
import { Calc } from './calc.js'

const calc = new Calc()
console.log(calc.name)         // 'Rodrigo'
console.log(calc.sum(2, 3))    // 5
console.log(calc.multiply(4, 5)) // 20
```

## Exemplo 3: Variação — módulo de validação

```javascript
// validator.js
export class Validator {
  isEmail(value) {
    return value.includes('@') && value.includes('.')
  }

  isNotEmpty(value) {
    return value.trim().length > 0
  }

  hasMinLength(value, min) {
    return value.length >= min
  }
}
```

```javascript
// form.js
import { Validator } from './validator.js'

const validator = new Validator()

const email = 'user@example.com'
console.log(validator.isEmail(email))        // true
console.log(validator.isNotEmpty(email))      // true
console.log(validator.hasMinLength(email, 5)) // true
```

## Exemplo 4: Variação — módulo de formatação

```javascript
// formatter.js
export class Formatter {
  currency(value) {
    return `R$ ${value.toFixed(2)}`
  }

  percentage(value) {
    return `${(value * 100).toFixed(1)}%`
  }

  date(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }
}
```

```javascript
// report.js
import { Formatter } from './formatter.js'

const fmt = new Formatter()
console.log(fmt.currency(49.9))        // 'R$ 49.90'
console.log(fmt.percentage(0.156))     // '15.6%'
console.log(fmt.date('2024-03-15'))    // '15/03/2024'
```

## Exemplo 5: Classe com estado interno

```javascript
// counter.js
export class Counter {
  count = 0

  increment() {
    this.count++
    return this.count
  }

  decrement() {
    this.count--
    return this.count
  }

  reset() {
    this.count = 0
    return this.count
  }
}
```

```javascript
// app.js
import { Counter } from './counter.js'

const counter = new Counter()
console.log(counter.increment()) // 1
console.log(counter.increment()) // 2
console.log(counter.decrement()) // 1
console.log(counter.reset())     // 0
```

## Comparação lado a lado: funções vs classe

| Aspecto | Funções exportadas | Classe exportada |
|---------|-------------------|------------------|
| Import | `import { sum, multiply }` | `import { Calc }` |
| Uso | `sum(2, 3)` | `calc.sum(2, 3)` |
| Agrupamento | Implícito (mesmo arquivo) | Explícito (mesma classe) |
| Estado | Closures ou variáveis do módulo | Propriedades da instância |
| Múltiplas instâncias | Não aplicável | `new Calc()` por contexto |
| Autocomplete | Lista todas as funções | `calc.` mostra só os métodos |