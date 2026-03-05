# Code Examples: Operadores Aritméticos em JavaScript

## Soma

```javascript
// Soma basica com inteiros
console.log("Soma:", 12 + 8)   // Soma: 20

// Soma com numeros decimais (float)
console.log("Soma:", 12 + 8.5) // Soma: 20.5
```

## Concatenacao vs Soma — a armadilha

```javascript
// SOMA (ambos numeros)
console.log("Soma:", 12 + 8)       // Soma: 20

// CONCATENACAO (ambos strings)
console.log("Concatenação:", "12" + "8") // Concatenação: 128

// CONCATENACAO (um string, um numero — coercao de tipo)
console.log("Cuidado:", "12" + 8)        // Cuidado: 128
```

### Corrigindo valores que vem como string

```javascript
const inputA = "12"
const inputB = "8"

// Errado — concatena
const errado = inputA + inputB // "128"

// Correto — converte antes
const correto = Number(inputA) + Number(inputB) // 20
```

## Subtracao

```javascript
console.log("Subtração:", 12 - 8)  // Subtração: 4
console.log("Subtração:", 12 - 10) // Subtração: 2
```

## Multiplicacao

```javascript
console.log("Multiplicação:", 3 * 5.5) // Multiplicação: 16.5
console.log("Multiplicação:", 4 * 3)   // Multiplicação: 12
```

## Divisao

```javascript
console.log("Divisão:", 12 / 2)  // Divisão: 6
console.log("Divisão:", 10 / 3)  // Divisão: 3.3333...
```

## Resto da divisao

```javascript
// Sem resto (par)
console.log("Resto da divisão:", 12 % 2) // 0

// Com resto (impar)
console.log("Resto da divisão:", 13 % 2) // 1
```

### Aplicacao pratica: par ou impar

```javascript
function checkParity(number) {
  if (number % 2 === 0) {
    return `${number} é par`
  }
  return `${number} é ímpar`
}

console.log(checkParity(12)) // "12 é par"
console.log(checkParity(13)) // "13 é ímpar"
```

### Aplicacao pratica: alternar estilo em lista

```javascript
const items = ["Item A", "Item B", "Item C", "Item D"]

items.forEach((item, index) => {
  const background = index % 2 === 0 ? "white" : "gray"
  console.log(`${item} → ${background}`)
})
// Item A → white
// Item B → gray
// Item C → white
// Item D → gray
```

### Aplicacao pratica: ciclar por array

```javascript
const colors = ["red", "green", "blue"]

for (let i = 0; i < 7; i++) {
  const color = colors[i % colors.length]
  console.log(`Index ${i} → ${color}`)
}
// Index 0 → red, 1 → green, 2 → blue, 3 → red, 4 → green...
```

## Exponenciacao

```javascript
console.log("Exponencial:", 3 ** 3) // Exponencial: 27
console.log("Quadrado:", 5 ** 2)    // Quadrado: 25
console.log("Cubo:", 2 ** 3)        // Cubo: 8
```

### Comparacao com Math.pow (estilo antigo)

```javascript
// Moderno (preferido)
const area = radius ** 2 * Math.PI

// Antigo (evitar)
const area = Math.pow(radius, 2) * Math.PI
```

## Exemplo completo da aula

```javascript
// Soma
console.log("Soma:", 12 + 8)             // 20

// Concatenacao (cuidado!)
console.log("Concatenação:", "12" + "8")  // 128

// Subtracao
console.log("Subtração:", 12 - 8)        // 4

// Multiplicacao
console.log("Multiplicação:", 3 * 5.5)   // 16.5

// Divisao
console.log("Divisão:", 12 / 2)          // 6

// Resto da divisao
console.log("Resto da divisão:", 12 % 2) // 0
console.log("Resto da divisão:", 13 % 2) // 1

// Exponenciacao
console.log("Exponencial:", 3 ** 3)      // 27
```