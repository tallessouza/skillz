# Code Examples: Grouping Operator

## Exemplo 1: Expressao basica sem parenteses

```javascript
const total = 2 + 3 * 4
console.log(total) // 14
// JavaScript faz: 3 * 4 = 12, depois 2 + 12 = 14
```

## Exemplo 2: Expressao com parenteses

```javascript
const total = (2 + 3) * 4
console.log(total) // 20
// JavaScript faz: 2 + 3 = 5, depois 5 * 4 = 20
```

## Exemplo 3: Calculo de media ERRADO

```javascript
const media = 9.5 + 7 + 5 / 3
console.log(media) // 18.166...
// JavaScript faz: 5 / 3 = 1.666, depois 9.5 + 7 + 1.666 = 18.166
```

## Exemplo 4: Calculo de media CORRETO

```javascript
const media = (9.5 + 7 + 5) / 3
console.log(media) // 7.166...
// JavaScript faz: 9.5 + 7 + 5 = 21.5, depois 21.5 / 3 = 7.166
```

## Variacoes praticas

### Media com array

```javascript
const grades = [9.5, 7, 5]
const sum = grades.reduce((acc, grade) => acc + grade, 0)
const average = sum / grades.length
// Aqui o parenteses e implicito pela separacao em variaveis
```

### Calculo de desconto

```javascript
// ERRADO: desconto aplicado so no tax
const finalPrice = basePrice + tax * (1 - discount)

// CORRETO: desconto sobre o total
const finalPrice = (basePrice + tax) * (1 - discount)
```

### Conversao de temperatura

```javascript
// Parenteses essenciais na formula
const celsius = (fahrenheit - 32) * 5 / 9
// Sem parenteses: fahrenheit - (32 * 5 / 9) = resultado errado
```

### Juros compostos

```javascript
// Formula: M = P * (1 + r)^n
const montante = principal * Math.pow((1 + taxaMensal), meses)
// Parenteses garantem que 1 + taxa e calculado antes do expoente
```

### Divisao de conta

```javascript
// Total com gorjeta dividido entre pessoas
const perPerson = (subtotal + tip) / numberOfPeople
// Sem parenteses: subtotal + (tip / numberOfPeople)
```