# Code Examples: Requisições Autenticadas com Token JWT

## 1. Estrutura das rotas da API (backend — referência)

```typescript
// routes/refund-routes.ts
import { Router } from "express"
import { RefundController } from "../controllers/RefundController"
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization"

const refundRoutes = Router()
const refundController = new RefundController()

refundRoutes.use(ensureAuthenticated)

refundRoutes.post(
  "/",
  verifyUserAuthorization(["employee"]),
  refundController.create
)

export { refundRoutes }
```

## 2. Middleware de autenticação (backend — referência)

```typescript
// middlewares/ensureAuthenticated.ts
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return response.status(401).json({ message: "JWT token not found" })
  }

  const [, token] = authHeader.split(" ") // Remove "Bearer " prefix

  try {
    const decoded = verify(token, process.env.JWT_SECRET)
    request.user = { id: decoded.sub as string }
    return next()
  } catch {
    return response.status(401).json({ message: "Invalid JWT token" })
  }
}
```

## 3. Importações no componente de formulário

```typescript
// pages/Refund/index.tsx
import { api } from "../../services/api"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
```

## 4. Função de submit completa

```typescript
const navigate = useNavigate()

async function handleSubmit(event: React.FormEvent) {
  event.preventDefault()

  try {
    await api.post("/refunds", {
      name,
      category,
      amount,
      filename: "placeholder-filename.png",
    })

    navigate("/")
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data.message)
    } else if (error instanceof Error) {
      alert(error.message)
    }
  }
}
```

## 5. Configuração do token no auth context — login

```typescript
// contexts/AuthContext.tsx
import { api } from "../services/api"

async function signIn({ email, password }: SignInInput) {
  try {
    const { data } = await api.post("/sessions", { email, password })

    // Configura token no Axios para todas as próximas requisições
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

    // Persiste no localStorage para sobreviver reloads
    localStorage.setItem("@app:token", data.token)
    localStorage.setItem("@app:user", JSON.stringify(data.user))

    setUser(data.user)
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data.message)
    }
  }
}
```

## 6. Restauração do token ao carregar a aplicação

```typescript
// contexts/AuthContext.tsx
useEffect(() => {
  const token = localStorage.getItem("@app:token")
  const user = localStorage.getItem("@app:user")

  if (token && user) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(JSON.parse(user))
  }
}, [])
```

## 7. Variação: com async/await na função do formulário

```typescript
// A keyword async é necessária na função para usar await
async function handleSubmit(event: React.FormEvent) {
  event.preventDefault()

  // await garante que a navegação só acontece após a resposta
  await api.post("/refunds", {
    name: "Visita ao cliente",
    category: "transporte",
    amount: 125.50,
    filename: "comprovante-viagem-2024.png",
  })

  navigate("/")
}
```

## 8. Instância do Axios (services/api.ts)

```typescript
// services/api.ts
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3333",
})

export { api }
```

## 9. Verificando o token no DevTools

```
// No Network tab do navegador, inspecione o header da requisição:
// Request Headers:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
//   Content-Type: application/json

// Se Authorization estiver ausente → token não foi configurado
// Se retornar 401 → token expirado ou inválido
```

## 10. Padrão completo: erro sem token vs. sucesso com token

```typescript
// ❌ SEM token configurado:
// POST /refunds → 401 { message: "Invalid JWT token" }
// O middleware ensureAuthenticated bloqueia antes de chegar ao controller

// ✅ COM token configurado via api.defaults:
// POST /refunds → 201 { id: "uuid", name: "Visita ao cliente", ... }
// Token é extraído do header → userId identificado → role verificada → controller executa
```