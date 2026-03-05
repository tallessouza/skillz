# Code Examples: indexOf e splice

## Exemplo 1: Fluxo basico do instrutor

```javascript
let fruits = ["apple", "watermelon", "strawberry"]

// Encontrar posicao
let position = fruits.indexOf("watermelon")
console.log(position) // 1

position = fruits.indexOf("apple")
console.log(position) // 0

position = fruits.indexOf("strawberry")
console.log(position) // 2
```

## Exemplo 2: Item nao encontrado

```javascript
let fruits = ["apple", "watermelon", "strawberry"]

let position = fruits.indexOf("orange")
console.log(position) // -1
```

## Exemplo 3: splice removendo multiplos itens

```javascript
let fruits = ["apple", "watermelon", "lemon", "strawberry"]

// A partir do indice 1, remove 3 itens
fruits.splice(1, 3)
console.log(fruits) // ["apple"]
```

```javascript
let fruits = ["apple", "watermelon", "lemon", "strawberry"]

// A partir do indice 1, remove 2 itens
fruits.splice(1, 2)
console.log(fruits) // ["apple", "strawberry"]
```

## Exemplo 4: Remover item especifico (padrao completo do instrutor)

```javascript
let fruits = ["apple", "watermelon", "lemon", "strawberry"]

let position = fruits.indexOf("lemon")
fruits.splice(position, 1)
console.log(fruits) // ["apple", "watermelon", "strawberry"]
// Lemon removido do meio, demais itens permanecem
```

## Exemplo 5: Padrao seguro com validacao de -1

```javascript
function removeFromArray(array, item) {
  const position = array.indexOf(item)
  if (position !== -1) {
    array.splice(position, 1)
  }
  return array
}

const fruits = ["apple", "watermelon", "lemon", "strawberry"]
removeFromArray(fruits, "lemon")    // ["apple", "watermelon", "strawberry"]
removeFromArray(fruits, "orange")   // ["apple", "watermelon", "strawberry"] (nao muda)
```

## Exemplo 6: Splice retorna os itens removidos

```javascript
const fruits = ["apple", "watermelon", "lemon", "strawberry"]
const removed = fruits.splice(1, 2)

console.log(removed) // ["watermelon", "lemon"]
console.log(fruits)  // ["apple", "strawberry"]
```

## Exemplo 7: Variacao — remover todas as ocorrencias

```javascript
function removeAll(array, item) {
  let position = array.indexOf(item)
  while (position !== -1) {
    array.splice(position, 1)
    position = array.indexOf(item)
  }
  return array
}

const numbers = [1, 2, 3, 2, 4, 2]
removeAll(numbers, 2) // [1, 3, 4]
```

## Exemplo 8: Alternativa imutavel com filter

```javascript
// Quando nao quer modificar o array original
const fruits = ["apple", "watermelon", "lemon", "strawberry"]
const withoutLemon = fruits.filter(fruit => fruit !== "lemon")

console.log(withoutLemon) // ["apple", "watermelon", "strawberry"]
console.log(fruits)       // ["apple", "watermelon", "lemon", "strawberry"] (intacto)
```