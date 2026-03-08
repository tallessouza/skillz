# Code Examples: Executando o Projeto Express + TypeScript

## Exemplo completo do app.ts (como mostrado na aula)

```typescript
// src/app.ts
import express from "express"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World")
})

export { app }
```

O instrutor primeiro cria a importação, depois a instância, depois o middleware `express.json()`, depois uma rota de teste com `res.send`, e por fim exporta o app.

## Exemplo completo do server.ts

```typescript
// src/server.ts
import { app } from "@/app"

const PORT = 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

O instrutor importa usando o path alias `@/app` (configurado no tsconfig) em vez de caminho relativo `./app`.

## tsconfig.json completo

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

## package.json (scripts relevantes)

```json
{
  "main": "src/server.ts",
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

## Variação: Preparando para variável de ambiente

O instrutor menciona "poderia ser uma variável de ambiente, mas eu vou deixar por enquanto assim". A evolução natural:

```typescript
// src/server.ts — versão com env
import { app } from "@/app"

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

## Variação: Endpoint JSON (próximos passos)

O instrutor usa `res.send()` para teste, mas em endpoints reais de API:

```typescript
// Resposta de texto (teste)
app.get("/", (req, res) => {
  res.send("Hello World")
})

// Resposta JSON (API real)
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})
```

## Variação: Múltiplas rotas antes de separar em arquivos

```typescript
// src/app.ts — com algumas rotas iniciais
import express from "express"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.get("/health", (req, res) => {
  res.json({ status: "healthy" })
})

app.post("/users", (req, res) => {
  const { name, email } = req.body
  res.status(201).json({ id: "uuid", name, email })
})

export { app }
```

## Fluxo de execução demonstrado na aula

```bash
# Terminal
npm run dev
# Output: Server is running on port 3333

# Navegador
# http://localhost:3333 → "Hello World"

# Instrutor altera "Hello World" para "Hello node.js" e salva
# Terminal reinicia automaticamente (tsx watch)
# Atualiza navegador → "Hello node.js"
```

## Estrutura final do projeto após esta aula

```
project/
├── node_modules/
├── src/
│   ├── app.ts          # Express instance + middlewares + routes
│   └── server.ts       # Server startup (listen)
├── package.json        # Scripts: dev com tsx watch
├── tsconfig.json       # Path aliases, strict, ES2022
└── package-lock.json
```