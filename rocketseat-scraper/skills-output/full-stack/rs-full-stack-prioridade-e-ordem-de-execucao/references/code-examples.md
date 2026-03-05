# Code Examples: Prioridade e Ordem de Execução no Event Loop

## Exemplo original da aula

```javascript
console.log(1)                          // síncrono → imprime 1

queueMicrotask(() => {
  console.log(2)                        // microtask → imprime 2
})

setTimeout(() => {
  console.log(3)                        // macrotask → imprime 3
}, 1000)

console.log(4)                          // síncrono → imprime 4

Promise.resolve(true).then(() => {
  console.log(5)                        // microtask → imprime 5
})

// Output: 1, 4, 2, 5, 3
```

## Variação: setTimeout com delay 0

```javascript
console.log('A')

setTimeout(() => console.log('B'), 0)   // macrotask mesmo com 0ms

queueMicrotask(() => console.log('C'))   // microtask

console.log('D')

// Output: A, D, C, B
// setTimeout(fn, 0) ainda é macrotask — executa depois das microtasks
```

## Variação: Microtask gerando microtask

```javascript
console.log(1)

queueMicrotask(() => {
  console.log(2)
  queueMicrotask(() => console.log(3))  // microtask dentro de microtask
})

setTimeout(() => console.log(4), 0)

console.log(5)

// Output: 1, 5, 2, 3, 4
// A microtask interna (3) executa ANTES da macrotask (4)
// porque a fila de microtasks é esvaziada completamente
```

## Variação: Múltiplas promises

```javascript
console.log(1)

Promise.resolve().then(() => console.log(2))
Promise.resolve().then(() => console.log(3))
Promise.resolve().then(() => console.log(4))

setTimeout(() => console.log(5), 0)

console.log(6)

// Output: 1, 6, 2, 3, 4, 5
// Todas as promises (microtasks) executam na ordem de registro, antes do setTimeout
```

## Variação: async/await é syntactic sugar para promises

```javascript
async function example() {
  console.log(1)                        // síncrono dentro do async
  await Promise.resolve()               // pausa aqui — o que vem depois vira microtask
  console.log(2)                        // microtask (depois do await)
}

console.log(3)
example()
console.log(4)
setTimeout(() => console.log(5), 0)

// Output: 3, 1, 4, 2, 5
// 3 e 1 são síncronos, 4 é síncrono, 2 é microtask (após await), 5 é macrotask
```

## Variação: Misturando tudo

```javascript
setTimeout(() => console.log('timeout 1'), 0)

Promise.resolve().then(() => {
  console.log('promise 1')
  setTimeout(() => console.log('timeout 2'), 0)
})

queueMicrotask(() => {
  console.log('microtask 1')
  Promise.resolve().then(() => console.log('promise 2'))
})

console.log('sync')

// Output:
// sync          — síncrono
// promise 1     — microtask (promise, registrada primeiro)
// microtask 1   — microtask (queueMicrotask, registrada segundo)
// promise 2     — microtask gerada dentro de microtask
// timeout 1     — macrotask (registrada primeiro)
// timeout 2     — macrotask (registrada dentro de promise 1)
```

## Template mental para prever ordem

```javascript
// Passo 1: Marque cada operação
console.log('X')                    // [SYNC]
queueMicrotask(() => ...)           // [MICRO] — registra
setTimeout(() => ..., N)            // [MACRO] — registra
Promise.resolve().then(() => ...)   // [MICRO] — registra
await something                     // [MICRO] — tudo após await

// Passo 2: Execute na ordem
// 1º: Todos os [SYNC] na ordem do código
// 2º: Todos os [MICRO] na ordem de registro (esvazia fila completamente)
// 3º: Todos os [MACRO] na ordem de registro
```