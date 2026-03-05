---
name: rs-full-stack-0209-recuperando-body
description: "Enforces manual request body parsing in pure Node.js HTTP servers. Use when user asks to 'parse request body', 'read POST data', 'handle JSON body', 'create HTTP server', or 'receive data from request' without Express or frameworks. Applies chunked stream reading with Buffer.concat and toString. Make sure to use this skill whenever building raw Node.js HTTP handlers that need body data. Not for Express, Fastify, or any framework-based body parsing."
---

# Recuperando Dados no Body (Node.js Puro)

> Requisicoes HTTP chegam em pedacos (chunks) via stream — reconstrua o body completo antes de usar os dados.

## Rules

1. **Sempre colete todos os chunks antes de processar** — `for await (const chunk of request)` garante que a stream foi totalmente consumida, porque dados parciais causam JSON.parse quebrado
2. **Use Buffer.concat para remontar** — `Buffer.concat(buffers)` e nativo do Node, nao precisa importar nada, porque ele lida corretamente com encoding e juncao de pedacos binarios
3. **Converta com toString antes de parsear** — `Buffer.concat(buffers).toString()` transforma bytes em string UTF-8, porque JSON.parse nao aceita Buffer diretamente
4. **Marque o handler como async** — o `for await` exige funcao assincrona, porque a stream fica aberta recebendo dados aos poucos
5. **Nao dependa de biblioteca para entender o mecanismo** — frameworks abstraem esse processo, mas saber como funciona por baixo evita bugs quando a abstracao falha

## How to write

### Coleta de chunks do body

```javascript
const server = http.createServer(async (request, response) => {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  const body = Buffer.concat(buffers).toString()
  console.log(body)

  response.end('OK')
})
```

### Parse completo de JSON body

```javascript
const server = http.createServer(async (request, response) => {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  const body = JSON.parse(Buffer.concat(buffers).toString())

  // body.name, body.price agora disponiveis
  response.writeHead(201)
  response.end(JSON.stringify({ created: body }))
})
```

## Example

**Before (tentando ler body diretamente — nao funciona):**

```javascript
const server = http.createServer((request, response) => {
  const body = request.body // undefined — HTTP nativo nao tem .body
  response.end(JSON.stringify(body))
})
```

**After (coletando chunks via stream):**

```javascript
const server = http.createServer(async (request, response) => {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  const body = JSON.parse(Buffer.concat(buffers).toString())
  response.writeHead(201)
  response.end(JSON.stringify(body))
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| HTTP server puro sem framework | Sempre use o pattern buffer + for await |
| Body vazio (GET, DELETE sem body) | buffers fica vazio, Buffer.concat retorna vazio — seguro |
| Body muito grande | Considere limitar tamanho antes de concat |
| Usando Express/Fastify | Use o middleware de body parsing do framework |
| Debug de dados recebidos | console.log nos chunks individuais para ver pedacos |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `request.body` (no HTTP nativo) | `for await` + `Buffer.concat` |
| `request.on('data')` sem aguardar `end` | `for await (const chunk of request)` |
| `chunk.toString()` dentro do loop | `Buffer.concat(buffers).toString()` apos coletar tudo |
| Handler sincrono com streams | `async (request, response) => {}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre streams, chunks e Buffer no Node
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0209-recuperando-dados-no-body-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0209-recuperando-dados-no-body-mkv-mp-4/references/code-examples.md)
