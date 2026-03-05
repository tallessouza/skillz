---
name: rs-node-js-2023-stream-escrita-transformacao
description: "Enforces correct Writable and Transform stream patterns when writing Node.js streaming code. Use when user asks to 'create a stream', 'process data in chunks', 'pipe streams', 'transform stream data', or 'write a writable stream'. Applies rules: _write for Writable, _transform for Transform, callback always called, Buffer conversion on transform output. Make sure to use this skill whenever generating Node.js stream processing code. Not for HTTP request handling, file system operations, or frontend code."
---

# Streams de Escrita e Transformacao no Node.js

> Writable streams processam dados, Transform streams convertem dados entre leitura e escrita — cada uma tem seu metodo obrigatorio e seu contrato com o callback.

## Rules

1. **Writable usa `_write`, Transform usa `_transform`** — nunca confunda os metodos, porque cada tipo de stream tem seu contrato especifico com o Node
2. **Sempre chame o callback** — sem chamar `callback()`, a stream trava e nunca processa o proximo chunk, porque o Node usa o callback como sinal de "pronto pro proximo"
3. **Writable nunca retorna dados** — ela apenas processa (salva, loga, envia), porque retornar dados e responsabilidade da Transform
4. **Transform envia dados via callback** — `callback(null, transformedBuffer)`, primeiro parametro e o erro (null se ok), segundo e o dado transformado como Buffer
5. **Sempre converta chunk de Buffer para o tipo necessario** — `chunk.toString()` antes de operar, porque chunks chegam como Buffer por padrao
6. **Transform deve retornar Buffer ou string** — ao enviar dados no callback, converta com `Buffer.from(String(value))`, porque streams transitam dados como Buffer

## How to write

### Writable Stream

```typescript
import { Writable } from 'node:stream'

class ProcessDataStream extends Writable {
  _write(chunk, encoding, callback) {
    const data = chunk.toString()
    // Processa o dado (log, salvar, enviar) — nunca retorna
    console.log('Processado:', data)
    callback()
  }
}
```

### Transform Stream

```typescript
import { Transform } from 'node:stream'

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const number = Number(chunk.toString())

    if (isNaN(number)) {
      return callback(new Error('number not valid'))
    }

    const transformed = number * -1
    callback(null, Buffer.from(String(transformed)))
  }
}
```

### Pipe encadeado (Readable → Transform → Writable)

```typescript
readableStream
  .pipe(new InverseNumberStream())
  .pipe(new ProcessDataStream())
```

## Example

**Before (erros comuns):**

```typescript
// ERRO 1: Transform sem converter para Buffer
class BadTransform extends Transform {
  _transform(chunk, encoding, callback) {
    const result = Number(chunk.toString()) * 10
    callback(null, result) // TypeError: chunk must be string or Buffer
  }
}

// ERRO 2: Writable sem chamar callback
class BadWritable extends Writable {
  _write(chunk, encoding, callback) {
    console.log(chunk.toString())
    // Stream trava aqui — nunca processa o proximo chunk
  }
}
```

**After (com esta skill aplicada):**

```typescript
class MultiplyByTenTransform extends Transform {
  _transform(chunk, encoding, callback) {
    const result = Number(chunk.toString()) * 10
    callback(null, Buffer.from(String(result)))
  }
}

class LogStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(chunk.toString())
    callback()
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa apenas processar/consumir dados | Writable com `_write` |
| Precisa converter dados entre duas streams | Transform com `_transform` |
| Precisa ler E escrever (raro) | Duplex stream |
| Erro dentro de Transform | `callback(new Error('mensagem'))` |
| Sucesso em Transform | `callback(null, Buffer.from(String(resultado)))` |
| Sucesso em Writable | `callback()` sem argumentos |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `callback(null, numericValue)` em Transform | `callback(null, Buffer.from(String(value)))` |
| Writable com `return transformedData` | Writable so processa, use Transform para retornar |
| `_write` dentro de Transform | `_transform` dentro de Transform |
| `_transform` dentro de Writable | `_write` dentro de Writable |
| Esquecer `callback()` | Sempre chamar callback ao final |
| `chunk * 10` sem converter | `Number(chunk.toString()) * 10` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-stream-de-escrita-e-transformacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-stream-de-escrita-e-transformacao/references/code-examples.md)
