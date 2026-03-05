# Code Examples: Async/Await em Requisicoes

## Exemplo 1: Fetch com .then() (da aula)

```javascript
// Utilizando fetch com .then()
fetch("http://localhost:3333/products")
  .then((response) => response.json())
  .then((data) => console.log(data))
```

Fluxo:
1. `fetch()` faz a requisicao HTTP e retorna uma Promise<Response>
2. Primeiro `.then()` recebe o Response e chama `.json()` (que retorna outra Promise)
3. Segundo `.then()` recebe os dados parseados

## Exemplo 2: Fetch com async/await (da aula)

```javascript
// Utilizando fetch com async/await
async function fetchProducts() {
  const response = await fetch("http://localhost:3333/products")
  const products = await response.json()
  console.log(products)
}

fetchProducts()
```

Fluxo:
1. `await fetch()` pausa ate a resposta HTTP chegar → atribui o Response a `response`
2. `await response.json()` pausa ate o parse completar → atribui os dados a `products`
3. `console.log()` exibe os dados

## Exemplo 3: Erro comum — esquecer await no .json()

```javascript
async function fetchProducts() {
  const response = await fetch("http://localhost:3333/products")
  const products = response.json() // SEM await!
  console.log(products) // Promise { <pending> }
}
```

O VS Code mostra o tipo como `Promise<any>` ao passar o mouse — esse e o sinal de que falta `await`.

## Exemplo 4: Variacao — POST com async/await

```javascript
async function createProduct(product) {
  const response = await fetch("http://localhost:3333/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
  const createdProduct = await response.json()
  return createdProduct
}
```

## Exemplo 5: Variacao — Multiplas requisicoes sequenciais

```javascript
async function fetchProductWithCategory(productId) {
  const productResponse = await fetch(`http://localhost:3333/products/${productId}`)
  const product = await productResponse.json()

  const categoryResponse = await fetch(`http://localhost:3333/categories/${product.categoryId}`)
  const category = await categoryResponse.json()

  return { ...product, category }
}
```

Aqui o async/await brilha: a segunda requisicao depende do resultado da primeira. Com `.then()` isso exigiria `.then()` aninhados.

## Exemplo 6: Contexto useEffect (mencionado na aula)

```javascript
// Dentro de useEffect, NAO pode usar async diretamente
useEffect(() => {
  // Opcao 1: .then() (sem criar funcao nova)
  fetch("http://localhost:3333/products")
    .then((response) => response.json())
    .then((products) => setProducts(products))

  // Opcao 2: funcao async interna
  async function loadProducts() {
    const response = await fetch("http://localhost:3333/products")
    const products = await response.json()
    setProducts(products)
  }
  loadProducts()
}, [])
```

O instrutor menciona que `.then()` e util dentro de `useEffect` quando "nao quer criar uma funcao nova".

## Exemplo 7: Equivalencia lado a lado

```javascript
// .then() — fluxo encadeado
fetch(url)
  .then((response) => response.json())
  .then((products) => {
    console.log(products)
    return products
  })

// async/await — fluxo linear
async function fetchProducts() {
  const response = await fetch(url)
  const products = await response.json()
  console.log(products)
  return products
}
```

Ambos produzem o mesmo resultado. A diferenca e estilo e legibilidade.