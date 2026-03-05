# Code Examples: Conversão e Coerção de Tipos

## Exemplo 1: Verificando tipo com typeof

```javascript
// String entre aspas
console.log(typeof "9")  // "string"

// Convertendo para número
console.log(typeof Number("9"))  // "number"
```

## Exemplo 2: Conversão de variável string para number

```javascript
let value = "9"
console.log(typeof value)           // "string"
console.log(typeof Number(value))   // "number"
```

## Exemplo 3: Variável sem aspas vs com aspas

```javascript
let value = "9"
console.log(typeof value)  // "string"

let value2 = 9
console.log(typeof value2)  // "number"
```

## Exemplo 4: Number para String com .toString()

```javascript
let age = 18
console.log(typeof age)              // "number"
console.log(typeof age.toString())   // "string"
```

## Exemplo 5: Number para String com String()

```javascript
let age = 18
console.log(typeof String(age))  // "string"
```

## Exemplo 6: Number para Boolean

```javascript
let option = 1
console.log(typeof option)            // "number"
console.log(typeof Boolean(option))   // "boolean"

// Valor convertido
console.log(Boolean(1))    // true
console.log(Boolean(0))    // false
console.log(Boolean(55))   // true
console.log(Boolean(-25))  // true
```

## Exemplo 7: Coerção com operador +

```javascript
// String + Number = concatenação (coerção)
console.log("10" + 5)              // "105"
console.log(typeof ("10" + 5))     // "string"
```

## Variações adicionais

### Coerção com outros operadores (não mostrado na aula, mas relacionado)

```javascript
// Outros operadores convertem para número
console.log("10" - 5)   // 5
console.log("10" * 2)   // 20
console.log("10" / 2)   // 5

// Apenas + concatena com strings
console.log("10" + 5)   // "105"
```

### Conversão de input de formulário (caso real)

```javascript
// Input sempre vem como string
const inputValue = document.querySelector("input").value  // "42"

// Errado: coerção
const result = inputValue + 10  // "4210"

// Correto: conversão explícita
const result = Number(inputValue) + 10  // 52
```

### Edge cases com Number()

```javascript
Number("9")        // 9
Number("  9  ")    // 9 (ignora espaços)
Number("")         // 0
Number("abc")      // NaN
Number(true)       // 1
Number(false)      // 0
Number(null)       // 0
Number(undefined)  // NaN
```

### Edge cases com Boolean()

```javascript
// Falsy values (todos os 6)
Boolean(0)          // false
Boolean("")         // false
Boolean(null)       // false
Boolean(undefined)  // false
Boolean(NaN)        // false
Boolean(false)      // false

// Tudo mais é truthy
Boolean(1)          // true
Boolean(-1)         // true
Boolean("0")        // true (string não vazia!)
Boolean("false")    // true (string não vazia!)
Boolean([])         // true (array, mesmo vazio)
Boolean({})         // true (objeto, mesmo vazio)
```