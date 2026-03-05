# Code Examples: Passando Parâmetros na Requisição

## Exemplo original da aula

### Função que busca todos os produtos (comentada pelo instrutor)

```javascript
async function fetchProducts() {
  const response = await fetch("https://api.example.com/products")
  const data = await response.json()
  console.log(data)
}
```

### Nova função parametrizada

```javascript
async function fetchProductById(id) {
  const response = await fetch(`https://api.example.com/products/${id}`)
  const data = await response.json()
  console.log(data)
}

// Buscar produto 1
fetchProductById(1)

// Buscar produto 3
fetchProductById(3)
```

## Variações e extensões

### Com retorno em vez de console.log

```javascript
async function fetchProductById(id) {
  const response = await fetch(`https://api.example.com/products/${id}`)
  const product = await response.json()
  return product
}

const product = await fetchProductById(1)
console.log(product.name)
```

### Com verificação de resposta

```javascript
async function fetchProductById(id) {
  const response = await fetch(`https://api.example.com/products/${id}`)

  if (!response.ok) {
    throw new Error(`Product ${id} not found`)
  }

  const product = await response.json()
  return product
}
```

### Mesmo padrão com .then() (mencionado pelo instrutor como alternativa)

```javascript
function fetchProductById(id) {
  return fetch(`https://api.example.com/products/${id}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      return data
    })
}
```

### Múltiplos parâmetros de path

```javascript
async function fetchUserOrder(userId, orderId) {
  const response = await fetch(`https://api.example.com/users/${userId}/orders/${orderId}`)
  const order = await response.json()
  return order
}

const order = await fetchUserOrder(5, 42)
```

### Com base URL extraída

```javascript
const API_BASE_URL = "https://api.example.com"

async function fetchProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`)
  const product = await response.json()
  return product
}

async function fetchCategoryById(id) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`)
  const category = await response.json()
  return category
}
```

### Uso dinâmico com input do usuário

```javascript
const productId = document.getElementById("product-input").value

const product = await fetchProductById(productId)
document.getElementById("product-name").textContent = product.name
```

### Com query parameters (extensão do conceito)

```javascript
async function fetchProducts(category, limit) {
  const response = await fetch(
    `https://api.example.com/products?category=${category}&limit=${limit}`
  )
  const products = await response.json()
  return products
}

const electronics = await fetchProducts("electronics", 10)
```