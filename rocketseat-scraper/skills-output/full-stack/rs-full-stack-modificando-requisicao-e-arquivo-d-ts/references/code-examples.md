# Code Examples: Modificando Request e Arquivos .d.ts

## Exemplo base da aula

### Estrutura de pastas

```
src/
├── types/
│   └── request.d.ts
├── middlewares/
│   └── auth.ts
└── server.ts
```

### request.d.ts — Tipagem global

```typescript
declare namespace Express {
  export interface Request {
    user_id?: string
  }
}
```

### Middleware adicionando propriedade

```typescript
import { Request, Response, NextFunction } from "express"

export function logMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log("Middleware executado")

  // Adiciona user_id na requisicao
  request.user_id = "123456"

  next()
}
```

### Rota consumindo a propriedade

```typescript
import express from "express"
import { logMiddleware } from "./middlewares/auth"

const app = express()

app.use(express.json())
app.use(logMiddleware)

app.get("/products", (request, response) => {
  // user_id vem do middleware, nao do cliente
  return response.json({
    user_id: request.user_id,
  })
})

app.listen(3000)
```

### Resultado no Insomnia/Postman

**Request:** `GET /products` com body `{ "name": "Produto", "price": 100 }`

**Response:**
```json
{
  "user_id": "123456"
}
```

O `user_id` foi injetado pelo middleware — o cliente nao enviou esse campo.

---

## Variacao: multiplas propriedades customizadas

```typescript
// src/types/request.d.ts
declare namespace Express {
  export interface Request {
    user_id?: string
    role?: "admin" | "user"
    organization_id?: string
  }
}
```

```typescript
// Middleware de autenticacao
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization

  // Simula validacao de token
  req.user_id = "usr_abc123"
  req.role = "admin"
  req.organization_id = "org_xyz789"

  next()
}
```

---

## Variacao: propriedade obrigatoria

```typescript
// Quando TODAS as rotas passam pelo middleware
declare namespace Express {
  export interface Request {
    user_id: string // sem ? = obrigatoria
  }
}
```

---

## Variacao: estendendo Response tambem

```typescript
declare namespace Express {
  export interface Request {
    user_id?: string
  }
  export interface Response {
    paginatedJson?: (data: any[], total: number) => void
  }
}
```

---

## Variacao: middleware especifico por rota (nao global)

```typescript
// Middleware aplicado apenas em rotas especificas
app.get("/admin/dashboard", authMiddleware, (req, res) => {
  // user_id disponivel aqui porque authMiddleware roda antes
  res.json({ user_id: req.user_id })
})

app.get("/public/health", (req, res) => {
  // user_id sera undefined aqui — sem middleware
  res.json({ status: "ok" })
})
```

Neste caso, `user_id` DEVE ser opcional na tipagem (`user_id?: string`).