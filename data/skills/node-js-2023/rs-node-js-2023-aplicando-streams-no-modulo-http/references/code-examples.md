# Code Examples: Streams no Modulo HTTP

## Exemplo 1: Servidor HTTP com TransformStream

```javascript
// stream-http-server.js
import http from 'node:http'
import { Transform } from 'node:stream'

const inverseNumberStream = new Transform({
  transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1
    console.log(transformed) // log incremental dos dados chegando
    callback(null, Buffer.from(String(transformed)))
  }
})

const server = http.createServer((req, res) => {
  // req = ReadableStream (dados da requisicao)
  // res = WritableStream (resposta para o cliente)
  return req
    .pipe(inverseNumberStream)
    .pipe(res)
})

server.listen(3334)
```

## Exemplo 2: Cliente enviando stream via fetch

```javascript
// fake-upload-to-http-stream.js
import { Readable } from 'node:stream'

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++
    setTimeout(() => {
      if (i > 100) {
        this.push(null) // sinaliza fim da stream
      } else {
        const buf = Buffer.from(String(i) + '\n')
        this.push(buf)
      }
    }, 1000)
  }
}

fetch('http://localhost:3334', {
  method: 'POST',
  body: new OneToHundredStream(),
  duplex: 'half' // necessario em versoes recentes do Node
})
```

## Exemplo 3: Execucao

```bash
# Terminal 1 — inicia o servidor
node stream-http-server.js

# Terminal 2 — inicia o cliente (fake upload)
node fake-upload-to-http-stream.js
```

Resultado no terminal do servidor: numeros negativos aparecendo um por segundo (-1, -2, -3, ..., -100), demonstrando processamento incremental.

## Exemplo 4: Variacao — logging sem transformacao

```javascript
// Apenas observar os dados passando sem modificar
const logStream = new Transform({
  transform(chunk, encoding, callback) {
    console.log('[chunk recebido]:', chunk.toString())
    callback(null, chunk) // repassa sem modificar
  }
})

const server = http.createServer((req, res) => {
  return req
    .pipe(logStream)
    .pipe(res)
})
```

## Exemplo 5: Variacao — multiplos transforms encadeados

```javascript
const server = http.createServer((req, res) => {
  return req
    .pipe(parseTransform)    // parse do chunk
    .pipe(validateTransform) // validacao
    .pipe(processTransform)  // processamento
    .pipe(res)               // resposta
})
```

## Mapeamento de conceitos

| Conceito standalone | Equivalente HTTP |
|--------------------|------------------|
| `new Readable()` | `req` (request) |
| `new Writable()` | `res` (response) |
| `readable.pipe(writable)` | `req.pipe(res)` |
| `readable.pipe(transform).pipe(writable)` | `req.pipe(transform).pipe(res)` |