# Code Examples: Adicionando e Removendo Itens do Array

## Exemplo completo da aula

```javascript
// Array vazio
const users = []
console.log(users) // [] (length: 0)

// push — adiciona no final do array
users.push("Rodrigo")
users.push("João")
users.push("Marcos")
console.log(users) // ["Rodrigo", "João", "Marcos"]

// unshift — adiciona no início do array
users.unshift("Ana")
console.log(users) // ["Ana", "Rodrigo", "João", "Marcos"]

// shift — remove do início do array
users.shift()
console.log(users) // ["Rodrigo", "João", "Marcos"]

// pop — remove do final do array
users.pop()
console.log(users) // ["Rodrigo", "João"]
```

## Variacoes praticas

### Carrinho de compras

```javascript
const cart = []

// Usuario adiciona produtos
cart.push({ name: "Camiseta", price: 49.90 })
cart.push({ name: "Calça", price: 129.90 })

// Usuario remove o ultimo adicionado (desfazer)
const removed = cart.pop()
console.log(`${removed.name} removido do carrinho`)
```

### Fila de atendimento (FIFO)

```javascript
const queue = []

// Clientes entram na fila (no final)
queue.push("Cliente 1")
queue.push("Cliente 2")
queue.push("Cliente 3")

// Atender o proximo (remove do inicio)
const next = queue.shift()
console.log(`Atendendo: ${next}`) // "Cliente 1"
```

### Historico de navegacao (stack)

```javascript
const history = []

// Usuario navega para paginas
history.push("/home")
history.push("/products")
history.push("/products/42")

// Botao voltar (remove do final)
history.pop() // volta de /products/42
console.log(history) // ["/home", "/products"]
```

### Adicionar item prioritario no inicio

```javascript
const tasks = ["Tarefa normal 1", "Tarefa normal 2"]

// Tarefa urgente entra no inicio
tasks.unshift("URGENTE: Fix bug em produção")
console.log(tasks[0]) // "URGENTE: Fix bug em produção"
```

### Capturando retorno dos metodos

```javascript
const items = ["a", "b", "c"]

// push retorna novo tamanho
const newLength = items.push("d")
console.log(newLength) // 4

// pop retorna elemento removido
const lastItem = items.pop()
console.log(lastItem) // "d"

// unshift retorna novo tamanho
const newLength2 = items.unshift("z")
console.log(newLength2) // 4

// shift retorna elemento removido
const firstItem = items.shift()
console.log(firstItem) // "z"
```

### Push multiplo (varios itens de uma vez)

```javascript
const colors = ["red"]

// push aceita multiplos argumentos
colors.push("green", "blue", "yellow")
console.log(colors) // ["red", "green", "blue", "yellow"]

// unshift tambem aceita multiplos
colors.unshift("white", "black")
console.log(colors) // ["white", "black", "red", "green", "blue", "yellow"]
```