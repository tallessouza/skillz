# Code Examples: Consumindo uma Stream Completa

## Exemplo 1: Servidor HTTP consumindo stream completa

Codigo do servidor que acumula todos os chunks antes de processar:

```javascript
import http from 'node:http'

const server = http.createServer(async (req, res) => {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const fullStreamContent = Buffer.concat(buffers).toString()

  console.log(fullStreamContent)

  return res.end(fullStreamContent)
})

server.listen(3334)
```

Pontos-chave:
- O callback do `createServer` recebe `async` porque usa `for await`
- `req` e uma Readable Stream — pode ser iterada com `for await`
- `Buffer.concat(buffers)` une os pedacos binarios
- `.toString()` converte para string legivel
- `res.end()` envia a resposta so depois de ter todos os dados

## Exemplo 2: Cliente fazendo upload e lendo resposta

```javascript
import { Readable } from 'node:stream'

const oneToHundredStream = new Readable({
  read() {
    for (let i = 1; i <= 5; i++) {
      this.push(String(i))
    }
    this.push(null) // sinaliza fim da stream
  }
})

fetch('http://localhost:3334', {
  method: 'POST',
  body: oneToHundredStream,
  duplex: 'half',
})
  .then(response => response.text())
  .then(data => console.log(data))
```

Pontos-chave:
- O numero foi reduzido para 5 (originalmente 100) para demonstracao rapida
- `.then(response => response.text())` converte a Response em texto
- O `.then` encadeado e uma alternativa mais limpa ao `.then` aninhado

## Exemplo 3: Parsing JSON do request body (aplicacao pratica)

Este e o caso de uso mais comum que Diego menciona — receber JSON do frontend:

```javascript
import http from 'node:http'

const server = http.createServer(async (req, res) => {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const body = Buffer.concat(buffers).toString()

  // Agora sim e seguro fazer JSON.parse
  const data = JSON.parse(body)
  // data = { name: "Diego", email: "diego@skillz.com.br" }

  console.log(data.name) // "Diego"

  return res.end(JSON.stringify({ received: true }))
})

server.listen(3334)
```

## Exemplo 4: Por que consumo parcial de JSON falha

Diego explica com este cenario mental:

```javascript
// Imagine que a stream envia: {"name":"Diego","email":"diego@skillz.com.br"}
// Chunk 1 chega: {"name":"Di
// Chunk 2 chega: ego","email":"die
// Chunk 3 chega: go@skillz.com.br"}

// Se voce tentar processar o chunk 1:
JSON.parse('{"name":"Di') // SyntaxError: Unexpected end of JSON input

// Por isso PRECISA acumular tudo antes de parsear
```

## Exemplo 5: Variacao com event listeners (alternativa menos elegante)

A forma tradicional (sem `for await`) — funciona mas e mais verbosa:

```javascript
const server = http.createServer((req, res) => {
  const buffers = []

  req.on('data', (chunk) => {
    buffers.push(chunk)
  })

  req.on('end', () => {
    const body = Buffer.concat(buffers).toString()
    console.log(body)
    res.end(body)
  })
})
```

O `for await` substitui esse padrao de `on('data')` + `on('end')` de forma muito mais limpa e legivel, alem de funcionar naturalmente com `async/await`.

## Erro comum: esquecer o `async`

```javascript
// ERRADO — causa "Unexpected reserved word"
const server = http.createServer((req, res) => {
  const buffers = []
  for await (const chunk of req) { // ERRO: await sem async
    buffers.push(chunk)
  }
})

// CORRETO — async na funcao que contem o await
const server = http.createServer(async (req, res) => {
  const buffers = []
  for await (const chunk of req) { // OK
    buffers.push(chunk)
  }
})
```