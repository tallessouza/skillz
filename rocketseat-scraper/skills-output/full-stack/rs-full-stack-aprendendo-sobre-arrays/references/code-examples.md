# Code Examples: Arrays — Coleções Ordenadas com Índices

## Exemplo 1: Array de frutas (da aula)

```javascript
// Criando o array de frutas
const fruits = ["maçã", "abacaxi", "melancia", "banana", "uva"]

// Visualização dos índices:
// Índice:  0        1          2         3        4
// Valor:  maçã   abacaxi   melancia   banana    uva

// Acessando pelo índice
console.log(fruits[2]) // "melancia"
console.log(fruits[0]) // "maçã"
```

## Exemplo 2: Analogia dos compartimentos de correio

```javascript
// Simulando a caixa de correio do prédio
const caixaDeCorreio = new Array(100) // 100 compartimentos

// Índices vão de 0 a 99
console.log(caixaDeCorreio.length) // 100
// Primeiro compartimento: caixaDeCorreio[0]
// Último compartimento: caixaDeCorreio[99]

// Colocando cartas nos compartimentos
caixaDeCorreio[0] = "Carta para apartamento 1"
caixaDeCorreio[99] = "Carta para apartamento 100"
```

## Exemplo 3: Relação length vs último índice

```javascript
const colors = ["red", "green", "blue"]
console.log(colors.length)     // 3 (três elementos)
console.log(colors[0])         // "red" (primeiro)
console.log(colors[2])         // "blue" (último = length - 1 = 2)
console.log(colors[3])         // undefined (não existe)
```

## Exemplo 4: Diferentes tipos de dados em arrays

```javascript
// Arrays podem conter qualquer tipo
const mixed = [42, "texto", true, null, undefined]
//             [0]   [1]    [2]   [3]     [4]

console.log(mixed[0]) // 42
console.log(mixed[1]) // "texto"
console.log(mixed[2]) // true
```

## Exemplo 5: Variações de acesso

```javascript
const animals = ["gato", "cachorro", "pássaro", "peixe"]

// Acesso direto
console.log(animals[0]) // "gato"

// Acesso com variável
const index = 2
console.log(animals[index]) // "pássaro"

// Último elemento
console.log(animals[animals.length - 1]) // "peixe"

// Verificando se índice existe
if (animals[5] === undefined) {
  console.log("Índice 5 não existe neste array")
}
```

## Exemplo 6: Contagem zero-based na prática

```javascript
// O instrutor enfatiza: "são 5 posições, mas vai de 0 a 4"
const frutas = ["maçã", "abacaxi", "melancia", "banana", "uva"]

// Quantas frutas? 5
console.log(frutas.length) // 5

// Mas os índices vão de 0 a 4
// frutas[0] = "maçã"      ← primeiro
// frutas[1] = "abacaxi"
// frutas[2] = "melancia"
// frutas[3] = "banana"
// frutas[4] = "uva"        ← último (5 - 1 = 4)
// frutas[5] = undefined    ← não existe!
```