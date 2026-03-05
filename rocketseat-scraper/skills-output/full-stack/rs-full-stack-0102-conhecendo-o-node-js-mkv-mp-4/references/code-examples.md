# Code Examples: Conhecendo o Node.js

## Demonstrando que Node executa JavaScript fora do navegador

### Exemplo 1: Hello World — Node vs Navegador

No navegador (JavaScript com APIs do browser):
```javascript
// Roda no console do Chrome — usa APIs do navegador
document.getElementById('app').textContent = 'Hello World'
window.alert('Hello World')
console.log(navigator.userAgent)
```

No Node (JavaScript com APIs de sistema):
```javascript
// Roda no terminal com: node hello.js
// Usa APIs de sistema operacional, nao tem DOM
const os = require('os')

console.log('Hello World')
console.log(`Plataforma: ${os.platform()}`)
console.log(`CPU: ${os.cpus()[0].model}`)
console.log(`Memoria livre: ${Math.round(os.freemem() / 1024 / 1024)}MB`)
```

### Exemplo 2: Mesmo V8, APIs diferentes

```javascript
// FUNCIONA em ambos (Node e navegador) — JavaScript puro, processado pelo V8
const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map(n => n * 2)
console.log(doubled) // [2, 4, 6, 8, 10]

// APENAS no navegador — API do browser
document.querySelector('.btn').addEventListener('click', handler)

// APENAS no Node — API de sistema
const fs = require('fs')
const content = fs.readFileSync('arquivo.txt', 'utf-8')
```

## Node em diferentes propositos

### Back-end (servidor HTTP)
```javascript
const http = require('http')

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello from Node.js server!')
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

### Automacao (script de build)
```javascript
const fs = require('fs')
const path = require('path')

// Script que organiza arquivos por extensao
const sourceDir = './downloads'
const files = fs.readdirSync(sourceDir)

files.forEach(file => {
  const ext = path.extname(file).slice(1) || 'outros'
  const destDir = path.join(sourceDir, ext)

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  fs.renameSync(
    path.join(sourceDir, file),
    path.join(destDir, file)
  )
})

console.log('Arquivos organizados!')
```

### CLI Tool
```javascript
#!/usr/bin/env node
// Ferramenta de linha de comando feita com Node

const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'greet':
    console.log(`Hello, ${args[1] || 'World'}!`)
    break
  case 'time':
    console.log(`Current time: ${new Date().toLocaleTimeString()}`)
    break
  default:
    console.log('Commands: greet [name], time')
}
```

## Verificando o V8 no Node

```javascript
// Confirma que Node usa o V8 internamente
console.log(`Node version: ${process.version}`)
console.log(`V8 version: ${process.versions.v8}`)
console.log(`Platform: ${process.platform}`)
console.log(`Architecture: ${process.arch}`)
```

Saida tipica:
```
Node version: v20.11.0
V8 version: 11.3.244.8
Platform: linux
Architecture: x64
```