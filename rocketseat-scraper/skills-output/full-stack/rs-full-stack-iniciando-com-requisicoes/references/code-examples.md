# Code Examples: Requisições HTTP com Fetch

## Setup base — constante de URL

```javascript
// Sempre defina a URL base como constante no topo do módulo
const API_URL = 'http://localhost:3333'
```

## GET — Buscar lista de produtos

```javascript
async function fetchProducts() {
  const response = await fetch(`${API_URL}/products`)

  if (!response.ok) {
    throw new Error(`Erro ao buscar produtos: ${response.status}`)
  }

  const products = await response.json()
  return products
}

// Uso
const products = await fetchProducts()
console.log(products)
```

## GET — Buscar produto por ID

```javascript
async function fetchProductById(productId) {
  const response = await fetch(`${API_URL}/products/${productId}`)

  if (!response.ok) {
    throw new Error(`Produto não encontrado: ${response.status}`)
  }

  const product = await response.json()
  return product
}
```

## POST — Cadastrar novo produto

```javascript
async function createProduct({ name, price }) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, price }),
  })

  if (!response.ok) {
    throw new Error(`Erro ao cadastrar produto: ${response.status}`)
  }

  const createdProduct = await response.json()
  return createdProduct
}

// Uso
const newProduct = await createProduct({
  name: 'Teclado mecânico',
  price: 29990, // em centavos
})
console.log(newProduct)
```

## PUT — Atualizar produto existente

```javascript
async function updateProduct(productId, { name, price }) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, price }),
  })

  if (!response.ok) {
    throw new Error(`Erro ao atualizar produto: ${response.status}`)
  }

  const updatedProduct = await response.json()
  return updatedProduct
}
```

## DELETE — Remover produto

```javascript
async function deleteProduct(productId) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Erro ao remover produto: ${response.status}`)
  }
}
```

## Padrão completo — CRUD de produtos

```javascript
const API_URL = 'http://localhost:3333'

// READ (lista)
async function fetchProducts() {
  const response = await fetch(`${API_URL}/products`)
  if (!response.ok) throw new Error(`Erro: ${response.status}`)
  const products = await response.json()
  return products
}

// READ (por ID)
async function fetchProductById(productId) {
  const response = await fetch(`${API_URL}/products/${productId}`)
  if (!response.ok) throw new Error(`Erro: ${response.status}`)
  const product = await response.json()
  return product
}

// CREATE
async function createProduct({ name, price }) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price }),
  })
  if (!response.ok) throw new Error(`Erro: ${response.status}`)
  const createdProduct = await response.json()
  return createdProduct
}

// UPDATE
async function updateProduct(productId, { name, price }) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price }),
  })
  if (!response.ok) throw new Error(`Erro: ${response.status}`)
  const updatedProduct = await response.json()
  return updatedProduct
}

// DELETE
async function deleteProduct(productId) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error(`Erro: ${response.status}`)
}
```

## Chamadas paralelas com Promise.all

```javascript
async function fetchDashboardData() {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ])

  return { products, categories }
}
```

## Variação: fetch com query parameters

```javascript
async function searchProducts(query) {
  const searchParams = new URLSearchParams({ q: query })
  const response = await fetch(`${API_URL}/products?${searchParams}`)

  if (!response.ok) {
    throw new Error(`Erro na busca: ${response.status}`)
  }

  const products = await response.json()
  return products
}
```

## Anti-pattern vs pattern lado a lado

### Anti-pattern: .then() encadeado sem verificação
```javascript
// Problemático: não verifica status, nomes genéricos, callback hell lite
fetch('http://localhost:3333/products')
  .then(res => res.json())
  .then(data => {
    data.forEach(item => console.log(item))
  })
  .catch(err => console.log(err))
```

### Pattern correto: async/await com verificação
```javascript
async function fetchProducts() {
  const response = await fetch(`${API_URL}/products`)

  if (!response.ok) {
    throw new Error(`Erro ao buscar produtos: ${response.status}`)
  }

  const products = await response.json()
  return products
}

try {
  const products = await fetchProducts()
  products.forEach(product => console.log(product.name))
} catch (error) {
  console.error('Falha ao carregar produtos:', error.message)
}
```