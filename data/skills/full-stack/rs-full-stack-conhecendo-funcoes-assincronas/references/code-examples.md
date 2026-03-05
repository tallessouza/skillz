# Code Examples: Funções Assíncronas

## Exemplo 1: Funcao que busca produtos do banco (cenario do instrutor)

```typescript
// O instrutor descreve exatamente este cenario:
// "voce tem uma funcao que lista os produtos cadastrados em um banco de dados"

// ERRADO — sem async/await
function getProducts() {
  const products = database.query("SELECT * FROM products")
  return products // retorna uma Promise, nao os produtos!
}

// CORRETO — com async/await
async function getProducts() {
  const products = await database.query("SELECT * FROM products")
  return products // retorna os produtos de fato
}
```

## Exemplo 2: Consumindo o resultado

```typescript
// ERRADO — esqueceu await ao consumir
async function showProducts() {
  const products = getProducts() // Promise, nao array!
  console.log(products.length)   // undefined — Promise nao tem .length
}

// CORRETO
async function showProducts() {
  const products = await getProducts()
  console.log(products.length) // funciona: products e um array
}
```

## Exemplo 3: Tratando resolve e reject

```typescript
// O instrutor explica que a Promise pode ser resolvida ou rejeitada
// "o banco esta indisponivel, algum problema surge, algum erro,
//  ele vai lancar uma excecao e a promise vai ser rejeitada"

async function getProducts() {
  try {
    const products = await database.query("SELECT * FROM products")
    return products // Promise resolvida — "deu tudo certo, ta aqui o retorno"
  } catch (error) {
    // Promise rejeitada — "banco indisponivel, algum problema"
    console.error("Falha ao buscar produtos:", error.message)
    throw error
  }
}
```

## Exemplo 4: Fire-and-forget (sem await proposital)

```typescript
// Quando voce NAO precisa do resultado, nao use await
async function handlePurchase(order: Order) {
  const result = await processPayment(order) // precisa esperar

  // Log de analytics — nao precisa esperar
  trackAnalytics("purchase_completed", order.id).catch(console.error)

  return result
}
```

## Exemplo 5: Chamadas paralelas vs sequenciais

```typescript
// SEQUENCIAL — cada chamada espera a anterior (mais lento)
async function loadDashboard() {
  const users = await getUsers()        // espera...
  const products = await getProducts()  // so comeca depois
  const orders = await getOrders()      // so comeca depois
  return { users, products, orders }
}

// PARALELO — todas comecam ao mesmo tempo (mais rapido)
async function loadDashboard() {
  const [users, products, orders] = await Promise.all([
    getUsers(),
    getProducts(),
    getOrders(),
  ])
  return { users, products, orders }
}
```

## Exemplo 6: async sem await — desnecessario

```typescript
// DESNECESSARIO — nao precisa de async se nao tem await
async function formatPrice(cents: number) {
  return (cents / 100).toFixed(2)
}

// CORRETO — funcao sincrona pura
function formatPrice(cents: number) {
  return (cents / 100).toFixed(2)
}
```

## Exemplo 7: Top-level await (ES Modules)

```typescript
// Em ES Modules, await funciona no top-level
// arquivo: setup.ts (com "type": "module" no package.json)

const config = await loadConfig()
const db = await connectDatabase(config.databaseUrl)

export { db }
```