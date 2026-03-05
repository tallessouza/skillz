# Code Examples: Calculo de Hash para SRI

## 1. Terminal Linux (OpenSSL)

```bash
# Comando completo: le o arquivo, gera hash SHA-256 binario, converte para base64
openssl dgst -sha256 -binary < script.js | base64

# Sem o pipe base64, o resultado e binario ilegivel:
openssl dgst -sha256 -binary < script.js
# Output: caracteres binarios (nao legivel)

# Com base64:
# Output: UAWC6q0v...TRN8=

# Para SHA-384:
openssl dgst -sha384 -binary < script.js | base64

# Para SHA-512:
openssl dgst -sha512 -binary < script.js | base64
```

## 2. Python

```python
import hashlib
import base64

# Ler o arquivo
with open('script.js', 'rb') as f:
    t = f.read()

# Calcular hash SHA-256
h = hashlib.sha256(t)

# O digest e binario
digest = h.digest()  # bytes, nao legivel

# Converter para base64
result = base64.b64encode(digest).decode()
print(f"sha256-{result}")
```

### Variacao: SHA-384 e SHA-512

```python
# SHA-384
h384 = hashlib.sha384(t).digest()
print(f"sha384-{base64.b64encode(h384).decode()}")

# SHA-512
h512 = hashlib.sha512(t).digest()
print(f"sha512-{base64.b64encode(h512).decode()}")
```

### Variacao: one-liner para scripts de build

```python
import hashlib, base64
sri = f"sha256-{base64.b64encode(hashlib.sha256(open('script.js','rb').read()).digest()).decode()}"
```

## 3. Node.js

```javascript
// No terminal Node (REPL):
const fs = (await import('fs')).default
const crypto = (await import('crypto')).default

const t = fs.readFileSync('script.js', 'utf8')
const h = crypto.createHash('sha256').update(t, 'utf8')
const digest = h.digest('base64')
console.log(`sha256-${digest}`)
```

### Variacao: como modulo ES

```javascript
import fs from 'fs'
import crypto from 'crypto'

const content = fs.readFileSync('script.js', 'utf8')
const hash = crypto.createHash('sha256').update(content, 'utf8').digest('base64')

// Para usar no HTML:
console.log(`integrity="sha256-${hash}"`)
```

### Variacao: funcao utilitaria

```javascript
import fs from 'fs'
import crypto from 'crypto'

function calculateSRI(filePath, algorithm = 'sha256') {
  const content = fs.readFileSync(filePath, 'utf8')
  const hash = crypto.createHash(algorithm).update(content, 'utf8').digest('base64')
  return `${algorithm}-${hash}`
}

// Uso:
console.log(calculateSRI('script.js'))          // sha256-...
console.log(calculateSRI('script.js', 'sha384')) // sha384-...
console.log(calculateSRI('script.js', 'sha512')) // sha512-...
```

## 4. Uso no HTML final

```html
<!-- Exemplo completo com todos os atributos -->
<script
  src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"
  integrity="sha256-UAWC6q0vExampleHashHere="
  crossorigin="anonymous"
></script>

<!-- Multiplos algoritmos (o browser usa o mais forte que suporta) -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha256-abc123= sha384-def456="
  crossorigin="anonymous"
></script>
```

## 5. Automacao em build scripts

```javascript
// Script para gerar integrity de todos os assets externos
import fs from 'fs'
import crypto from 'crypto'
import https from 'https'

function fetchAndHash(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        const hash = crypto.createHash('sha384').update(data, 'utf8').digest('base64')
        resolve(`sha384-${hash}`)
      })
    }).on('error', reject)
  })
}

// Uso:
const integrity = await fetchAndHash('https://cdn.example.com/lib.min.js')
console.log(integrity)
```