---
name: rs-node-js-2023-streams-http
description: "Applies Node.js Streams within HTTP servers when building request/response pipelines. Use when user asks to 'create an HTTP server', 'process uploads', 'stream request body', 'pipe request to response', or 'handle large payloads in Node'. Enforces req as ReadableStream, res as WritableStream, and pipe chaining with transforms. Make sure to use this skill whenever building Node.js HTTP handlers that process incoming data incrementally. Not for file system streams, WebSocket implementations, or frontend-only fetch usage."
---

# Streams no Modulo HTTP do Node.js

> Em servidores HTTP do Node, `req` e uma ReadableStream e `res` e uma WritableStream — use pipe para processar dados incrementalmente sem fechar a conexao.

## Rules

1. **req e ReadableStream, res e WritableStream** — nunca acumule o body inteiro em memoria, porque o Node ja entrega req como stream pronta para pipe
2. **Use pipe para encadear transformacoes** — `req.pipe(transform).pipe(res)`, porque isso processa dados chunk a chunk sem buffering
3. **Envie streams no body do fetch** — passe uma ReadableStream como body em POST/PUT, porque GET nao permite envio de corpo na requisicao
4. **Adicione `duplex: 'half'` no fetch moderno** — versoes recentes do Node exigem essa propriedade ao enviar stream como body
5. **Mantenha a conexao aberta** — streams HTTP abrem um canal de dados que nao fecha ate a stream terminar, porque isso e o que permite processamento incremental
6. **Use TransformStream para processar no meio** — entre req e res, insira transforms para manipular dados em transito

## How to write

### Servidor HTTP com pipe de streams

```javascript
import http from 'node:http'
import { Transform } from 'node:stream'

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    const transformed = // processar chunk
    callback(null, transformed)
  }
})

const server = http.createServer((req, res) => {
  return req.pipe(myTransform).pipe(res)
})

server.listen(3334)
```

### Cliente enviando stream via fetch

```javascript
import { Readable } from 'node:stream'

const myStream = new Readable({
  read() {
    this.push(/* dados */)
    this.push(null) // sinaliza fim
  }
})

fetch('http://localhost:3334', {
  method: 'POST',
  body: myStream,
  duplex: 'half'
})
```

## Example

**Before (acumulando body em memoria):**

```javascript
const server = http.createServer(async (req, res) => {
  const buffers = []
  for await (const chunk of req) {
    buffers.push(chunk)
  }
  const body = Buffer.concat(buffers).toString()
  const result = processAll(body)
  res.end(result)
})
```

**After (com pipe e stream de transformacao):**

```javascript
const server = http.createServer((req, res) => {
  return req
    .pipe(processTransform)
    .pipe(res)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recebendo upload grande | pipe req direto para transform, nunca acumule |
| Processando dados em transito | Crie TransformStream entre req e res |
| Enviando dados do cliente | Use ReadableStream no body + `duplex: 'half'` |
| Metodo GET | Nao envie body — GET nao suporta corpo de requisicao |
| Precisa logar dados intermediarios | Adicione console.log dentro do transform, antes do callback |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `const body = await readAll(req)` | `req.pipe(transform).pipe(res)` |
| `fetch(url, { method: 'GET', body: stream })` | `fetch(url, { method: 'POST', body: stream, duplex: 'half' })` |
| `req.on('data', (chunk) => { allData += chunk })` | `req.pipe(transform).pipe(res)` |
| Criar ReadableStream e WritableStream manuais no server | Usar `req` e `res` que ja sao streams nativas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-aplicando-streams-no-modulo-http/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-aplicando-streams-no-modulo-http/references/code-examples.md)
