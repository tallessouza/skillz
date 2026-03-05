# Code Examples: Convertendo String para Array

## Exemplo 1: Split por espaco (da aula)

```javascript
const fullName = 'Rodrigo Gonçalves Santana'

// Separar por espacos — cada palavra vira um indice
const nameWords = fullName.split(' ')

console.log(nameWords)
// ['Rodrigo', 'Gonçalves', 'Santana']

console.log(nameWords[0]) // 'Rodrigo'   — indice 0
console.log(nameWords[1]) // 'Gonçalves' — indice 1
console.log(nameWords[2]) // 'Santana'   — indice 2
console.log(nameWords.length) // 3
```

## Exemplo 2: Array.from para caracteres (da aula)

```javascript
const fullName = 'Rodrigo Gonçalves Santana'

// Cada caractere (incluindo espacos) vira um indice
const letters = Array.from(fullName)

console.log(letters)
// ['R', 'o', 'd', 'r', 'i', 'g', 'o', ' ', 'G', 'o', 'n', 'ç', ...]

// Espacos estao incluidos como elementos do array
console.log(letters[7]) // ' ' (espaco)
```

## Variacao: Split por virgula (CSV)

```javascript
const csvLine = 'nome,email,idade'
const columns = csvLine.split(',')
// ['nome', 'email', 'idade']
```

## Variacao: Split por quebra de linha

```javascript
const multiline = 'linha1\nlinha2\nlinha3'
const lines = multiline.split('\n')
// ['linha1', 'linha2', 'linha3']
```

## Variacao: Split com limite

```javascript
const fullName = 'Rodrigo Gonçalves Santana'
const firstAndRest = fullName.split(' ', 2)
// ['Rodrigo', 'Gonçalves'] — para no segundo elemento
```

## Variacao: Array.from com funcao de mapeamento

```javascript
const word = 'hello'
const upperLetters = Array.from(word, letter => letter.toUpperCase())
// ['H', 'E', 'L', 'L', 'O']
```

## Comparacao: split('') vs Array.from()

```javascript
const simple = 'abc'
console.log(simple.split(''))    // ['a', 'b', 'c'] — funciona
console.log(Array.from(simple))  // ['a', 'b', 'c'] — funciona

const emoji = '😀🎉'
console.log(emoji.split(''))    // ['\uD83D', '\uDE00', '\uD83C', '\uDF89'] — QUEBRADO
console.log(Array.from(emoji))  // ['😀', '🎉'] — CORRETO
```

## Caso de uso: Extrair iniciais de um nome

```javascript
const fullName = 'Rodrigo Gonçalves Santana'
const initials = fullName
  .split(' ')
  .map(word => word[0])
  .join('')
// 'RGS'
```

## Caso de uso: Contar caracteres unicos

```javascript
const text = 'banana'
const uniqueLetters = [...new Set(Array.from(text))]
// ['b', 'a', 'n']
```