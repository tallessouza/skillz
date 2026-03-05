# Code Examples: URL da Requisição e Roteamento Manual

## Exemplo 1: Verificando a URL no console

```javascript
const http = require('node:http')

const server = http.createServer((request, response) => {
  console.log(`URL: ${request.url}`)
  response.end('OK')
})

server.listen(3333)
```

Resultados ao testar:
- `GET http://localhost:3333/` → URL: `/`
- `GET http://localhost:3333/products` → URL: `/products`
- `GET http://localhost:3333/products/7` → URL: `/products/7`

## Exemplo 2: Roteamento completo da aula

```javascript
const http = require('node:http')

const server = http.createServer((request, response) => {
  const { method, url } = request

  if (method === 'GET' && url === '/products') {
    return response.end('Lista de produtos')
  }

  if (method === 'POST' && url === '/products') {
    response.writeHead(201)
    return response.end('Produto cadastrado')
  }

  response.writeHead(404)
  return response.end('Rota não encontrada')
})

server.listen(3333)
```

## Exemplo 3: Expandindo com mais rotas (variação)

```javascript
const server = http.createServer((request, response) => {
  const { method, url } = request

  // GET /products → listar produtos
  if (method === 'GET' && url === '/products') {
    return response.end('Lista de produtos')
  }

  // POST /products → criar produto
  if (method === 'POST' && url === '/products') {
    response.writeHead(201)
    return response.end('Produto cadastrado')
  }

  // GET /users → listar usuários
  if (method === 'GET' && url === '/users') {
    return response.end('Lista de usuários')
  }

  // POST /users → criar usuário
  if (method === 'POST' && url === '/users') {
    response.writeHead(201)
    return response.end('Usuário cadastrado')
  }

  // Fallback — rota não encontrada
  response.writeHead(404)
  return response.end('Rota não encontrada')
})
```

## Exemplo 4: Testando no Insomnia/terminal

```bash
# GET na raiz — retorna "Rota não encontrada" (404)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/
# 404

# GET /products — retorna lista
curl http://localhost:3333/products
# Lista de produtos

# POST /products — retorna 201
curl -X POST -w "\n%{http_code}" http://localhost:3333/products
# Produto cadastrado
# 201

# GET em rota inexistente
curl -w "\n%{http_code}" http://localhost:3333/products/7
# Rota não encontrada
# 404
```

Note que `/products/7` retorna 404 porque o roteamento manual faz comparação exata de string — `'/products/7' !== '/products'`. Para lidar com parâmetros dinâmicos, seria necessário parsing da URL (abordado em aulas posteriores).