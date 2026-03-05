# Code Examples: Criando Stream de Leitura no Node.js

## Exemplo 1: stdin para stdout (mais basico possivel)

```typescript
// streams-fundamentals.mjs
// Tudo que o usuario digita e ecoado de volta no terminal
process.stdin.pipe(process.stdout)
```

**Execucao:**
```bash
node streams-fundamentals.mjs
# Terminal fica aguardando input
# Digitar "Diego" + Enter → imprime "Diego" novamente
# Digitar "Oi" + Enter → imprime "Oi" novamente
```

## Exemplo 2: ReadableStream de 1 a 100 (versao sincrona)

```typescript
import { Readable } from "node:stream"

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    if (i > 100) {
      this.push(null) // fim da stream
      return
    }

    const buf = Buffer.from(String(i))
    this.push(buf)
  }
}

new OneToHundredStream().pipe(process.stdout)
```

**Execucao:**
```bash
node streams-fundamentals.mjs
# Output imediato: 123456789101112...9899100
# Tudo aparece de uma vez porque nao ha delay
```

## Exemplo 3: ReadableStream com delay (versao assincrona)

```typescript
import { Readable } from "node:stream"

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    if (i > 100) {
      this.push(null)
      return
    }

    setTimeout(() => {
      this.push(Buffer.from(String(i)))
    }, 1000) // 1 segundo entre cada numero
  }
}

new OneToHundredStream().pipe(process.stdout)
```

**Execucao:**
```bash
node streams-fundamentals.mjs
# A cada 1 segundo, um novo numero aparece
# 1 (espera 1s) 2 (espera 1s) 3 ...
# Demonstra processamento incremental
```

## Evolucao dos erros (como o instrutor demonstrou)

### Erro 1: Push de tipo primitivo

```typescript
// ERRO: The "chunk" argument must be of type string or Buffer
_read() {
  const i = this.index++
  if (i > 100) return this.push(null)
  this.push(i) // ❌ i e number
}
```

### Erro 2: Buffer.from com number

```typescript
// ERRO: The first argument must be of type string or instance of Buffer, received type number
_read() {
  const i = this.index++
  if (i > 100) return this.push(null)
  const buf = Buffer.from(i) // ❌ Buffer.from nao aceita number
  this.push(buf)
}
```

### Solucao final: String() antes de Buffer.from()

```typescript
// ✅ Correto
_read() {
  const i = this.index++
  if (i > 100) return this.push(null)
  const buf = Buffer.from(String(i)) // converter para string primeiro
  this.push(buf)
}
```

## Demonstracao: req e res tambem sao streams

```typescript
import http from "node:http"

const server = http.createServer((req, res) => {
  // req e uma ReadableStream
  // res e uma WritableStream
  // Ambos suportam .pipe()

  req.pipe(res) // ecoa o body da requisicao de volta (exemplo didatico)
})
```

O instrutor mostra que `res.pipe()` e `req.pipe()` existem porque sao streams nativas do Node.