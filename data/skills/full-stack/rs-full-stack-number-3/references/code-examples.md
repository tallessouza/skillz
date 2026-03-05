# Code Examples: Tipo Number em JavaScript

## Exemplos diretos da aula

### 1. Verificando tipo com typeof

```javascript
console.log(typeof 5) // "number"
```

O instrutor usa isso para confirmar que `5` sem aspas e de fato um numero, nao uma string.

### 2. Inteiro positivo

```javascript
console.log(5) // 5 — exibido em cor diferente de strings no console
```

### 3. Inteiro negativo

```javascript
console.log(-5) // -5 — tambem e tipo number
```

### 4. Float (numero real)

```javascript
console.log(7.5) // 7.5 — numero com casa decimal
```

### 5. Valor monetario como float

```javascript
console.log(125.70) // 125.7 — JS remove zero a direita
```

### 6. Virgula vs ponto — o erro classico

```javascript
// ERRADO — virgula separa argumentos
console.log(7, 5) // imprime: 7 5 (dois valores separados)

// CORRETO — ponto e o separador decimal
console.log(7.5) // imprime: 7.5 (um unico valor)
```

### 7. Virgula com texto — demonstracao do instrutor

```javascript
// Virgula no console.log separa argumentos
console.log(7, 5, "um texto aqui")
// imprime: 7 5 um texto aqui
```

### 8. NaN — dividindo numero por texto

```javascript
console.log(12.5 / "meuNome") // NaN — Not a Number
```

## Variacoes e expansoes

### Conversao segura de string para number

```javascript
const userInput = "42.5"
const parsed = parseFloat(userInput) // 42.5
const parsed2 = Number(userInput)    // 42.5

const invalid = parseFloat("abc")    // NaN
console.log(Number.isNaN(invalid))   // true
```

### Verificacao completa de tipo numerico

```javascript
function isValidNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
}

isValidNumber(5)         // true
isValidNumber(-5)        // true
isValidNumber(7.5)       // true
isValidNumber(NaN)       // false
isValidNumber(Infinity)  // false
isValidNumber("5")       // false
```

### Operacoes aritmeticas basicas

```javascript
const soma = 10 + 5        // 15
const subtracao = 10 - 5   // 5
const multiplicacao = 10 * 5 // 50
const divisao = 10 / 3     // 3.3333333333333335
const resto = 10 % 3       // 1
```

### Trabalhando com valores monetarios

```javascript
// Abordagem simples (floats — cuidado com precisao)
const priceInReais = 125.70
const discount = 0.10
const finalPrice = priceInReais * (1 - discount) // 113.13

// Abordagem segura (centavos como inteiros)
const priceInCents = 12570
const discountPercent = 10
const finalPriceInCents = priceInCents - (priceInCents * discountPercent / 100) // 11313
const displayPrice = (finalPriceInCents / 100).toFixed(2) // "113.13"
```