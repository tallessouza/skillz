# Code Examples: Dados no Corpo da Requisição

## Exemplo base da aula

```typescript
const express = require("express")
const app = express()
const PORT = 3333

// Middleware para interpretar JSON no body
app.use(express.json())

// Rota GET existente
app.get("/products", (req, res) => {
  res.send("Lista de produtos")
})

// Rota POST para criar produto
app.post("/products", (req, res) => {
  const { name, price } = req.body
  res.send(`Produto ${name} custa $${price}`)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### Testando no Insomnia

**Request:**
- Method: POST
- URL: `http://localhost:3333/products`
- Body (JSON):
```json
{
  "name": "Teclado",
  "price": 120
}
```

**Response:** `Produto Teclado custa $120`

Trocando os valores:
```json
{
  "name": "Webcam",
  "price": 500
}
```
**Response:** `Produto Webcam custa $500`

## Variação: Retornando JSON na resposta

```typescript
app.post("/products", (req, res) => {
  const { name, price } = req.body

  const product = {
    id: crypto.randomUUID(),
    name,
    price,
    createdAt: new Date(),
  }

  res.status(201).json(product)
})
```

## Variação: Validação básica do body

```typescript
app.post("/products", (req, res) => {
  const { name, price } = req.body

  if (!name || price === undefined) {
    return res.status(400).json({ error: "name and price are required" })
  }

  res.status(201).json({ name, price })
})
```

## Variação: Múltiplos campos

```typescript
app.post("/users", (req, res) => {
  const { username, email, password } = req.body

  // As chaves devem corresponder exatamente ao JSON enviado
  const user = { username, email, password }

  res.status(201).json(user)
})
```

## Erro comum: chaves não batem

```typescript
// JSON enviado: { "name": "Teclado", "price": 120 }

// ERRADO — chaves diferentes do JSON
const { nome, preco } = req.body
// nome = undefined, preco = undefined

// CORRETO — mesmas chaves do JSON
const { name, price } = req.body
// name = "Teclado", price = 120
```

## Ordem importa: middleware antes das rotas

```typescript
// ERRADO — rota antes do middleware
app.post("/products", (req, res) => {
  const { name } = req.body // undefined!
  res.send(name)
})
app.use(express.json()) // Tarde demais

// CORRETO — middleware primeiro
app.use(express.json())
app.post("/products", (req, res) => {
  const { name } = req.body // funciona
  res.send(name)
})
```