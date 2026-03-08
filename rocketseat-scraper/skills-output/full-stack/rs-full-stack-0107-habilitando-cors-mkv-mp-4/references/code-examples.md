# Code Examples: Habilitando CORS

## Exemplo 1: Configuracao basica (da aula)

### Instalacao
```bash
# Em terminal separado (servidor continua rodando)
npm install cors@2.8.5
npm install -D @types/cors@2.8.17
```

### Uso no app
```typescript
import cors from "cors"
import express from "express"

const app = express()

app.use(cors())

// Rotas da aplicacao vem depois
app.get("/users", (req, res) => {
  res.json({ users: [] })
})
```

## Exemplo 2: CORS com origens restritas (producao)

```typescript
import cors from "cors"
import express from "express"

const app = express()

app.use(cors({
  origin: "https://meuapp.com",
}))
```

## Exemplo 3: CORS com multiplas origens

```typescript
import cors from "cors"
import express from "express"

const allowedOrigins = [
  "https://meuapp.com",
  "https://admin.meuapp.com",
  "http://localhost:3000", // desenvolvimento
]

const app = express()

app.use(cors({
  origin: allowedOrigins,
}))
```

## Exemplo 4: CORS com credentials (cookies cross-origin)

```typescript
import cors from "cors"
import express from "express"

const app = express()

app.use(cors({
  origin: "https://meuapp.com",
  credentials: true,
}))
```

## Exemplo 5: CORS com metodos e headers especificos

```typescript
import cors from "cors"
import express from "express"

const app = express()

app.use(cors({
  origin: "https://meuapp.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}))
```

## Exemplo 6: CORS dinamico por origem

```typescript
import cors from "cors"
import express from "express"

const allowedOrigins = ["https://meuapp.com", "https://parceiro.com"]

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Origem nao permitida pelo CORS"))
    }
  },
}))
```

## Exemplo 7: CORS apenas em rotas especificas

```typescript
import cors from "cors"
import express from "express"

const app = express()

const publicCors = cors({ origin: "*" })
const restrictedCors = cors({ origin: "https://admin.meuapp.com" })

// Rota publica — qualquer origem
app.get("/api/public", publicCors, (req, res) => {
  res.json({ data: "publico" })
})

// Rota restrita — apenas admin
app.get("/api/admin", restrictedCors, (req, res) => {
  res.json({ data: "restrito" })
})
```