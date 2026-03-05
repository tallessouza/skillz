# Code Examples: API REST com Node.js

## Setup inicial tipico do stack

### 1. Inicializacao do projeto

```bash
mkdir my-api && cd my-api
npm init -y
npm install express
npm install -D typescript @types/express @types/node ts-node-dev
npx tsc --init
```

### 2. tsconfig.json minimo

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 3. Servidor Express basico com TypeScript

```typescript
// src/server.ts
import express, { Request, Response } from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### 4. Schema Validation com Zod (exemplo)

```typescript
// src/schemas/user.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
```

```typescript
// src/routes/users.ts
import { Router, Request, Response } from 'express'
import { createUserSchema } from '../schemas/user'

const router = Router()

router.post('/', (req: Request, res: Response) => {
  const result = createUserSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() })
  }

  const { name, email, password } = result.data
  // Logica de criacao do usuario
  res.status(201).json({ name, email })
})

export default router
```

### 5. Estrutura de pastas recomendada

```
src/
├── server.ts          # Entry point, configuracao do Express
├── routes/            # Definicao de rotas
│   └── users.ts
├── controllers/       # Logica de orquestracao
│   └── usersController.ts
├── services/          # Logica de negocio
│   └── usersService.ts
├── schemas/           # Schema Validation (Zod/Joi)
│   └── user.ts
└── middlewares/        # Middlewares customizados
    └── errorHandler.ts
```

### 6. Script de desenvolvimento

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```