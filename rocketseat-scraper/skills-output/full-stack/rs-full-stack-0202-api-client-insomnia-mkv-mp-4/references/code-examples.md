# Code Examples: API Client — Insomnia

## Exemplo basico de uso com uma API Node.js

### Servidor de exemplo (o que voce vai testar)

```typescript
import http from 'node:http'

const server = http.createServer((request, response) => {
  const { method, url } = request

  if (method === 'GET' && url === '/users') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ]))
    return
  }

  if (method === 'POST' && url === '/users') {
    let body = ''
    request.on('data', chunk => { body += chunk })
    request.on('end', () => {
      const user = JSON.parse(body)
      response.writeHead(201, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ id: 3, ...user }))
    })
    return
  }

  response.writeHead(404).end()
})

server.listen(3333)
```

### Testando no Insomnia

#### Request GET
```
Method: GET
URL: http://localhost:3333/users
Headers: (nenhum necessario)
Body: (vazio)

Response esperado:
Status: 200 OK
Body: [{"id":1,"name":"John"},{"id":2,"name":"Jane"}]
```

#### Request POST
```
Method: POST
URL: http://localhost:3333/users
Headers: Content-Type: application/json
Body (JSON):
{
  "name": "Carlos",
  "email": "carlos@email.com"
}

Response esperado:
Status: 201 Created
Body: {"id":3,"name":"Carlos","email":"carlos@email.com"}
```

## Organizacao recomendada no Insomnia

```
Colecao: Minha API
├── Users
│   ├── GET /users (List all)
│   ├── GET /users/:id (Get one)
│   ├── POST /users (Create)
│   ├── PUT /users/:id (Update)
│   └── DELETE /users/:id (Delete)
├── Products
│   ├── GET /products
│   └── POST /products
└── Auth
    ├── POST /login
    └── POST /register
```

## Variaveis de ambiente no Insomnia

Crie um ambiente base para evitar repetir a URL:

```json
{
  "base_url": "http://localhost:3333",
  "token": ""
}
```

Depois use nas requests:
```
URL: {{ base_url }}/users
Header Authorization: Bearer {{ token }}
```

## Comparacao: testar no navegador vs Insomnia

### No navegador (limitado a GET)
```
Barra de endereco: http://localhost:3333/users
→ Funciona para GET
→ Impossivel testar POST, PUT, DELETE
```

### No Insomnia (todos os metodos)
```
Qualquer metodo HTTP
Headers customizados
Body em JSON, form-data, XML
Visualizacao formatada da resposta
Historico de requests
```