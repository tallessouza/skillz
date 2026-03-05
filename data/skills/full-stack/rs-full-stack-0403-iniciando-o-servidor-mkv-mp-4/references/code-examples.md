# Code Examples: Iniciando o Servidor Node.js

## Exemplo 1: Forma verbosa (mostrada primeiro pelo instrutor)

```javascript
import http from 'node:http'

const server = http.createServer((request, response) => {
  // Aqui temos acesso à requisição e à resposta
  return response.end('Hello World')
})

server.listen(3333)
```

## Exemplo 2: Listener separado (evolução mostrada pelo instrutor)

```javascript
import http from 'node:http'

function listener(request, response) {
  return response.end('Hello World')
}

const server = http.createServer(listener)
server.listen(3333)
```

## Exemplo 3: Encadeado (forma final preferida)

```javascript
import http from 'node:http'

function listener(request, response) {
  return response.end('Hello World')
}

http.createServer(listener).listen(3333)
```

## Exemplo 4: Com porta configurável (extensão prática)

```javascript
import http from 'node:http'

const PORT = process.env.PORT || 3333

function listener(request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  return response.end(JSON.stringify({ message: 'Server running' }))
}

http.createServer(listener).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## Exemplo 5: Quando manter a variável server (caso de uso real)

```javascript
import http from 'node:http'

function listener(request, response) {
  return response.end('OK')
}

// Mantém referência quando precisa do server para outras operações
const server = http.createServer(listener)

// Exemplo: graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed gracefully')
    process.exit(0)
  })
})

server.listen(3333)
```

## Execução

```bash
# Com script npm configurado (como mostrado na aula)
npm run dev

# Direto com node
node src/server.js
```

O instrutor demonstrou que ao executar `npm run dev`, o servidor inicia normalmente e fica atendendo requisições na porta 3333.