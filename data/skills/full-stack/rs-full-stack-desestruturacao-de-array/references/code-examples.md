# Code Examples: Desestruturação de Array

## Exemplo 1: Destructuring básico com dados de usuário

Direto da aula — extraindo nome e email de um array:

```javascript
const data = ["Rodrigo", "rodrigo@email.com"]

// Destructuring: cria duas variáveis a partir do array
const [username, email] = data

console.log(username) // "Rodrigo"
console.log(email)    // "rodrigo@email.com"
```

## Exemplo 2: Pegando apenas o primeiro elemento

```javascript
const fruits = ["banana", "maçã", "laranja"]

// Só precisa do primeiro — omita o restante
const [banana] = fruits

console.log(banana) // "banana"
```

### Variação: nome da variável é livre

```javascript
const fruits = ["banana", "maçã", "laranja"]

const [primeiraFruta] = fruits

console.log(primeiraFruta) // "banana"
```

O nome `primeiraFruta` funciona igual porque a atribuição é por posição, não por nome.

## Exemplo 3: Ignorando o primeiro, pegando o segundo

```javascript
const fruits = ["banana", "maçã", "laranja"]

// Vírgula vazia pula a primeira posição
const [, apple] = fruits

console.log(apple) // "maçã"
```

## Exemplo 4: Ignorando primeiro e segundo, pegando o terceiro

```javascript
const fruits = ["banana", "maçã", "laranja"]

// Duas vírgulas pulam as duas primeiras posições
const [,, orange] = fruits

console.log(orange) // "laranja"
```

## Exemplo 5: Pegando primeiro e segundo

```javascript
const fruits = ["banana", "maçã", "laranja"]

const [banana, apple] = fruits

console.log(banana) // "banana"
console.log(apple)  // "maçã"
// "laranja" é ignorada (não declaramos variável para ela)
```

## Variações práticas

### Destructuring de retorno de função

```javascript
function getCoordinates() {
  return [40.7128, -74.0060]
}

const [latitude, longitude] = getCoordinates()
```

### Destructuring com valores padrão

```javascript
const [first, second, third = "default"] = ["a", "b"]

console.log(third) // "default" (não existia no array)
```

### Swap de variáveis sem temporária

```javascript
let a = 1
let b = 2

;[a, b] = [b, a]

console.log(a) // 2
console.log(b) // 1
```

### Destructuring com rest operator

```javascript
const [first, ...remaining] = [1, 2, 3, 4, 5]

console.log(first)     // 1
console.log(remaining) // [2, 3, 4, 5]
```

### React useState (caso mais comum)

```javascript
const [count, setCount] = useState(0)
const [isOpen, setIsOpen] = useState(false)
const [users, setUsers] = useState([])
```