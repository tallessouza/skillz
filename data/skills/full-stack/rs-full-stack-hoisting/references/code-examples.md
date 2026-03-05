# Code Examples: Hoisting em JavaScript

## 1. Hoisting com var — o comportamento problematico

```javascript
// O que voce escreve:
console.log(cidade)  // undefined
var cidade = 'Sao Paulo'
console.log(cidade)  // 'Sao Paulo'

// O que o JavaScript interpreta:
var cidade
console.log(cidade)  // undefined
cidade = 'Sao Paulo'
console.log(cidade)  // 'Sao Paulo'
```

## 2. Hoisting com let — erro explicito (melhor)

```javascript
console.log(cidade)  // ReferenceError: Cannot access 'cidade' before initialization
let cidade = 'Sao Paulo'
```

## 3. Hoisting com const — mesmo comportamento que let

```javascript
console.log(cidade)  // ReferenceError: Cannot access 'cidade' before initialization
const cidade = 'Sao Paulo'
```

## 4. var vaza do bloco — problema classico

```javascript
if (true) {
  var nome = 'Maria'
}
console.log(nome)  // 'Maria' — var ignorou o bloco, vazou para fora

if (true) {
  let sobrenome = 'Silva'
}
console.log(sobrenome)  // ReferenceError — let respeitou o bloco
```

## 5. var no for loop — bug classico

```javascript
// Com var — todas as funcoes capturam o mesmo i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Output: 3, 3, 3 (nao 0, 1, 2!)

// Com let — cada iteracao tem seu proprio i
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Output: 0, 1, 2 (correto!)
```

## 6. Hoisting de funcoes — comportamento completo

```javascript
// Funciona — function declaration sofre hoisting completo
calcular(5, 3)

function calcular(a, b) {
  return a + b
}

// NAO funciona — function expression nao sofre hoisting completo
multiplicar(5, 3)  // TypeError: multiplicar is not a function

var multiplicar = function(a, b) {
  return a * b
}
```

## 7. Organizando codigo com hoisting de funcoes

```javascript
// Gracas ao hoisting, voce pode organizar o "fluxo principal" no topo
// e as definicoes de funcoes abaixo — leitura mais intuitiva

const usuarios = buscarUsuarios()
const ativos = filtrarAtivos(usuarios)
exibirLista(ativos)

function buscarUsuarios() {
  return [{ nome: 'Ana', ativo: true }, { nome: 'Carlos', ativo: false }]
}

function filtrarAtivos(lista) {
  return lista.filter(u => u.ativo)
}

function exibirLista(lista) {
  lista.forEach(u => console.log(u.nome))
}
```

## 8. Refatorando var para let/const

```javascript
// ANTES (codigo legado)
var API_URL = 'https://api.example.com'
var tentativas = 0
var dados = null

for (var i = 0; i < items.length; i++) {
  var item = items[i]
  // processar...
}

// DEPOIS (codigo moderno)
const API_URL = 'https://api.example.com'  // nunca muda -> const
let tentativas = 0                          // sera incrementado -> let
let dados = null                            // sera reatribuido -> let

for (let i = 0; i < items.length; i++) {    // escopo de bloco -> let
  const item = items[i]                     // nao muda na iteracao -> const
  // processar...
}
```

## 9. Escopo de funcao — todos se comportam igual

```javascript
function exemplo() {
  var a = 1
  let b = 2
  const c = 3
  
  console.log(a, b, c)  // 1, 2, 3 — todos acessiveis
}

exemplo()
console.log(a)  // ReferenceError — var tambem tem escopo de funcao
console.log(b)  // ReferenceError
console.log(c)  // ReferenceError
```