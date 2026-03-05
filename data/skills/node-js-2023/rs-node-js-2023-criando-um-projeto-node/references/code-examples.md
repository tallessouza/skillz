# Code Examples: Criando um Projeto Node.js

## 1. Inicializacao do projeto

```bash
# Criar estrutura de pastas
mkdir 01-fundamentos-nodejs
cd 01-fundamentos-nodejs

# Inicializar com todas as respostas padrao
npm init -y
```

Resultado: arquivo `package.json` gerado automaticamente.

## 2. package.json com ES Modules

```json
{
  "name": "01-fundamentos-nodejs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

O campo critico e `"type": "module"`.

## 3. Importacao CommonJS (legado — NAO usar)

```javascript
const http = require("http")
```

## 4. Importacao ES Modules (correto)

```javascript
import http from "node:http"
```

## 5. Servidor HTTP completo

```javascript
import http from "node:http"

const server = http.createServer((req, res) => {
  return res.end("Hello World")
})

server.listen(3333)
```

## 6. Executando e testando

```bash
# Executar o servidor
node src/server.js

# Testar com curl (em outro terminal)
curl http://localhost:3333
# Output: Hello World

# Testar com httpie (alternativa)
http localhost:3333
```

## 7. Exemplo basico de JavaScript no Node (demonstracao)

O instrutor mostrou que qualquer JavaScript valido roda no Node:

```javascript
const a = 3
const b = 7
console.log(a + b)
// Output: 10
```

```bash
node src/server.js
# Output: 10
```

## 8. Diferenca entre modulos internos e terceiros

```javascript
// Modulos internos do Node — usar prefixo node:
import http from "node:http"
import crypto from "node:crypto"
import path from "node:path"
import fs from "node:fs"

// Modulos terceiros (instalados via npm) — sem prefixo
import fastify from "fastify"
import express from "express"
```