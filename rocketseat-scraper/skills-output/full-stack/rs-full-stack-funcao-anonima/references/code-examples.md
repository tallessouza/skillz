# Code Examples: Função Anônima

## Exemplo 1: Função anônima básica sem parâmetros

```javascript
// Armazena a função (não o retorno) na constante
const showMessage1 = function() {
  return "Olá, Rodrigo"
}

// Inspeciona o conteúdo da variável — mostra [Function]
console.log(showMessage1)
// Output: [Function: showMessage1]

// Executa a função com parênteses
console.log(showMessage1())
// Output: "Olá, Rodrigo"
```

## Exemplo 2: Com um parâmetro

```javascript
const showMessage2 = function(name) {
  return "Olá, " + name
}

console.log(showMessage2("Rodrigo"))
// Output: "Olá, Rodrigo"

console.log(showMessage2("João"))
// Output: "Olá, João"
```

## Exemplo 3: Com múltiplos parâmetros

```javascript
const showMessage = function(message, name) {
  return message + " " + name
}

console.log(showMessage("Olá", "Rodrigo"))
// Output: "Olá Rodrigo"

console.log(showMessage("Bem-vindo", "Maria"))
// Output: "Bem-vindo Maria"
```

## Exemplo 4: Comparação — declaração vs expressão

```javascript
// Função nomeada (declaration) — tem hoisting
function saudacao() {
  return "Olá!"
}

// Função anônima (expression) — sem hoisting
const saudacao2 = function() {
  return "Olá!"
}

// Ambas se comportam igual na chamada
console.log(saudacao())   // "Olá!"
console.log(saudacao2())  // "Olá!"
```

## Exemplo 5: Erro comum — esquecer parênteses

```javascript
const calcular = function(a, b) {
  return a + b
}

// ERRADO: mostra a função, não o resultado
console.log(calcular)
// Output: [Function: calcular]

// CORRETO: executa e mostra o resultado
console.log(calcular(2, 3))
// Output: 5
```

## Exemplo 6: Usando como callback (aplicação real)

```javascript
// Função anônima passada diretamente como argumento
const numeros = [1, 2, 3, 4, 5]

const dobrados = numeros.map(function(numero) {
  return numero * 2
})

console.log(dobrados)
// Output: [2, 4, 6, 8, 10]
```

## Exemplo 7: Armazenada em variável e passada como referência

```javascript
const dobrar = function(numero) {
  return numero * 2
}

const numeros = [1, 2, 3, 4, 5]
const dobrados = numeros.map(dobrar) // passa a referência, sem ()

console.log(dobrados)
// Output: [2, 4, 6, 8, 10]
```