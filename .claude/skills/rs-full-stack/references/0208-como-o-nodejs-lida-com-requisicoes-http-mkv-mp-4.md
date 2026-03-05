---
name: rs-full-stack-nodejs-http-requests
description: "Applies Node.js HTTP request body handling patterns using streams and chunks when writing server code. Use when user asks to 'create an API', 'handle POST request', 'parse request body', 'read body in Node', or builds HTTP servers with native Node.js. Enforces stream-based chunk collection, proper body reconstruction, and explains why body isn't immediately available. Make sure to use this skill whenever writing native Node.js HTTP server code that processes request bodies. Not for Express/Fastify body parsing, file upload libraries, or frontend HTTP clients."
---

# Como o Node.js Lida com Requisicoes HTTP

> O corpo de uma requisicao HTTP no Node.js nao esta disponivel imediatamente — ele chega em partes (chunks) via stream e precisa ser coletado e remontado antes de ser usado.

## Rules

1. **Nunca acesse `req.body` diretamente no Node puro** — ele nao existe como propriedade pronta, porque o Node recebe o corpo em stream e nao sabe o tamanho antecipadamente
2. **Colete chunks em um array** — cada pedaco chega como um Buffer via evento `data`, acumule todos antes de processar, porque o corpo pode ser grande (arquivos, dados em massa)
3. **Reconstrua o corpo no evento `end`** — so apos receber todos os chunks voce tem o corpo completo, concatene os Buffers e converta para string/JSON
4. **Use streams para eficiencia** — o Node divide o corpo em chunks para processar dados enquanto ainda estao sendo recebidos, sem esperar o conteudo inteiro carregar na memoria
5. **Parse JSON apenas quando o Content-Type confirmar** — evite erros de parse verificando o header antes de chamar `JSON.parse`

## How to write

### Coletar body de uma requisicao POST

```typescript
const chunks: Buffer[] = []

req.on('data', (chunk: Buffer) => {
  chunks.push(chunk)
})

req.on('end', () => {
  const body = Buffer.concat(chunks).toString()
  const parsedBody = JSON.parse(body)
  // parsedBody agora contem os dados enviados pelo cliente
})
```

### Funcao reutilizavel para coletar body

```typescript
async function getRequestBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }

  return Buffer.concat(chunks).toString()
}
```

## Example

**Before (erro comum — tentar acessar body diretamente):**

```typescript
import http from 'node:http'

const server = http.createServer((req, res) => {
  // ERRADO: req.body nao existe no Node puro
  const product = req.body
  console.log(product.name)
})
```

**After (com coleta de chunks via stream):**

```typescript
import http from 'node:http'

const server = http.createServer((req, res) => {
  const chunks: Buffer[] = []

  req.on('data', (chunk) => {
    chunks.push(chunk)
  })

  req.on('end', () => {
    const body = Buffer.concat(chunks).toString()
    const product = JSON.parse(body)
    // { name: "teclado", price: 120.50 }
    console.log(product.name)

    res.writeHead(201)
    res.end(JSON.stringify({ message: 'Produto criado' }))
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Requisicao GET sem body | Nao precisa coletar chunks — processe direto |
| Requisicao POST/PUT/PATCH | Sempre colete chunks antes de processar |
| Body pode ser grande (upload) | Use streams com pipe ao inves de acumular em memoria |
| Usando Express/Fastify | Use middleware de body parsing do framework (esta skill nao se aplica) |
| Multiplas rotas precisam de body | Extraia a coleta de chunks para um middleware/funcao reutilizavel |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `const data = req.body` (Node puro) | Colete chunks com `req.on('data')` + `req.on('end')` |
| `JSON.parse(req)` | `JSON.parse(Buffer.concat(chunks).toString())` |
| Processar dados dentro do `data` event | Processar apenas dentro do `end` event |
| Ignorar o evento `error` na stream | `req.on('error', (err) => { ... })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre streams, chunks e o modelo de I/O do Node
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0208-como-o-nodejs-lida-com-requisicoes-http-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0208-como-o-nodejs-lida-com-requisicoes-http-mkv-mp-4/references/code-examples.md)
