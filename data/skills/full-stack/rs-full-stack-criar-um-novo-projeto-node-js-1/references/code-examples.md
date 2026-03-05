# Code Examples: Criar Projeto Node.js + TypeScript

## Setup completo passo a passo

### 1. Criar pasta e inicializar

```bash
# Criar pasta do projeto
mkdir testes
cd testes

# Inicializar package.json com valores padrao
npm init -y
```

Output esperado do `npm init -y`:
```json
{
  "name": "testes",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 2. Instalar tsx

```bash
npm i tsx@4.19.1
```

### 3. Criar estrutura

```bash
mkdir src
```

### 4. Arquivo de entrada (src/server.ts)

```typescript
console.log("Hello World")
```

### 5. package.json final (limpo)

```json
{
  "name": "testes",
  "version": "1.0.0",
  "main": "index.js",
  "license": "ISC",
  "scripts": {
    "dev": "tsx watch src/server.ts"
  },
  "dependencies": {
    "tsx": "4.19.1"
  }
}
```

Campos removidos intencionalmente:
- `"test"` script (sera substituido por framework de testes depois)
- `"keywords": []`
- `"author": ""`
- `"description": ""`

### 6. Executar e verificar

```bash
npm run dev
# Output: Hello World
```

## Variacoes

### Com TypeScript mais elaborado

```typescript
// src/server.ts
interface User {
  name: string
  age: number
}

const user: User = {
  name: "Rodrigo",
  age: 30
}

console.log(`${user.name} tem ${user.age} anos`)
```

### Com funcao para testes futuros

```typescript
// src/server.ts
export function sum(a: number, b: number): number {
  return a + b
}

console.log(sum(2, 3)) // 5
```

Este padrao ja prepara o projeto para a proxima etapa: escrever testes para a funcao `sum`.

### Com servidor HTTP basico (evolucao natural)

```typescript
// src/server.ts
import http from "node:http"

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Hello World")
})

server.listen(3333, () => {
  console.log("Server running on http://localhost:3333")
})
```

O `tsx watch` tambem funciona com servidores HTTP — reinicia automaticamente ao salvar.