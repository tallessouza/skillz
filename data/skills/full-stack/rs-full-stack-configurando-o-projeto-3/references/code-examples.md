# Code Examples: Setup Express + TypeScript

## Exemplo completo do instrutor

### Instalacao (comandos exatos)

```bash
# Dependencia de producao
npm i express@4.19.2

# Dependencias de desenvolvimento
npm i -D typescript@5.5.4 @types/node@20.14.12 @types/express@4.17.21 tsx@4.16.2
```

### tsconfig.json (exato da aula)

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2023"],
    "paths": {
      "@/*": ["./src/*"]
    },
    "module": "node16",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### src/server.ts (exato da aula)

```typescript
import express from "express"

const PORT = 3333
const app = express()

app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

### package.json — scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

## Variacoes uteis

### Com variavel de ambiente para porta

```typescript
import express from "express"

const PORT = Number(process.env.PORT) || 3333
const app = express()

app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

### Com CORS (proximo passo comum)

```typescript
import express from "express"
import cors from "cors"

const PORT = 3333
const app = express()

app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

### Estrutura tipica apos setup inicial

```
projeto/
├── src/
│   ├── server.ts          # Entry point
│   ├── routes/            # Route definitions
│   │   └── index.ts
│   ├── controllers/       # Request handlers
│   ├── middlewares/        # Custom middlewares
│   └── utils/             # Helpers
├── tsconfig.json
├── package.json
└── .gitignore
```

### .gitignore recomendado

```
node_modules/
dist/
.env
```