---
name: rs-node-js-2023-criando-stream-de-leitura
description: "Enforces correct Readable stream creation patterns in Node.js. Use when user asks to 'create a stream', 'read file stream', 'process data incrementally', 'implement readable', or any streaming data task. Applies rules: always use Buffer format for chunks, implement _read method, use push(null) to signal end, pipe for connecting streams. Make sure to use this skill whenever generating Node.js code that processes data incrementally or creates custom streams. Not for HTTP response handling, database queries, or frontend code."
---

# Criando Stream de Leitura no Node.js

> Streams permitem trabalhar com dados antes deles estarem completos — leia, processe e encaminhe aos poucos.

## Rules

1. **Toda porta de entrada/saida no Node e uma stream** — `req` e `res` no HTTP, `process.stdin` e `process.stdout` sao streams nativas, porque o Node foi desenhado para I/O incremental
2. **Chunks devem ser Buffer ou string, nunca tipos primitivos** — use `Buffer.from(String(valor))` para converter, porque streams operam em formato binario internamente
3. **Implemente `_read()` em toda ReadableStream customizada** — este metodo e obrigatorio e define como os dados sao fornecidos, porque sem ele a stream nao sabe o que emitir
4. **Sinalize fim com `this.push(null)`** — enviar null indica que nao ha mais dados, porque sem isso o consumidor nunca sabe quando parar de ler
5. **Conecte streams com `.pipe()`** — pipe encaminha dados de uma readable para uma writable automaticamente, porque gerencia backpressure e propagacao de erros
6. **Dados podem ser emitidos com delay** — usar setTimeout dentro de `_read()` demonstra que streams processam dados incrementalmente, porque cada push e independente

## How to write

### ReadableStream customizada

```typescript
import { Readable } from "node:stream"

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    if (i > 100) {
      this.push(null) // sinaliza fim da stream
      return
    }

    const buf = Buffer.from(String(i))
    this.push(buf)
  }
}

new OneToHundredStream().pipe(process.stdout)
```

### Conectando stdin a stdout com pipe

```typescript
// Tudo que o usuario digita no terminal e ecoado de volta
process.stdin.pipe(process.stdout)
```

### ReadableStream com emissao temporizada

```typescript
class TimedStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    if (i > 100) {
      this.push(null)
      return
    }

    setTimeout(() => {
      this.push(Buffer.from(String(i)))
    }, 1000)
  }
}
```

## Example

**Before (erro comum — tipo primitivo no push):**
```typescript
class BadStream extends Readable {
  index = 1
  _read() {
    const i = this.index++
    if (i > 10) return this.push(null)
    this.push(i) // ERRO: primeiro argumento deve ser string ou Buffer
  }
}
```

**After (com esta skill aplicada):**
```typescript
class CorrectStream extends Readable {
  index = 1
  _read() {
    const i = this.index++
    if (i > 10) return this.push(null)
    this.push(Buffer.from(String(i))) // Buffer a partir de string
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dados chegam aos poucos (upload, arquivo grande) | Use ReadableStream com pipe |
| Precisa testar streams no terminal | Use `process.stdin.pipe(process.stdout)` |
| Criando stream customizada | Estenda `Readable`, implemente `_read()` |
| Precisa enviar numeros na stream | Converta para string antes: `Buffer.from(String(n))` |
| Stream terminou de emitir | `this.push(null)` obrigatoriamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `this.push(42)` | `this.push(Buffer.from(String(42)))` |
| `this.push(i)` onde i e number | `this.push(Buffer.from(String(i)))` |
| ReadableStream sem `_read()` | Sempre implementar `_read()` |
| Ler stream inteira de uma vez com await | Usar `.pipe()` para processar incrementalmente |
| Esquecer `this.push(null)` | Sempre sinalizar fim da stream |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-criando-stream-de-leitura/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-criando-stream-de-leitura/references/code-examples.md)
