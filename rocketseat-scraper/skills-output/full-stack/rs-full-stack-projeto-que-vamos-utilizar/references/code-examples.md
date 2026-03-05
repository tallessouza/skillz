# Code Examples: Preparar Projeto Node.js TypeScript para Docker

## server.ts (codigo fonte)

```typescript
import express from "express"

const app = express()

app.get("/", (request, response) => {
  return response.json({ message: "hello world" })
})

app.listen(3333, () => {
  console.log("Server is running on port 3333")
})
```

Servidor Express minimo: uma rota GET na raiz retornando JSON. Porta 3333.

## package.json

```json
{
  "name": "docker-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Explicacao dos scripts:

| Script | Comando | Quando usar |
|--------|---------|-------------|
| `dev` | `tsx src/server.ts` | Desenvolvimento local com hot-reload |
| `build` | `tsc` | Antes de deploy — compila TS para JS |
| `start` | `node dist/server.js` | Producao — executa JS compilado |

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

O campo critico e `outDir: "./dist"` — define onde o JavaScript compilado sera gerado.

## dist/server.js (output do build)

```javascript
"use strict"
const express = require("express")

const app = express()

app.get("/", (request, response) => {
  return response.json({ message: "hello world" })
})

app.listen(3333, () => {
  console.log("Server is running on port 3333")
})
```

Mesmo codigo, sem TypeScript. Gerado automaticamente por `tsc`.

## Fluxo completo de setup

```bash
# 1. Download e setup
unzip fullstack-docker-api.zip
cd docker-api
npm install

# 2. Desenvolvimento
npm run dev
# Server is running on port 3333
# Mudancas em src/ refletem automaticamente

# 3. Build para producao
npm run build
# Gera dist/server.js

# 4. Executar em producao
npm start
# Roda dist/server.js com node
# Mudancas em src/ NAO refletem sem novo build
```

## Verificacao no navegador

```bash
# Desenvolvimento ou producao
curl http://localhost:3333/
# {"message":"hello world"}
```