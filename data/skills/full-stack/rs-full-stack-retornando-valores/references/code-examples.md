# Code Examples: Retornando Valores de Funções

## Exemplo 1: Funcao sem return (valor preso)

```javascript
function sum(a, b) {
  const result = a + b
  console.log(result)
}

sum(7, 3)  // exibe 10
sum(7, 7)  // exibe 14
// Funciona para exibir, mas o valor nao pode ser reutilizado
```

## Exemplo 2: Funcao com return

```javascript
function sum(a, b) {
  const result = a + b
  return result
}

const response = sum(7, 7)
console.log(response) // 14
```

## Exemplo 3: Return usado diretamente no console.log

```javascript
function sum(a, b) {
  const result = a + b
  return result
}

console.log(sum(5, 6)) // 11
```

## Exemplo 4: O que acontece sem return

```javascript
function sum(a, b) {
  const result = a + b
  // sem return
}

const response = sum(7, 7)
console.log(response) // undefined
```

## Variacoes adicionais

### Return direto sem variavel intermediaria

```javascript
function sum(a, b) {
  return a + b
}
```

### Usando retorno em operacoes subsequentes

```javascript
function sum(a, b) {
  return a + b
}

const firstSum = sum(10, 20)
const secondSum = sum(firstSum, 5)
console.log(secondSum) // 35
```

### Retorno usado em condicional

```javascript
function sum(a, b) {
  return a + b
}

if (sum(3, 4) > 5) {
  console.log("Soma maior que 5")
}
```

### Retorno como argumento de outra funcao

```javascript
function sum(a, b) {
  return a + b
}

function double(value) {
  return value * 2
}

console.log(double(sum(3, 4))) // 14
```