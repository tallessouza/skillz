# Code Examples: Loop For

## Exemplo 1: Loop basico (0 a 9)

Direto da aula — exibe os valores da variavel de controle:

```javascript
for (let step = 0; step < 10; step++) {
  console.log(step)
}
// Output:
// 0
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
```

## Exemplo 2: Tabuada SEM for (codigo duplicado)

O instrutor mostra primeiro o problema — 11 linhas repetitivas:

```javascript
console.log(`7 x 0 = ${7 * 0}`)
console.log(`7 x 1 = ${7 * 1}`)
console.log(`7 x 2 = ${7 * 2}`)
console.log(`7 x 3 = ${7 * 3}`)
console.log(`7 x 4 = ${7 * 4}`)
console.log(`7 x 5 = ${7 * 5}`)
console.log(`7 x 6 = ${7 * 6}`)
console.log(`7 x 7 = ${7 * 7}`)
console.log(`7 x 8 = ${7 * 8}`)
console.log(`7 x 9 = ${7 * 9}`)
console.log(`7 x 10 = ${7 * 10}`)
```

## Exemplo 3: Tabuada COM for (solucao limpa)

A mesma tabuada em 3 linhas, com valor extraido para variavel:

```javascript
const number = 7
for (let step = 0; step <= 10; step++) {
  console.log(`${number} x ${step} = ${number * step}`)
}
// Output:
// 7 x 0 = 0
// 7 x 1 = 7
// 7 x 2 = 14
// 7 x 3 = 21
// 7 x 4 = 28
// 7 x 5 = 35
// 7 x 6 = 42
// 7 x 7 = 49
// 7 x 8 = 56
// 7 x 9 = 63
// 7 x 10 = 70
```

## Variacoes adicionais

### Contagem regressiva

```javascript
for (let countdown = 10; countdown >= 0; countdown--) {
  console.log(countdown)
}
// 10, 9, 8, ... 0
```

### Incremento customizado (pular de 2 em 2)

```javascript
for (let step = 0; step <= 20; step += 2) {
  console.log(step)
}
// 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
```

### Tabuada generica (funcao reutilizavel)

```javascript
function printMultiplicationTable(number) {
  for (let multiplier = 0; multiplier <= 10; multiplier++) {
    console.log(`${number} x ${multiplier} = ${number * multiplier}`)
  }
}

printMultiplicationTable(7)
printMultiplicationTable(9)
```

### Loop com indice para acessar posicoes

```javascript
const fruits = ["maca", "banana", "laranja"]
for (let index = 0; index < fruits.length; index++) {
  console.log(`${index}: ${fruits[index]}`)
}
// 0: maca
// 1: banana
// 2: laranja
```