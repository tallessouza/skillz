# Code Examples: Expressoes e Operadores

## Exemplo 1: Expressao aritmetica de soma (do transcript)

```javascript
// Operandos: 5, 3, 7
// Operadores: + (adicao)
// Expressao: 5 + 3 + 7
const sum = 5 + 3 + 7 // Resultado: 15
```

## Exemplo 2: Calculo de media (do transcript)

```javascript
// Primeiro, soma os valores
const sum = 5 + 3 + 7 // 15

// Depois, divide pela quantidade de valores
const average = sum / 3 // 5
```

### Variacao: media com array

```javascript
const values = [5, 3, 7]
const sum = values.reduce((accumulator, value) => accumulator + value, 0)
const average = sum / values.length
```

## Exemplo 3: Expressoes aritmeticas basicas

```javascript
// Adicao
const total = 10 + 20 // 30

// Subtracao
const difference = 50 - 15 // 35

// Multiplicacao
const area = 4 * 5 // 20

// Divisao
const pricePerUnit = 100 / 4 // 25

// Resto (modulo)
const remainder = 10 % 3 // 1
```

## Exemplo 4: Expressoes de comparacao (logicas)

```javascript
const age = 25

// Comparacao produz um valor booleano
const isAdult = age >= 18 // true
const isTeenager = age >= 13 && age < 18 // false
const canVote = age >= 16 // true
```

## Exemplo 5: Expressoes de atribuicao

```javascript
let score = 0 // Atribuicao simples

score += 10 // Atribuicao com soma: score = score + 10 → 10
score -= 3  // Atribuicao com subtracao: score = score - 3 → 7
score *= 2  // Atribuicao com multiplicacao: score = score * 2 → 14
```

## Exemplo 6: Composicao de expressoes

```javascript
// Expressoes podem ser compostas — o resultado de uma alimenta outra
const basePrice = 100
const taxRate = 0.15
const discount = 10

// Cada linha e uma expressao que produz um valor
const taxAmount = basePrice * taxRate        // 15
const priceWithTax = basePrice + taxAmount   // 115
const finalPrice = priceWithTax - discount   // 105
```

## Exemplo 7: Expressoes como argumento

```javascript
// Expressoes podem ser usadas diretamente como argumentos
console.log(5 + 3)           // A expressao 5 + 3 e avaliada antes do log
console.log(Math.max(10, 20)) // Chamada de funcao tambem e expressao

// Composicao inline
const message = "Total: " + (100 * 1.15) // Expressao dentro de expressao
```