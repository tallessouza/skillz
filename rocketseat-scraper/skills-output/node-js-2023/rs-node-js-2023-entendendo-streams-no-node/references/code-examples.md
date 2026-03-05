# Code Examples: Streams no Node.js

## Nota sobre esta aula

Esta aula e conceitual — o instrutor nao escreve codigo, mas prepara o terreno para as aulas praticas seguintes. Os exemplos abaixo ilustram os conceitos ensinados com codigo Node.js real.

## Readable Stream: Lendo arquivo grande

```typescript
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'

// Ler CSV de 1GB linha por linha sem carregar tudo em memoria
const fileStream = createReadStream('import.csv', { encoding: 'utf-8' })
const lines = createInterface({ input: fileStream })

let processedCount = 0

for await (const line of lines) {
  const [name, email, phone] = line.split(',')
  
  // Insere no banco enquanto o arquivo ainda esta sendo lido
  await insertClient({ name, email, phone })
  processedCount++
  
  if (processedCount % 10000 === 0) {
    console.log(`${processedCount} registros processados...`)
  }
}

console.log(`Total: ${processedCount} registros importados`)
```

## Readable Stream: Request body de upload

```typescript
import { createServer } from 'node:http'

const server = createServer(async (request, response) => {
  // request e uma Readable Stream
  // Dados chegam em chunks enquanto upload acontece
  const chunks = []

  for await (const chunk of request) {
    // Cada chunk pode ser processado individualmente
    // Em vez de acumular tudo, poderiamos processar aqui
    chunks.push(chunk)
  }

  const body = Buffer.concat(chunks).toString()
  console.log(body)

  response.end('Upload recebido')
})
```

## Writable Stream: Enviando resposta incrementalmente

```typescript
import { createServer } from 'node:http'

const server = createServer(async (request, response) => {
  // response e uma Writable Stream
  // Podemos enviar dados aos poucos (como Netflix faz com video)
  
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  
  for (let i = 0; i < 1000000; i++) {
    // Envia cada linha sem esperar processar todas
    response.write(`Linha ${i}: dados do registro\n`)
  }
  
  response.end()
})
```

## Pipe: Conectando Readable a Writable

```typescript
import { createReadStream } from 'node:fs'
import { createServer } from 'node:http'

const server = createServer((request, response) => {
  // pipe() conecta a leitura do arquivo diretamente a resposta HTTP
  // Gerencia backpressure automaticamente
  const fileStream = createReadStream('video.mp4')
  fileStream.pipe(response)
})
```

## Pipeline (forma moderna e segura)

```typescript
import { pipeline } from 'node:stream/promises'
import { createReadStream, createWriteStream } from 'node:fs'
import { Transform } from 'node:stream'

// Transform Stream: le CSV, transforma em JSON, escreve em arquivo
const csvToJson = new Transform({
  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n')
    const jsonLines = lines
      .filter(line => line.trim())
      .map(line => {
        const [name, email] = line.split(',')
        return JSON.stringify({ name: name?.trim(), email: email?.trim() })
      })
      .join('\n')
    
    callback(null, jsonLines + '\n')
  }
})

await pipeline(
  createReadStream('clients.csv'),
  csvToJson,
  createWriteStream('clients.json')
)
```

## Cenario do instrutor: CSV import com processamento incremental

```typescript
import { createServer } from 'node:http'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

// Simula insert no banco de dados
async function insertBatch(records: Array<{ name: string; email: string }>) {
  // await db.insert(records)
  console.log(`Inseridos ${records.length} registros`)
}

const server = createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/upload') {
    let batch: Array<{ name: string; email: string }> = []
    const BATCH_SIZE = 1000

    // request (Readable) → processamento em chunks
    const processor = new Transform({
      async transform(chunk, encoding, callback) {
        const lines = chunk.toString().split('\n').filter(Boolean)
        
        for (const line of lines) {
          const [name, email] = line.split(',')
          batch.push({ name: name?.trim(), email: email?.trim() })
          
          if (batch.length >= BATCH_SIZE) {
            await insertBatch(batch)
            batch = []
          }
        }
        
        callback()
      },
      async flush(callback) {
        // Processa registros restantes no ultimo batch
        if (batch.length > 0) {
          await insertBatch(batch)
        }
        callback()
      }
    })

    await pipeline(request, processor)
    
    response.writeHead(200)
    response.end('Importacao concluida')
  }
})

server.listen(3333)
```