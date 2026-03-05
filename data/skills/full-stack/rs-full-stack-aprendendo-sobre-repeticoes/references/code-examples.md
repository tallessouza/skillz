# Code Examples: Estruturas de Repetição

## Exemplo base da aula — Mário

```javascript
// Estado inicial: Mário no bloco 1
let step = 1

// Condição: enquanto não chegou ao bloco 6
while (step < 6) {
  // Incrementa o passo
  step++
  // Mário anda para o próximo bloco
  marioAndar()
}

// Após o loop, Mário pula
marioPular()
// Resultado: cogumelo!
```

## Variação: usando for em vez de while

```javascript
// O for encapsula os 3 componentes em uma linha
for (let step = 1; step < 6; step++) {
  marioAndar()
}

marioPular()
```

## Variação: verificação no final (do...while)

```javascript
let step = 1

do {
  marioAndar()
  step++
} while (step < 6)

// Diferença: se step já fosse 6, o Mário andaria 1 vez antes de verificar
marioPular()
```

## Comparação: código duplicado vs loop

### Sem loop (ruim)

```javascript
console.log("Bloco 1")
console.log("Bloco 2")
console.log("Bloco 3")
console.log("Bloco 4")
console.log("Bloco 5")
```

### Com loop (bom)

```javascript
for (let bloco = 1; bloco <= 5; bloco++) {
  console.log(`Bloco ${bloco}`)
}
```

## Exemplo prático: contagem regressiva

```javascript
let countdown = 10

while (countdown > 0) {
  console.log(countdown)
  countdown--
}

console.log("Go!")
```

## Exemplo prático: somar números de 1 a 100

```javascript
let sum = 0

for (let number = 1; number <= 100; number++) {
  sum += number
}

console.log(sum) // 5050
```

## Exemplo: loop infinito (o que NÃO fazer)

```javascript
// PERIGO: sem incremento, step é sempre 1, loop nunca para
let step = 1

while (step < 6) {
  marioAndar()
  // Esqueceu: step++
  // Resultado: loop infinito, programa trava
}
```

## Exemplo: condição já falsa (loop não executa)

```javascript
let step = 10

// 10 < 6? Não. O bloco nunca executa.
while (step < 6) {
  console.log("Isso nunca aparece")
  step++
}

console.log("Pulou direto para cá")
```

## Exemplo: off-by-one

```javascript
// step < 6 → executa para step = 1, 2, 3, 4, 5 (5 vezes)
for (let step = 1; step < 6; step++) {
  console.log(step) // 1, 2, 3, 4, 5
}

// step <= 6 → executa para step = 1, 2, 3, 4, 5, 6 (6 vezes)
for (let step = 1; step <= 6; step++) {
  console.log(step) // 1, 2, 3, 4, 5, 6
}
```