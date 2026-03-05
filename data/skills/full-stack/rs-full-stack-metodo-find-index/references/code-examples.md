# Code Examples: findIndex()

## Exemplo 1: Busca básica (da aula)

```javascript
const values = [4, 6, 8, 12]

// Encontrar índice do primeiro valor maior que 4
console.log(values.findIndex(value => value > 4))
// Output: 1 (o 6 está na posição 1)
```

**Por que retorna 1?**
- Posição 0: 4 → não é maior que 4 (é igual)
- Posição 1: 6 → é maior que 4 ✓ → retorna 1

## Exemplo 2: Acessar elemento pelo índice (da aula)

```javascript
const values = [4, 6, 8, 12]
const index = values.findIndex(value => value > 4)

console.log(index)         // 1
console.log(values[index]) // 6
```

## Exemplo 3: Elemento não encontrado (da aula)

```javascript
const values = [4, 6, 8, 12]
console.log(values.findIndex(value => value > 12))
// Output: -1 (nenhum elemento é maior que 12)
```

## Exemplo 4: Busca em array de objetos

```javascript
const users = [
  { id: 1, name: 'Ana', active: false },
  { id: 2, name: 'Bob', active: true },
  { id: 3, name: 'Carol', active: true }
]

const firstActiveIndex = users.findIndex(user => user.active)
// firstActiveIndex = 1

if (firstActiveIndex !== -1) {
  console.log(users[firstActiveIndex].name) // 'Bob'
}
```

## Exemplo 5: Remover elemento com splice

```javascript
const tasks = ['comprar leite', 'estudar JS', 'fazer exercício']
const indexToRemove = tasks.findIndex(task => task === 'estudar JS')

if (indexToRemove !== -1) {
  tasks.splice(indexToRemove, 1)
}
// tasks = ['comprar leite', 'fazer exercício']
```

## Exemplo 6: Atualizar elemento in-place

```javascript
const products = [
  { id: 1, price: 10 },
  { id: 2, price: 20 },
  { id: 3, price: 30 }
]

const index = products.findIndex(product => product.id === 2)
if (index !== -1) {
  products[index] = { ...products[index], price: 25 }
}
```

## Exemplo 7: Comparação findIndex vs indexOf

```javascript
const numbers = [4, 6, 8, 12]

// indexOf: busca por VALOR exato
numbers.indexOf(8) // 2

// findIndex: busca por CONDIÇÃO
numbers.findIndex(n => n > 7) // 2

// indexOf não aceita callback — só valor literal
// findIndex aceita qualquer condição complexa
```

## Exemplo 8: Armadilha do índice 0

```javascript
const values = [10, 4, 6, 8]
const index = values.findIndex(value => value > 4)
// index = 0 (o 10 está na posição 0)

// ERRADO — 0 é falsy!
if (index) {
  console.log('encontrou') // NÃO EXECUTA
}

// CORRETO
if (index !== -1) {
  console.log('encontrou') // executa
}
```