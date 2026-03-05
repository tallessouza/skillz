# Code Examples: Buffers no Node.js

## Exemplo 1: Criando Buffer e vendo representacao hex

```javascript
// Arquivo: buffer.js
const buf = Buffer.from("ok")
console.log(buf)
// Output: <Buffer 6f 6b>
// 6f = 'o', 6b = 'k' em hexadecimal
```

Execucao: `node buffer.js`

Cada par hexadecimal corresponde a um caractere. Com 2 caracteres ("ok"), temos 2 pares hex.

## Exemplo 2: Buffer com texto maior

```javascript
const buf = Buffer.from("hello")
console.log(buf)
// Output: <Buffer 68 65 6c 6c 6f>
// 5 letras = 5 pares hexadecimais
```

Mapeamento completo:
- `68` → h (decimal 104)
- `65` → e (decimal 101)
- `6c` → l (decimal 108)
- `6c` → l (decimal 108)
- `6f` → o (decimal 111)

## Exemplo 3: Convertendo para JSON (representacao decimal)

```javascript
const buf = Buffer.from("hello")
console.log(buf.toJSON())
// Output: { type: 'Buffer', data: [ 104, 101, 108, 108, 111 ] }
```

Mesmos dados, base diferente. Util para inspecionar o conteudo sem lidar com hexadecimal.

## Exemplo 4: Buffer no contexto de Streams

```javascript
import { Readable, Writable } from "node:stream"

const readable = new Readable({
  read() {
    this.push(Buffer.from("dados do stream"))
    this.push(null) // sinaliza fim
  }
})

const writable = new Writable({
  write(chunk, encoding, callback) {
    // chunk aqui e um Buffer automaticamente
    console.log(chunk)          // <Buffer 64 61 64 6f 73 ...>
    console.log(chunk.toString()) // "dados do stream"
    callback()
  }
})

readable.pipe(writable)
```

## Exemplo 5: Operacoes comuns com Buffer

```javascript
// Concatenar buffers (comum em streams)
const chunks = []
chunks.push(Buffer.from("hello "))
chunks.push(Buffer.from("world"))
const complete = Buffer.concat(chunks)
console.log(complete.toString()) // "hello world"

// Comparar buffers
const a = Buffer.from("abc")
const b = Buffer.from("abc")
console.log(a.equals(b)) // true

// Tamanho em bytes (nao em caracteres)
const buf = Buffer.from("café")
console.log(buf.length)        // 5 (e com acento = 2 bytes em UTF-8)
console.log("café".length)     // 4 (caracteres)
```

## Exemplo 6: Por que Buffer e mais eficiente que String para I/O

```javascript
import { createReadStream } from "node:fs"

// O Node le arquivos como Buffer por padrao
const stream = createReadStream("arquivo-grande.txt")

stream.on("data", (chunk) => {
  // chunk ja e Buffer — nao converta para string desnecessariamente
  console.log(`Recebido ${chunk.length} bytes`)
  
  // So converta quando realmente precisar do texto
  // const texto = chunk.toString()
})

stream.on("end", () => {
  console.log("Leitura completa")
})
```