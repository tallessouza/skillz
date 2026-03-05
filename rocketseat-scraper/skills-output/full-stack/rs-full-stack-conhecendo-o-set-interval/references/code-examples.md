# Code Examples: setInterval e clearInterval

## Exemplo 1: Console.log repetido (do instrutor)

O exemplo mais basico — exibir "oi" a cada segundo:

```javascript
setInterval(() => {
  console.log("oi")
}, 1000)
// Output: "oi" a cada 1 segundo, infinitamente
```

Com 3 segundos de intervalo:

```javascript
setInterval(() => {
  console.log("oi")
}, 3000)
// Output: "oi" a cada 3 segundos
```

## Exemplo 2: Exibindo valor fixo (do instrutor)

Sem decrementar, o valor se repete:

```javascript
let value = 10

setInterval(() => {
  console.log(value)
}, 1000)
// Output: 10, 10, 10, 10... (infinitamente)
```

## Exemplo 3: Contagem regressiva SEM controle (do instrutor)

O problema: nao para no zero.

```javascript
let value = 10

setInterval(() => {
  console.log(value)
  value--
}, 1000)
// Output: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3...
```

## Exemplo 4: Contagem regressiva COM controle (do instrutor — versao final)

A solucao completa com clearInterval:

```javascript
let value = 10

const interval = setInterval(() => {
  console.log(value)
  value--

  if (value === 0) {
    console.log("Feliz Ano Novo!")
    clearInterval(interval) // interrompe o intervalo de execucoes
  }
}, 1000)
// Output: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, "Feliz Ano Novo!" (para)
```

## Variacoes praticas

### Polling de API

```javascript
let attempts = 0
const maxAttempts = 10

const pollInterval = setInterval(async () => {
  attempts++
  const response = await fetch("/api/status")
  const data = await response.json()

  if (data.status === "complete" || attempts >= maxAttempts) {
    clearInterval(pollInterval)
    console.log("Polling finalizado:", data)
  }
}, 2000)
```

### Timer com display no DOM

```javascript
let seconds = 60
const display = document.querySelector("#timer")

const timerId = setInterval(() => {
  display.textContent = `${seconds}s`
  seconds--

  if (seconds < 0) {
    display.textContent = "Tempo esgotado!"
    clearInterval(timerId)
  }
}, 1000)
```

### Cleanup em React useEffect

```javascript
useEffect(() => {
  let count = 10

  const intervalId = setInterval(() => {
    setCounter(count)
    count--

    if (count < 0) {
      clearInterval(intervalId)
    }
  }, 1000)

  // Cleanup quando componente desmonta
  return () => clearInterval(intervalId)
}, [])
```

### Comparacao lado a lado: setTimeout vs setInterval

```javascript
// setTimeout — executa UMA vez apos 3 segundos
setTimeout(() => {
  console.log("Executou uma vez")
}, 3000)

// setInterval — executa a CADA 3 segundos
const id = setInterval(() => {
  console.log("Executou novamente")
}, 3000)

// Para parar o interval:
clearInterval(id)
```

### Simulando setInterval com setTimeout recursivo

```javascript
// Alternativa com mais controle sobre o timing
function countdown(value) {
  if (value === 0) {
    console.log("Feliz Ano Novo!")
    return
  }

  console.log(value)

  setTimeout(() => {
    countdown(value - 1)
  }, 1000)
}

countdown(10)
```