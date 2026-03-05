---
name: rs-node-js-2023-entendendo-buffers
description: "Applies Node.js Buffer knowledge when working with binary data, streams, or memory-efficient operations. Use when user asks to 'read binary data', 'work with streams', 'convert between encodings', 'handle buffers', or manipulate raw data in Node.js. Ensures correct Buffer API usage and understanding of binary representations. Make sure to use this skill whenever writing Node.js code that deals with binary data, file I/O, or stream processing. Not for browser-only JavaScript, frontend string manipulation, or high-level HTTP response handling."
---

# Buffers no Node.js

> Buffer e a representacao nativa do Node.js para trabalhar com dados binarios na memoria de forma performatica.

## Conceito central

Buffer e um espaco na memoria do computador usado para transitar dados rapidamente. Os dados sao armazenados temporariamente, tratados (enviados para outro lugar), e removidos. Existe porque JavaScript historicamente nao tinha forma nativa de trabalhar com dados binarios — o Node criou essa API para suprir essa lacuna.

## Rules

1. **Use Buffer para dados binarios no Node** — `Buffer.from()` nao `TextEncoder`, porque o Node usa Buffer internamente nas streams e I/O, nao a API Typed Array do JS
2. **Buffer armazena em formato binario (representado como hexadecimal)** — cada byte representado por 2 caracteres hex, porque e mais eficiente que salvar strings com encoding completo na memoria
3. **Buffer e transitorio** — use para dados que serao lidos, processados e descartados, porque foi projetado para transito rapido, nao armazenamento permanente
4. **Prefira Buffer sobre strings em streams** — ler parcialmente em binario e mais performatico que ler strings com acentos, encodings e tratativas extras

## How to write

### Criar Buffer a partir de string

```javascript
// Buffer.from() converte string para representacao binaria
const buffer = Buffer.from("hello")
console.log(buffer)
// <Buffer 68 65 6c 6c 6f> — cada par hex = 1 caractere
```

### Converter Buffer para JSON (representacao decimal)

```javascript
const buffer = Buffer.from("hello")
console.log(buffer.toJSON())
// { type: 'Buffer', data: [ 104, 101, 108, 108, 111 ] }
// Mesmos dados, base decimal em vez de hexadecimal
```

### Usar Buffer com Streams

```javascript
import { Readable } from "node:stream"

const readable = new Readable({
  read() {
    // Streams trabalham com Buffer internamente
    this.push(Buffer.from("chunk de dados"))
    this.push(null)
  }
})
```

## Example

**Before (salvar string diretamente — ineficiente):**
```javascript
// Tentar manipular dados binarios como string
const data = "conteudo com acentuação e caracteres especiais"
// String precisa de encoding, charset, tratativas extras
// Muito mais pesado para a memoria
```

**After (usar Buffer — performatico):**
```javascript
// Buffer converte para binario automaticamente
const buffer = Buffer.from("conteudo com acentuação e caracteres especiais")
// Armazenado como bytes na memoria — leitura/escrita rapida
// Node usa isso internamente em todas as streams
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Lendo/escrevendo arquivos | Trabalhe com Buffer, converta para string so no final |
| Processando stream de dados | Deixe o Node usar Buffer internamente, nao force toString() cedo |
| Precisa inspecionar conteudo binario | Use `buffer.toJSON()` para ver em decimal ou `console.log(buffer)` para hex |
| Comparando dados binarios | Use `Buffer.compare()` ou `buffer.equals()`, nao converta para string |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `toString()` em cada chunk de stream | Acumule buffers, converta no final com `Buffer.concat()` |
| Ignorar que Buffer existe e usar so strings | Use Buffer para I/O e dados binarios |
| Usar Typed Array no Node para I/O | Use Buffer — e o que o Node usa internamente |
| Tratar Buffer como armazenamento permanente | Buffer e transitorio — processe e descarte |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-entendendo-buffers-no-node/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-entendendo-buffers-no-node/references/code-examples.md)
