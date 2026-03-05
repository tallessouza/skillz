# Code Examples: Criando Objetos de Recurso em APIs Node.js

## Exemplo base da aula: Ticket

### Request body (enviado pelo cliente)

```json
{
  "equipment": "Computador",
  "description": "Computador não liga",
  "userName": "Rodrigo Gonçalves"
}
```

### Controller completa

```javascript
import { randomUUID } from "node:crypto"

export function create(request, response) {
  const { equipment, description, userName } = JSON.parse(request.body)

  const ticket = {
    id: randomUUID(),
    equipment,
    description,
    userName,
    status: "open",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return response.writeHead(201).end(JSON.stringify(ticket))
}
```

### Response retornado

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "equipment": "Computador",
  "description": "Computador não liga",
  "userName": "Rodrigo Gonçalves",
  "status": "open",
  "createdAt": "2026-03-01T10:30:00.000Z",
  "updatedAt": "2026-03-01T10:30:00.000Z"
}
```

## Variacao: Endpoint de update (preservando createdAt)

```javascript
export function update(request, response) {
  const { id } = request.params
  const { equipment, description, userName } = JSON.parse(request.body)

  const existingTicket = database.findById(id)

  const updatedTicket = {
    ...existingTicket,
    equipment,
    description,
    userName,
    updatedAt: new Date(), // apenas updatedAt muda
  }

  return response.writeHead(200).end(JSON.stringify(updatedTicket))
}
```

## Variacao: Outros tipos de recurso seguindo o mesmo padrao

### Pedido (Order)

```javascript
import { randomUUID } from "node:crypto"

export function createOrder(request, response) {
  const { items, customerName, address } = JSON.parse(request.body)

  const order = {
    id: randomUUID(),
    items,
    customerName,
    address,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return response.writeHead(201).end(JSON.stringify(order))
}
```

### Usuario (User)

```javascript
import { randomUUID } from "node:crypto"

export function createUser(request, response) {
  const { name, email, password } = JSON.parse(request.body)

  const user = {
    id: randomUUID(),
    name,
    email,
    password, // em producao: hash antes de salvar
    role: "user",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return response.writeHead(201).end(JSON.stringify(user))
}
```

## UUID em acao: cada chamada gera ID unico

```javascript
import { randomUUID } from "node:crypto"

console.log(randomUUID()) // "f47ac10b-58cc-4372-a567-0e02b2c3d479"
console.log(randomUUID()) // "7c9e6679-7425-40de-944b-e07fc1f90ae7"
console.log(randomUUID()) // "550e8400-e29b-41d4-a716-446655440000"
// Nunca repete
```

## Erro comum: retornar objeto sem stringify

```javascript
// ERRO: retorna [object Object]
response.end(ticket)

// CORRETO: serializa para JSON
response.end(JSON.stringify(ticket))
```