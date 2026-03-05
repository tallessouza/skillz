# Code Examples: Incremento e Decremento

## Exemplo 1: Setup basico (da aula)

```javascript
let number = 10
console.log(number) // 10
```

## Exemplo 2: Incremento classico vs operador

```javascript
// Forma verbosa
let number = 10
number = number + 1
console.log(number) // 11

// Forma com operador de incremento
let number2 = 10
number2++
console.log(number2) // 11
```

## Exemplo 3: Sufixo (incrementa apos)

```javascript
let number = 10
number++
console.log(number++) // 11 — mostra 11, depois incrementa para 12
console.log(number)   // 12 — agora reflete o segundo incremento
```

## Exemplo 4: Prefixo (incrementa antes)

```javascript
let number = 12 // continuando do exemplo anterior
console.log(++number) // 13 — incrementa primeiro, depois mostra
```

## Exemplo 5: Decremento sufixo

```javascript
let number = 13
number--           // decrementa apos — number agora e 12
console.log(number) // 12
```

## Exemplo 6: Decremento prefixo

```javascript
let number = 12
console.log(--number) // 11 — decrementa antes de mostrar
```

## Exemplo 7: Operador += (adicionar mais que 1)

```javascript
let number = 12
number += 10
console.log(number) // 22
```

## Exemplo 8: Operador -= (remover mais que 1)

```javascript
let number = 22
number -= 2
console.log(number) // 20
```

## Exemplo 9: Equivalencia dos operadores compostos

```javascript
let number = 20

// Estas duas formas sao equivalentes:
number = number + 20 // forma verbosa
console.log(number)  // 40

number = number - 20 // forma verbosa
console.log(number)  // 20

// Forma concisa equivalente:
let n = 20
n += 20         // 40
console.log(n)  // 40
n -= 20         // 20
console.log(n)  // 20
```

## Variacoes praticas

### Em loops for
```javascript
// Uso mais comum de i++
for (let i = 0; i < 5; i++) {
  console.log(i) // 0, 1, 2, 3, 4
}

// Contagem regressiva com i--
for (let i = 5; i > 0; i--) {
  console.log(i) // 5, 4, 3, 2, 1
}
```

### Em while loops
```javascript
let attempts = 0
while (attempts < 3) {
  console.log(`Tentativa ${++attempts}`) // 1, 2, 3 — prefixo para mostrar valor correto
}
```

### Acumuladores
```javascript
const prices = [10, 20, 30]
let total = 0
for (const price of prices) {
  total += price // += para somar valores variados
}
console.log(total) // 60
```

### Contadores condicionais
```javascript
const items = ['a', 'b', 'a', 'c', 'a']
let countA = 0
for (const item of items) {
  if (item === 'a') countA++
}
console.log(countA) // 3
```