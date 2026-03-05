# Code Examples: Criando e Acessando Arrays

## Exemplo 1: Criacao basica (da aula)

```javascript
// Criando o array com notacao de colchetes
const fruits = ["apple", "banana", "orange"]

// Exibindo o conteudo
console.log(fruits)
// Output: ["apple", "banana", "orange"]

// Verificando o tamanho
console.log(fruits.length)
// Output: 3
```

## Exemplo 2: Acesso por indice (da aula)

```javascript
const fruits = ["apple", "banana", "orange"]

console.log(fruits[0]) // "apple"
console.log(fruits[1]) // "banana"
console.log(fruits[2]) // "orange"
```

## Exemplo 3: Acesso a indice inexistente (da aula)

```javascript
const fruits = ["apple", "banana", "orange"]

console.log(fruits[7]) // undefined — nao lanca erro!
```

## Exemplo 4: Ultimo item com indice fixo vs dinamico (da aula)

```javascript
// FRAGIL: indice fixo
const fruits = ["apple", "banana", "orange"]
console.log(fruits[2]) // "orange" — funciona agora

// Mas se adicionar um item...
const fruits2 = ["apple", "banana", "orange", "watermelon"]
console.log(fruits2[2]) // "orange" — ERRADO, queriamos o ultimo!

// CORRETO: acesso dinamico
console.log(fruits2[fruits2.length - 1]) // "watermelon"
```

## Exemplo 5: Por que length - 1 e nao length

```javascript
const fruits = ["apple", "banana", "orange", "watermelon"]

console.log(fruits.length)     // 4 (quantidade de itens)
console.log(fruits[4])         // undefined (indice 4 NAO existe)
console.log(fruits[4 - 1])     // "watermelon" (indice 3 = ultimo)
console.log(fruits[fruits.length - 1]) // "watermelon" (forma dinamica)
```

## Variacoes adicionais

### Array de numeros

```javascript
const prices = [29.90, 49.90, 99.90]
const lastPrice = prices[prices.length - 1] // 99.90
```

### Array vazio

```javascript
const empty = []
console.log(empty.length)        // 0
console.log(empty[0])            // undefined
console.log(empty[empty.length - 1]) // undefined (length e 0, indice -1)
```

### Usando .at() (ES2022+)

```javascript
const fruits = ["apple", "banana", "orange"]
console.log(fruits.at(0))   // "apple"
console.log(fruits.at(-1))  // "orange" (ultimo)
console.log(fruits.at(-2))  // "banana" (penultimo)
```