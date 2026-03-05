# Code Examples: Streams de Escrita e Transformacao

## Exemplo completo da aula

### Readable (contexto — criada na aula anterior)

```javascript
import { Readable } from 'node:stream'

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null) // sinaliza fim da stream
      } else {
        const buf = Buffer.from(String(i))
        this.push(buf)
      }
    }, 1000)
  }
}
```

### Writable — MultiplyByTenStream

```javascript
import { Writable } from 'node:stream'

class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}
```

**Uso:**

```javascript
new OneToHundredStream()
  .pipe(new MultiplyByTenStream())
```

**Saida (a cada segundo):**
```
10
20
30
40
...
```

### Transform — InverseNumberStream

```javascript
import { Transform } from 'node:stream'

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1
    callback(null, Buffer.from(String(transformed)))
  }
}
```

### Pipeline completo: Readable → Transform → Writable

```javascript
new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream())
```

**Saida (a cada segundo):**
```
-10
-20
-30
-40
...
```

**Fluxo dos dados:**
```
OneToHundredStream: push(Buffer.from("1"))
       │
       ▼ pipe
InverseNumberStream: chunk "1" → transformed = -1 → callback(null, Buffer.from("-1"))
       │
       ▼ pipe
MultiplyByTenStream: chunk "-1" → console.log(-1 * 10) → callback()
       │
       ▼
Console: -10
```

## Transform com validacao de erro

```javascript
class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const value = chunk.toString()
    const number = Number(value)

    if (isNaN(number)) {
      return callback(new Error('number not valid'))
    }

    const transformed = number * -1
    callback(null, Buffer.from(String(transformed)))
  }
}
```

## Erro comum demonstrado ao vivo

O instrutor mostrou que esquecer `Buffer.from()` causa erro:

```javascript
// ERRADO — causa TypeError
_transform(chunk, encoding, callback) {
  const transformed = Number(chunk.toString()) * -1
  callback(null, transformed) // number nao e aceito!
}
```

```
TypeError: The "chunk" argument must be of type string or an instance of Buffer
```

**Correcao:**

```javascript
callback(null, Buffer.from(String(transformed)))
```

## Variacao: Transform que converte para uppercase

```javascript
class UpperCaseStream extends Transform {
  _transform(chunk, encoding, callback) {
    callback(null, Buffer.from(chunk.toString().toUpperCase()))
  }
}
```

## Variacao: Writable que salva em array

```javascript
class CollectorStream extends Writable {
  items = []

  _write(chunk, encoding, callback) {
    this.items.push(chunk.toString())
    callback()
  }
}
```

## Resumo dos metodos obrigatorios por tipo

| Tipo | Metodo obrigatorio | Assinatura callback |
|------|-------------------|---------------------|
| Readable | `_read()` | N/A (usa `this.push()`) |
| Writable | `_write(chunk, encoding, callback)` | `callback()` |
| Transform | `_transform(chunk, encoding, callback)` | `callback(error, transformedBuffer)` |
| Duplex | `_read()` + `_write()` | Ambos os formatos |