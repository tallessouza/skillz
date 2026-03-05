# Code Examples: Como o Node.js Lida com Requisicoes HTTP

## Exemplo 1: Servidor basico com coleta de body

O padrao fundamental mostrado na aula — coletar chunks e reconstruir o body:

```typescript
import http from 'node:http'

const server = http.createServer((req, res) => {
  // Verificar se e uma requisicao que pode ter body
  if (req.method === 'POST') {
    const chunks: Buffer[] = []

    // Cada pedaco do body dispara este evento
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })

    // Quando todos os pedacos chegaram
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString()
      const product = JSON.parse(body)
      // product = { name: "teclado", price: 120.50 }

      console.log('Produto recebido:', product.name)
      console.log('Preco:', product.price)

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Produto criado com sucesso' }))
    })

    // Sempre trate erros na stream
    req.on('error', (err) => {
      console.error('Erro ao receber body:', err)
      res.writeHead(400)
      res.end('Erro ao processar requisicao')
    })
  }
})

server.listen(3333, () => {
  console.log('Servidor rodando na porta 3333')
})
```

## Exemplo 2: Funcao reutilizavel com async/await

Versao moderna usando `for await...of` para consumir a stream:

```typescript
import { IncomingMessage } from 'node:http'

async function getRequestBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }

  return Buffer.concat(chunks).toString()
}

// Uso:
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    const bodyRaw = await getRequestBody(req)
    const body = JSON.parse(bodyRaw)
    // ...
  }
})
```

## Exemplo 3: Funcao que ja retorna JSON parseado

```typescript
async function getJsonBody<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }

  const raw = Buffer.concat(chunks).toString()
  return JSON.parse(raw) as T
}

// Uso com tipagem:
interface CreateProductInput {
  name: string
  price: number
}

const product = await getJsonBody<CreateProductInput>(req)
// product.name e product.price com autocomplete
```

## Exemplo 4: Visualizando os chunks chegando

Para fins didaticos — ver cada chunk individualmente:

```typescript
const server = http.createServer((req, res) => {
  let chunkCount = 0

  req.on('data', (chunk) => {
    chunkCount++
    console.log(`Chunk ${chunkCount}:`, chunk.toString())
    console.log(`Tamanho: ${chunk.length} bytes`)
  })

  req.on('end', () => {
    console.log(`Total de chunks recebidos: ${chunkCount}`)
    res.end('OK')
  })
})
```

Para um body pequeno como `{ "name": "teclado", "price": 120.50 }`, provavelmente chega em um unico chunk. Mas para dados maiores, voce vera multiplos chunks.

## Exemplo 5: Testando com curl

```bash
# Enviando POST com body JSON
curl -X POST http://localhost:3333/products \
  -H "Content-Type: application/json" \
  -d '{"name": "teclado", "price": 120.50}'

# Enviando dados maiores para ver multiplos chunks
curl -X POST http://localhost:3333/products \
  -H "Content-Type: application/json" \
  -d @large-payload.json
```

## Exemplo 6: Comparacao — com e sem framework

### Node puro (o que a aula ensina):
```typescript
// Voce faz a coleta manual
req.on('data', (chunk) => chunks.push(chunk))
req.on('end', () => {
  const body = JSON.parse(Buffer.concat(chunks).toString())
})
```

### Express (abstrai a coleta):
```typescript
// O middleware express.json() faz isso por voce
app.use(express.json())
app.post('/products', (req, res) => {
  // req.body ja esta disponivel e parseado
  const product = req.body
})
```

O Express internamente faz exatamente o que aprendemos: coleta chunks, concatena, e parseia. Entender o mecanismo por baixo e essencial para debugar problemas e criar solucoes customizadas.