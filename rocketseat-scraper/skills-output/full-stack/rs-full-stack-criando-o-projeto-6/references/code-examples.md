# Code Examples: Criando Projeto Express + TypeScript

## Exemplo completo: package.json final

```json
{
  "name": "rocket-log",
  "version": "1.0.0",
  "description": "API de Entregas de encomendas",
  "main": "index.js",
  "author": "Seu Nome",
  "license": "ISC",
  "scripts": {
    "dev": "tsx watch src/server.ts"
  },
  "dependencies": {
    "express": "4.19.2"
  },
  "devDependencies": {
    "@types/express": "4.17.21",
    "@types/node": "20.14.12",
    "tsx": "4.16.2",
    "typescript": "5.5.4"
  }
}
```

## Exemplo completo: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "paths": {
      "@/*": ["./src/*"]
    },
    "module": "Node16",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Exemplo completo: src/app.ts

```typescript
import express from "express"

const app = express()
app.use(express.json())

export { app }
```

## Exemplo completo: src/server.ts

```typescript
import { app } from "@/app"

const PORT = 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

## Variação: com variável de ambiente para porta

```typescript
import { app } from "@/app"

const PORT = Number(process.env.PORT) || 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

## Variação: app.ts com error handler básico

```typescript
import express, { Request, Response, NextFunction } from "express"

const app = express()
app.use(express.json())

// Rotas serão adicionadas aqui

// Error handler (adicionado em aulas futuras)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal Server Error" })
})

export { app }
```

## Sequência de comandos completa

```bash
# 1. Criar e entrar na pasta
mkdir rocket-log && cd rocket-log

# 2. Inicializar projeto
npm init -y

# 3. Instalar Express
npm i express@4.19.2

# 4. Instalar TypeScript e tipagens
npm i typescript@5.5.4 @types/node@20.14.12 -D
npm i @types/express@4.17.21 -D

# 5. Instalar tsx para execução
npm i tsx@4.16.2 -D

# 6. Gerar tsconfig.json
npx tsc --init

# 7. Criar estrutura de pastas
mkdir src
touch src/app.ts src/server.ts

# 8. Executar
npm run dev
```

## Estrutura final do projeto

```
rocket-log/
├── node_modules/
├── src/
│   ├── app.ts
│   └── server.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Import com path alias vs. relativo

```typescript
// ✅ Com path alias (@/ configurado no tsconfig)
import { app } from "@/app"

// ❌ Relativo — funciona mas fica frágil em projetos maiores
import { app } from "./app"

// ❌ Ainda pior em subpastas
import { app } from "../../app"
```

## Verificação rápida

Após `npm run dev`, o terminal deve mostrar:

```
Server is running on port 3333
```

Teste com curl:

```bash
curl http://localhost:3333
# Deve retornar algo (404 ou resposta padrão, já que não há rotas)
```