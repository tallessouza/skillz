# Code Examples: Utilizando o Fetch

## Exemplo 1: Fetch sincrono (ERRADO)

```javascript
// ERRADO: fetch retorna Promise, nao dados
const response = fetch("http://localhost:3333/products")
console.log(response)
// Output: Promise { <pending> }
```

**Por que esta errado:** fetch e assincrono. Atribuir a uma variavel e fazer console.log imediatamente mostra apenas a Promise pendente.

## Exemplo 2: Primeiro .then() sem .json() (INCOMPLETO)

```javascript
// INCOMPLETO: response contem metadados, nao dados
fetch("http://localhost:3333/products")
  .then((response) => {
    console.log(response)
  })
// Output: Response { url: "http://localhost:3333/products", status: 200, ... }
```

**O que acontece:** voce ve o objeto Response com informacoes como URL, status code 200 (sucesso), headers — mas nao os dados dos produtos.

## Exemplo 3: Fetch completo com promise chain (CORRETO)

```javascript
fetch("http://localhost:3333/products")
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
// Output: [{ id: 1, name: "Product 1", ... }, ...]
```

**Fluxo:**
1. `fetch()` faz a requisicao HTTP → retorna Promise<Response>
2. Primeiro `.then()` recebe o Response, chama `.json()` → retorna Promise<dados>
3. Segundo `.then()` recebe os dados parseados do JSON

## Exemplo 4: Versao compacta em uma linha

```javascript
// Quando o .then() tem apenas uma expressao, pode usar arrow function curta
fetch("http://localhost:3333/products")
  .then((response) => response.json())
  .then((data) => console.log(data))
```

O instrutor mostra que quando o corpo do `.then()` e uma unica expressao, voce pode omitir as chaves e o return implicito funciona.

## Variacoes praticas

### Fetch com endpoint diferente

```javascript
fetch("http://localhost:3333/users")
  .then((response) => response.json())
  .then((users) => {
    console.log(users)
  })
```

### Fetch com URL remota (producao)

```javascript
fetch("https://api.exemplo.com/products")
  .then((response) => response.json())
  .then((products) => {
    console.log(products)
  })
```

### Usando os dados para renderizar no DOM

```javascript
fetch("http://localhost:3333/products")
  .then((response) => response.json())
  .then((products) => {
    products.forEach((product) => {
      const element = document.createElement("div")
      element.textContent = product.name
      document.body.appendChild(element)
    })
  })
```

### Verificando status antes de converter

```javascript
fetch("http://localhost:3333/products")
  .then((response) => {
    console.log(response.status) // 200
    return response.json()
  })
  .then((data) => {
    console.log(data)
  })
```