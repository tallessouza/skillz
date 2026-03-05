# Code Examples: Desestruturação de Objetos

## Exemplo 1: Desestruturação básica (da aula)

```javascript
const product = {
  description: "Teclado",
  price: 150
}

const { description, price } = product

console.log(`Descrição: ${description}`) // "Teclado"
console.log(`Preço: ${price}`)           // 150
```

## Exemplo 2: Função com parâmetros posicionais — o problema (da aula)

```javascript
function newProduct(description, price) {
  console.log("### Novo produto")
  console.log(`Descrição: ${description}`)
  console.log(`Preço: ${price}`)
}

// Ordem correta — funciona
newProduct("Mouse", 70)
// Descrição: Mouse
// Preço: 70

// Ordem invertida — BUG silencioso
newProduct(70, "Mouse")
// Descrição: 70
// Preço: Mouse
```

## Exemplo 3: Função com parâmetros desestruturados — a solução (da aula)

```javascript
function newProduct({ description, price }) {
  console.log("### Novo produto")
  console.log(`Descrição: ${description}`)
  console.log(`Preço: ${price}`)
}

// Ordem A — funciona
newProduct({ description: "Mouse", price: 70 })
// Descrição: Mouse
// Preço: 70

// Ordem B — também funciona
newProduct({ price: 70, description: "Mouse" })
// Descrição: Mouse
// Preço: 70
```

## Variações adicionais

### Com valores padrão

```javascript
const { description, price, stock = 0 } = product
// Se product não tem stock, usa 0
```

### Com renomeação

```javascript
const { description: productName, price: productPrice } = product
console.log(productName)  // "Teclado"
console.log(productPrice) // 150
```

### Desestruturação em parâmetros com TypeScript

```typescript
interface ProductInput {
  description: string
  price: number
  stock?: number
}

function createProduct({ description, price, stock = 0 }: ProductInput) {
  console.log(`${description} - R$${price} (${stock} em estoque)`)
}
```

### Desestruturação aninhada

```javascript
const order = {
  id: 1,
  product: {
    description: "Teclado",
    price: 150
  }
}

const { product: { description, price } } = order
console.log(description) // "Teclado"
```

### Desestruturação em loops

```javascript
const products = [
  { description: "Teclado", price: 150 },
  { description: "Mouse", price: 70 }
]

for (const { description, price } of products) {
  console.log(`${description}: R$${price}`)
}
```

### Rest com desestruturação

```javascript
const product = { description: "Teclado", price: 150, stock: 30, category: "Periféricos" }

const { description, ...rest } = product
console.log(description) // "Teclado"
console.log(rest)        // { price: 150, stock: 30, category: "Periféricos" }
```