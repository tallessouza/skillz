# Code Examples: Criando o Primeiro Servidor Node.js

## Exemplo 1: Servidor basico (exato da aula)

```javascript
import http from 'node:http'

const server = http.createServer((request, response) => {
  return response.end('Hello World')
})

server.listen(3333)
```

**Execucao:**
```bash
node src/server.js
```

**Teste:** Abra `localhost:3333` no navegador → exibe "Hello World"

## Exemplo 2: Com log de confirmacao

```javascript
import http from 'node:http'

const server = http.createServer((request, response) => {
  return response.end('Hello World')
})

server.listen(3333, () => {
  console.log('Server running on port 3333')
})
```

O callback no `.listen()` executa quando o servidor esta pronto, util para confirmar que subiu.

## Exemplo 3: Respondendo com informacoes da requisicao

```javascript
import http from 'node:http'

const server = http.createServer((request, response) => {
  const { method, url } = request
  return response.end(`Method: ${method}, URL: ${url}`)
})

server.listen(3333)
```

Demonstra como acessar propriedades do objeto `request`.

## Exemplo 4: Respondendo JSON

```javascript
import http from 'node:http'

const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json')
  return response.end(JSON.stringify({ message: 'Hello World' }))
})

server.listen(3333)
```

Evolucao natural: definir Content-Type e enviar JSON.

## Exemplo 5: Roteamento basico

```javascript
import http from 'node:http'

const server = http.createServer((request, response) => {
  const { url, method } = request

  if (url === '/users' && method === 'GET') {
    return response.end('Lista de usuarios')
  }

  if (url === '/users' && method === 'POST') {
    return response.end('Usuario criado')
  }

  return response.end('Rota nao encontrada')
})

server.listen(3333)
```

Proximo passo natural apos o Hello World: separar rotas usando `url` e `method`.

## Estrutura de arquivos recomendada

```
project/
├── package.json
└── src/
    └── server.js
```

O arquivo `server.js` fica dentro de `src/` conforme o padrao demonstrado na aula (`src/server.js`).