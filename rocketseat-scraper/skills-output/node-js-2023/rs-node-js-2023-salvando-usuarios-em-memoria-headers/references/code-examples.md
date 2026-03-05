# Code Examples: Salvando Dados em Memoria e Headers HTTP

## Exemplo completo da aula — servidor com CRUD basico em memoria

```javascript
import http from 'node:http'

// Array em memoria — aplicacao stateful
const users = []

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    // Seta o header ANTES de enviar a resposta
    res.setHeader('Content-Type', 'application/json')
    // Serializa o array para string JSON
    return res.end(JSON.stringify(users))
  }

  if (method === 'POST' && url === '/users') {
    // Adiciona usuario hardcoded (por enquanto)
    users.push({
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com'
    })

    return res.writeHead(201).end('Criação de usuário')
  }

  res.writeHead(404).end('Not found')
})

server.listen(3333)
```

## Demonstracao do erro sem JSON.stringify

```javascript
// ERRO: TypeError: The "chunk" argument must be of type string or an instance of Buffer
const users = [{ id: 1, name: 'John' }]
res.end(users) // Envia um array — Node nao aceita

// CORRETO:
res.end(JSON.stringify(users)) // Envia string '[ {"id":1,"name":"John"} ]'
```

## Demonstracao do efeito do Content-Type

```javascript
// Sem Content-Type — cliente recebe texto puro
res.end(JSON.stringify(users))
// Output no terminal: [{"id":1,"name":"John Doe","email":"johndoe@example.com"}]
// (texto corrido, sem formatacao)

// Com Content-Type — cliente interpreta como JSON
res.setHeader('Content-Type', 'application/json')
res.end(JSON.stringify(users))
// Output no terminal (httpie):
// [
//   {
//     "id": 1,
//     "name": "John Doe",
//     "email": "johndoe@example.com"
//   }
// ]
```

## Lendo headers da requisicao

```javascript
if (method === 'POST' && url === '/users') {
  // Acessa todos os headers enviados pelo cliente
  console.log(req.headers)
  // {
  //   host: 'localhost:3333',
  //   'user-agent': 'HTTPie/3.2.1',
  //   'accept-encoding': 'gzip, deflate',
  //   'content-type': 'application/json',
  //   ...
  // }
}
```

## Comportamento stateful — perda de dados no restart

```bash
# Terminal 1: servidor rodando
node src/server.js

# Terminal 2: cria usuario
http POST localhost:3333/users
# → "Criação de usuário"

http GET localhost:3333/users
# → [{ id: 1, name: "John Doe", email: "johndoe@example.com" }]

# Terminal 1: Ctrl+C (para o servidor)
# Terminal 1: node src/server.js (reinicia)

# Terminal 2: lista usuarios
http GET localhost:3333/users
# → []  ← VAZIO! Dados perdidos porque estavam em memoria
```

## Variacoes de Content-Type para diferentes formatos

```javascript
// JSON
res.setHeader('Content-Type', 'application/json')
res.end(JSON.stringify({ message: 'ok' }))

// Texto puro
res.setHeader('Content-Type', 'text/plain')
res.end('Hello World')

// HTML
res.setHeader('Content-Type', 'text/html')
res.end('<h1>Hello</h1>')
```