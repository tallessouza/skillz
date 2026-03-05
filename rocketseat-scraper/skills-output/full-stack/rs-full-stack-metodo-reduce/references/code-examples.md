# Code Examples: Método reduce()

## Exemplo base da aula — soma simples

```javascript
const values = [1, 2, 3, 4, 5]

const sum = values.reduce((accumulator, currentValue, index) => {
  console.log("Acumulador:", accumulator)
  console.log("Current Value:", currentValue)
  console.log("Index:", index)
  console.log("Soma:", accumulator + currentValue)
  console.log("########")

  return accumulator + currentValue
}, 0)

console.log("Resultado final:", sum) // 15
```

## Mesmo exemplo com valor inicial 10

```javascript
const values = [1, 2, 3, 4, 5]

const sum = values.reduce((accumulator, currentValue) => {
  return accumulator + currentValue
}, 10)

console.log(sum) // 25
```

## Versao limpa (producao)

```javascript
const values = [1, 2, 3, 4, 5]
const sum = values.reduce((total, value) => total + value, 0)
// 15
```

## Variacoes praticas

### Soma de precos de produtos

```typescript
interface Product {
  name: string
  price: number
}

const products: Product[] = [
  { name: "Camiseta", price: 4990 },
  { name: "Calca", price: 8990 },
  { name: "Tenis", price: 15990 },
]

const totalInCents = products.reduce((total, product) => {
  return total + product.price
}, 0)
// 29970
```

### Carrinho de compras com quantidade

```typescript
interface CartItem {
  name: string
  priceInCents: number
  quantity: number
}

const cart: CartItem[] = [
  { name: "Mouse", priceInCents: 5990, quantity: 2 },
  { name: "Teclado", priceInCents: 12990, quantity: 1 },
]

const cartTotalInCents = cart.reduce((total, item) => {
  return total + item.priceInCents * item.quantity
}, 0)
// 24970
```

### Agrupar por categoria

```typescript
const products = [
  { name: "Mouse", category: "perifericos" },
  { name: "Teclado", category: "perifericos" },
  { name: "Monitor", category: "monitores" },
]

const productsByCategory = products.reduce((grouped, product) => {
  const key = product.category
  grouped[key] = grouped[key] || []
  grouped[key].push(product)
  return grouped
}, {} as Record<string, typeof products>)
// { perifericos: [...], monitores: [...] }
```

### Contar ocorrencias

```typescript
const fruits = ["maca", "banana", "maca", "laranja", "banana", "maca"]

const fruitCount = fruits.reduce((count, fruit) => {
  count[fruit] = (count[fruit] || 0) + 1
  return count
}, {} as Record<string, number>)
// { maca: 3, banana: 2, laranja: 1 }
```

### Encontrar maior valor

```typescript
const scores = [72, 85, 91, 68, 95, 80]

const highestScore = scores.reduce((highest, score) => {
  return score > highest ? score : highest
}, 0)
// 95
```

### Flatten array (achatar)

```typescript
const nested = [[1, 2], [3, 4], [5, 6]]

const flat = nested.reduce((flattened, group) => {
  return [...flattened, ...group]
}, [] as number[])
// [1, 2, 3, 4, 5, 6]
```

### Construir string a partir de array

```typescript
const words = ["JavaScript", "e", "incrivel"]

const sentence = words.reduce((phrase, word, index) => {
  return index === 0 ? word : `${phrase} ${word}`
}, "")
// "JavaScript e incrivel"
```