# Code Examples: TypeScript em Aplicacao Node.js

## Setup completo passo a passo

### 1. Inicializacao

```bash
# Criar diretorio e inicializar
mkdir my-node-api
cd my-node-api
npm init -y

# Instalar TypeScript e tipos do Node
npm install typescript @types/node -D

# Gerar tsconfig.json
npx tsc --init
```

### 2. tsconfig.json para API Node.js

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. package.json scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 4. Primeiro arquivo TypeScript

```typescript
// src/server.ts
import http from 'node:http'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'API running with TypeScript' }))
})

const PORT = 3333

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## Variacoes de ferramentas de desenvolvimento

### Com tsx (recomendado)

```bash
npm install tsx -D
```

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

### Com ts-node-dev

```bash
npm install ts-node ts-node-dev -D
```

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts"
  }
}
```

### Com nodemon + ts-node

```bash
npm install nodemon ts-node -D
```

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts"
  }
}
```

## Tipagem de request/response em API REST

```typescript
// src/types.ts
interface User {
  id: string
  name: string
  email: string
}

interface CreateUserBody {
  name: string
  email: string
}

// src/routes/users.ts
import { Request, Response } from 'express'

export async function createUser(req: Request<{}, {}, CreateUserBody>, res: Response) {
  const { name, email } = req.body // tipado automaticamente
  // ...
}
```

## Erros comuns e solucoes

### Erro: Cannot use import statement outside a module

```json
// tsconfig.json — garantir que module esta correto
{
  "compilerOptions": {
    "module": "ESNext"
  }
}
```

```json
// package.json — adicionar type module se necessario
{
  "type": "module"
}
```

### Erro: Cannot find module '@types/node'

```bash
# Instalar tipos do Node
npm install @types/node -D
```

### Erro: Property does not exist on type

```typescript
// ERRADO — acessar propriedade sem tipar
const name = req.body.name // any

// CORRETO — tipar o body
const { name } = req.body as CreateUserBody
// ou melhor, tipar no handler
```