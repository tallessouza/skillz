# Code Examples: Criando Arrays com Construtor

## Exemplo 1: Array vazio com construtor (da aula)

```javascript
const newArray = new Array()
console.log(newArray)        // []
console.log(typeof newArray) // "object"
console.log(newArray.length) // 0
```

## Exemplo 2: Array pre-alocado (da aula)

```javascript
const available = new Array(10)
console.log(available)        // [empty × 10]
console.log(available.length) // 10
```

## Exemplo 3: Length em string vs array (da aula)

```javascript
// String
console.log("Rodrigo".length) // 7

// Array vazio
const emptyArr = new Array()
console.log(emptyArr.length) // 0

// Array com tamanho
const sized = new Array(10)
console.log(sized.length) // 10
```

## Exemplo 4: Comparacao literal vs construtor

```javascript
// Equivalentes para array vazio
const a = []
const b = new Array()

// Equivalentes para array com valores
const c = [1, 2, 3]
const d = new Array(1, 2, 3)

// NAO equivalentes — cuidado!
const e = [3]          // array com o valor 3
const f = new Array(3) // array com 3 posicoes vazias
```

## Exemplo 5: Pre-alocacao + preenchimento

```javascript
// Criar 10 slots para agendamento, todos disponiveis
const slots = new Array(10).fill("disponivel")
console.log(slots) // ["disponivel", "disponivel", ..., "disponivel"]
console.log(slots.length) // 10

// Criar grade de horarios
const hours = new Array(24).fill(null).map((_, i) => `${i}:00`)
// ["0:00", "1:00", ..., "23:00"]
```

## Exemplo 6: Verificando tipo corretamente

```javascript
const myArray = new Array(5)

// ERRADO — typeof retorna "object" para arrays
console.log(typeof myArray)          // "object"
console.log(typeof myArray === "array") // false

// CORRETO
console.log(Array.isArray(myArray))  // true
```

## Exemplo 7: Diferenca entre empty e undefined

```javascript
const holes = new Array(3)
const filled = [undefined, undefined, undefined]

// forEach pula holes
holes.forEach((v, i) => console.log(i, v))
// (nada — nenhuma iteracao)

filled.forEach((v, i) => console.log(i, v))
// 0 undefined
// 1 undefined
// 2 undefined
```