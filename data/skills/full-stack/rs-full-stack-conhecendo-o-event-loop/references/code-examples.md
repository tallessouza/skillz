# Code Examples: Event Loop do JavaScript

## Exemplo 1: Ordem basica de execucao

```javascript
console.log('1 - inicio (sincrono)')

setTimeout(() => {
  console.log('2 - setTimeout (macrotask)')
}, 0)

Promise.resolve().then(() => {
  console.log('3 - Promise (microtask)')
})

console.log('4 - fim (sincrono)')
```

**Output:**
```
1 - inicio (sincrono)
4 - fim (sincrono)
3 - Promise (microtask)
2 - setTimeout (macrotask)
```

**Raciocinio passo a passo:**
1. `console.log('1')` → call stack → executa imediatamente
2. `setTimeout(cb, 0)` → call stack → delega para Web API timer → callback vai para macrotask queue
3. `Promise.resolve().then(cb)` → call stack → callback vai para microtask queue
4. `console.log('4')` → call stack → executa imediatamente
5. Call stack vazia → Event Loop checa microtasks → executa `console.log('3')`
6. Microtask queue vazia → Event Loop checa macrotasks → executa `console.log('2')`

## Exemplo 2: Microtask agendando outra microtask

```javascript
console.log('inicio')

Promise.resolve()
  .then(() => {
    console.log('promise 1')
    return Promise.resolve()
  })
  .then(() => {
    console.log('promise 2')
  })

setTimeout(() => {
  console.log('timeout')
}, 0)

console.log('fim')
```

**Output:**
```
inicio
fim
promise 1
promise 2
timeout
```

## Exemplo 3: async/await desmascarado

```javascript
async function fetchData() {
  console.log('A - antes do await (sincrono!)')
  
  const data = await fetch('/api/users')
  // tudo abaixo so executa quando a Promise resolve
  
  console.log('B - depois do await (microtask)')
  return data.json()
}

console.log('1 - inicio')
fetchData()
console.log('2 - depois de chamar fetchData')
```

**Output:**
```
1 - inicio
A - antes do await (sincrono!)
2 - depois de chamar fetchData
// ... quando fetch resolve:
B - depois do await (microtask)
```

**Ponto chave:** o codigo ANTES do primeiro `await` executa sincronamente, como qualquer funcao normal.

## Exemplo 4: Bloqueio da call stack

```javascript
console.log('inicio')

setTimeout(() => {
  console.log('timeout executou!')
}, 1000)

// Simula trabalho pesado sincrono (3 segundos)
const start = Date.now()
while (Date.now() - start < 3000) {
  // bloqueia a thread principal
}

console.log('fim do bloqueio')
```

**Output:**
```
inicio
// ... 3 segundos de espera ...
fim do bloqueio
timeout executou!    // aparece IMEDIATAMENTE apos o bloqueio
```

**Por que?** O timer de 1s ja completou na Web API durante o bloqueio, mas o callback ficou preso na macrotask queue esperando a call stack esvaziar.

## Exemplo 5: Eventos DOM e o Event Loop

```javascript
const button = document.querySelector('#myButton')

button.addEventListener('click', () => {
  console.log('click handler (macrotask)')
  
  Promise.resolve().then(() => {
    console.log('promise dentro do click (microtask)')
  })
  
  console.log('fim do click handler')
})

console.log('listener registrado')
```

**Quando o usuario clica:**
```
click handler (macrotask)
fim do click handler
promise dentro do click (microtask)
```

O click event e uma macrotask. Dentro dele, o Promise.then agenda uma microtask que executa logo apos o handler terminar (antes do proximo macrotask).

## Exemplo 6: setTimeout vs setInterval no Event Loop

```javascript
// setTimeout: agenda UMA vez
setTimeout(() => {
  console.log('timeout: executa uma vez')
}, 1000)

// setInterval: agenda REPETIDAMENTE
let count = 0
const interval = setInterval(() => {
  count++
  console.log(`interval: execucao ${count}`)
  if (count >= 3) clearInterval(interval)
}, 1000)
```

**Diferenca no Event Loop:**
- `setTimeout`: a Web API agenda UM callback na macrotask queue apos o delay
- `setInterval`: a Web API agenda callbacks REPETIDAMENTE na macrotask queue a cada intervalo

## Exemplo 7: Visualizando a prioridade completa

```javascript
console.log('1 - sincrono')

setTimeout(() => console.log('2 - macrotask (setTimeout)'), 0)

Promise.resolve().then(() => console.log('3 - microtask (Promise)'))

queueMicrotask(() => console.log('4 - microtask (queueMicrotask)'))

requestAnimationFrame(() => console.log('5 - rAF (antes do paint)'))

console.log('6 - sincrono')
```

**Output (browser):**
```
1 - sincrono
6 - sincrono
3 - microtask (Promise)
4 - microtask (queueMicrotask)
5 - rAF (antes do paint)
2 - macrotask (setTimeout)
```

**Prioridade:** sincrono > microtasks > rAF > macrotasks