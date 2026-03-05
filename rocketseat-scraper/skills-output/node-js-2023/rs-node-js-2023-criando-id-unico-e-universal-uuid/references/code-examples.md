# Code Examples: UUID no Node.js

## Exemplo 1: Importacao do modulo crypto

```javascript
import { randomUUID } from 'node:crypto'
```

O `node:crypto` e um modulo nativo — nenhuma instalacao necessaria.

## Exemplo 2: Antes (problema demonstrado na aula)

```javascript
// database.js - todos usuarios com mesmo ID
const users = []

// Em cada POST request:
users.push({
  id: 1,  // PROBLEMA: todos ficam com id: 1
  name: req.body.name,
  email: req.body.email,
})
```

Resultado ao listar usuarios:
```json
[
  { "id": 1, "name": "Diego", "email": "diego@rocketseat.com" },
  { "id": 1, "name": "Mayk", "email": "mayk@rocketseat.com" }
]
```

## Exemplo 3: Depois (com randomUUID)

```javascript
import { randomUUID } from 'node:crypto'

const users = []

// Em cada POST request:
users.push({
  id: randomUUID(),
  name: req.body.name,
  email: req.body.email,
})
```

Resultado ao listar usuarios:
```json
[
  { "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479", "name": "Diego", "email": "diego@rocketseat.com" },
  { "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7", "name": "Mayk", "email": "mayk@rocketseat.com" }
]
```

## Exemplo 4: Padrao completo em rota de criacao

```javascript
import http from 'node:http'
import { randomUUID } from 'node:crypto'

const users = []

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/users') {
    // ... parse do body ...
    
    const user = {
      id: randomUUID(),
      name,
      email,
    }
    
    users.push(user)
    
    return res.writeHead(201).end(JSON.stringify(user))
  }
  
  if (req.method === 'GET' && req.url === '/users') {
    return res.end(JSON.stringify(users))
  }
})
```

## Exemplo 5: Alternativas mencionadas (quando UUID e grande demais)

```javascript
// SO use se o tamanho do UUID for um problema REAL
// Exemplo: short-unique-id (biblioteca externa)
import ShortUniqueId from 'short-unique-id'

const uid = new ShortUniqueId({ length: 10 })
uid.rnd() // "a1b2c3d4e5"

// Na grande maioria dos casos, prefira o nativo:
import { randomUUID } from 'node:crypto'
randomUUID() // "f47ac10b-58cc-4372-a567-0e02b2c3d479"
```