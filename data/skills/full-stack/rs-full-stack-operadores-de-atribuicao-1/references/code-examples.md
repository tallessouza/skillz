# Code Examples: Operadores de Atribuicao

## Exemplo completo da aula

```javascript
// Atribuicao simples
let value = 1
console.log(value) // 1

// Incremento (adicao com atribuicao)
value += 2
console.log(value) // 3

// Decremento (subtracao com atribuicao)
value -= 2
console.log(value) // 1

// Multiplicacao com atribuicao
value *= 3
console.log(value) // 3

// Divisao com atribuicao
value /= 2
console.log(value) // 1.5

// Resto da divisao com atribuicao
value %= 2
console.log(value) // 1.5 % 2 = 1.5

// Exponenciacao com atribuicao
value **= 2
console.log(value) // 2.25
```

## Exemplo isolado (como o instrutor demonstrou ao comentar linhas)

```javascript
let value = 3
value **= 2
console.log(value) // 9 — porque 3² = 9
```

## Cenarios do mundo real

### Contador de cliques
```javascript
let clickCount = 0
// A cada clique:
clickCount += 1
```

### Acumulador de preco total
```javascript
let totalPrice = 0
const items = [29.90, 15.50, 42.00]

for (const itemPrice of items) {
  totalPrice += itemPrice
}
console.log(totalPrice) // 87.40
```

### Aplicar desconto progressivo
```javascript
let price = 100
price *= 0.9   // 10% de desconto → 90
price *= 0.95  // mais 5% de desconto → 85.5
```

### Paginacao com resto
```javascript
let currentPage = 0
const totalPages = 5

// Avancar pagina com ciclagem
currentPage += 1
currentPage %= totalPages  // volta a 0 quando chega em 5
```

### Calculo de juros compostos
```javascript
let investment = 1000
const monthlyRate = 1.01  // 1% ao mes

// Cada mes:
investment *= monthlyRate  // mes 1: 1010
investment *= monthlyRate  // mes 2: 1020.10
```

### Reducao pela metade (binary search style)
```javascript
let range = 1024
range /= 2  // 512
range /= 2  // 256
range /= 2  // 128
```

## Tabela de todos os operadores com exemplos

```javascript
let a = 10;  a += 3;   // a = 13
let b = 10;  b -= 3;   // b = 7
let c = 10;  c *= 3;   // c = 30
let d = 10;  d /= 3;   // d = 3.333...
let e = 10;  e %= 3;   // e = 1
let f = 10;  f **= 3;  // f = 1000
```