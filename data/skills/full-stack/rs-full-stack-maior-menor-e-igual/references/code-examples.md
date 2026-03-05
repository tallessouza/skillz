# Code Examples: Operadores de Comparação

## Exemplo 1: Cenário base da aula (saldo vs pagamento)

```javascript
let balance = 500
let payment = 120

// Maior que
console.log(balance > payment) // true — 500 é maior que 120

// Menor que
console.log(balance < payment) // false — 500 NÃO é menor que 120
```

## Exemplo 2: O cenário do saldo exato (o bug)

```javascript
let balance = 120
let payment = 120

console.log(balance > payment)  // false — bug! Tem saldo mas não passa
console.log(balance >= payment) // true  — correto! Inclui igualdade
console.log(balance < payment)  // false
console.log(balance <= payment) // true
```

## Exemplo 3: Aplicação prática completa

```javascript
const balance = 120
const payment = 120

if (balance >= payment) {
  const newBalance = balance - payment
  console.log(`Pagamento de ${payment} realizado. Novo saldo: ${newBalance}`)
} else {
  const deficit = payment - balance
  console.log(`Saldo insuficiente. Faltam ${deficit}`)
}
// Output: "Pagamento de 120 realizado. Novo saldo: 0"
```

## Exemplo 4: Variações com diferentes valores

```javascript
const balance = 500
const payment = 120

// Todos os operadores
console.log(balance > payment)   // true
console.log(balance >= payment)  // true
console.log(balance < payment)   // false
console.log(balance <= payment)  // false
```

```javascript
const balance = 50
const payment = 120

console.log(balance > payment)   // false
console.log(balance >= payment)  // false
console.log(balance < payment)   // true
console.log(balance <= payment)  // true
```

## Exemplo 5: Uso em condições do mundo real

```javascript
const age = 18
const minimumAge = 18

// Errado: exclui quem tem exatamente a idade mínima
if (age > minimumAge) { /* acesso negado para quem tem 18 */ }

// Correto: inclui a idade mínima
if (age >= minimumAge) { /* acesso permitido para 18+ */ }
```

```javascript
const temperature = 100
const boilingPoint = 100

// "A água está fervendo?" — igualdade conta
const isBoiling = temperature >= boilingPoint // true
```

## Exemplo 6: Combinando operadores para faixas

```javascript
const score = 75

const isApproved = score >= 70     // true — passou
const isExcellent = score >= 90    // false — não é excelente
const isBelowAverage = score < 50  // false — não está abaixo da média
```