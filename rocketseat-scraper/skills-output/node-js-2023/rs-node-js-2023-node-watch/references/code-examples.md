# Code Examples: Node --watch

## Exemplo 1: Servidor HTTP basico (contexto da aula)

```javascript
// src/server.js
const http = require('node:http')

const server = http.createServer((req, res) => {
  res.end('Hello World')
})

server.listen(3333)
```

### Execucao sem watch (manual)

```bash
node src/server.js
# Acessa localhost:3333 -> "Hello World"

# Muda "Hello World" para "Hello Ignite" no codigo
# Acessa localhost:3333 -> ainda mostra "Hello World" (!)

# Ctrl+C para parar
node src/server.js
# Acessa localhost:3333 -> agora mostra "Hello Ignite"
```

### Execucao com watch (automatico)

```bash
node --watch src/server.js
# Acessa localhost:3333 -> "Hello World"

# Muda "Hello World" para "Hello Ignite" no codigo
# Terminal mostra restart automatico
# Acessa localhost:3333 -> "Hello Ignite" (sem precisar reiniciar!)
```

## Exemplo 2: package.json com script dev

```json
{
  "name": "01-fundamentos-nodejs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "node --watch src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### Uso

```bash
npm run dev
# Equivalente a: node --watch src/server.js
# Mas muito mais simples de lembrar e executar
```

## Exemplo 3: Variacoes de npm scripts uteis

```json
{
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "build": "tsc",
    "test": "node --test"
  }
}
```

- `dev`: Desenvolvimento com auto-restart
- `start`: Producao sem watch (execucao unica)
- Scripts com `npm run <nome>` para qualquer script customizado
- Scripts `start` e `test` podem ser executados sem `run`: `npm start`, `npm test`