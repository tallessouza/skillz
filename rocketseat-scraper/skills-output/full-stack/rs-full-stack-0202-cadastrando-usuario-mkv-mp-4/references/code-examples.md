# Code Examples: Cadastrando Usuário — Integração Frontend com API

## Exemplo 1: Instância do Axios (pré-requisito)

```typescript
// src/service/api.ts
import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3333",
})
```

A baseURL é definida aqui. Todas as chamadas usam paths relativos.

## Exemplo 2: Handler completo de cadastro

```typescript
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { api } from "../service/api"

// Dentro do componente de SignUp:
const navigate = useNavigate()

async function handleSignUp(data: SignUpFormData) {
  try {
    // POST /users com os dados do formulário
    await api.post("/users", data)

    // Feedback + navegação condicional
    if (confirm("Cadastrado com sucesso! Ir para a tela de entrar?")) {
      navigate("/")
    }
  } catch (error) {
    // Erro da API (4xx, 5xx)
    if (error instanceof AxiosError) {
      alert(error.response?.data.message)
    } else {
      // Erro inesperado
      console.log(error)
    }
  }
}
```

## Exemplo 3: Correspondência Frontend → API

### Frontend (chamada):
```typescript
await api.post("/users", {
  name: "Rodrigo",
  email: "rodrigo@email.com",
  password: "123456",
})
```

### API (rotas):
```typescript
// src/routes/index.ts
import { usersRoutes } from "./users-routes"

app.use("/users", usersRoutes)

// src/routes/users-routes.ts
router.post("/", UsersController.create)
```

### API (controller):
```typescript
// src/controllers/UsersController.ts
async create(request, response) {
  const { name, email, password } = request.body

  // Valida dados...
  // Verifica se email já existe...
  // Cria usuário no banco...

  return response.status(201).json()
}
```

### API (tratamento de erro):
```typescript
// src/utils/AppError.ts
class AppError {
  message: string
  statusCode: number

  constructor(message: string, statusCode = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}

// No controller:
throw new AppError("Este e-mail já está em uso.")
// → Axios recebe em: error.response.data.message
```

## Exemplo 4: Variação — sem confirm, com toast

```typescript
import { toast } from "react-toastify"

async function handleSignUp(data: SignUpFormData) {
  try {
    await api.post("/users", data)
    toast.success("Cadastrado com sucesso!")
    navigate("/")
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message)
    } else {
      toast.error("Erro inesperado. Tente novamente.")
    }
  }
}
```

## Exemplo 5: Variação — com loading state

```typescript
const [isLoading, setIsLoading] = useState(false)

async function handleSignUp(data: SignUpFormData) {
  try {
    setIsLoading(true)
    await api.post("/users", data)

    if (confirm("Cadastrado com sucesso! Ir para a tela de entrar?")) {
      navigate("/")
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data.message)
    } else {
      console.log(error)
    }
  } finally {
    setIsLoading(false)
  }
}

// No JSX:
<button disabled={isLoading}>
  {isLoading ? "Cadastrando..." : "Cadastrar"}
</button>
```

## Exemplo 6: Enviando campos individuais vs objeto completo

```typescript
// ❌ Redundante — desestrutura para reestruturar
await api.post("/users", {
  name: data.name,
  email: data.email,
  password: data.password,
})

// ✅ Direto — o objeto já tem a forma correta
await api.post("/users", data)
```

## Exemplo 7: Por que optional chaining no response

```typescript
// Erro de rede (servidor offline) → response é undefined
catch (error) {
  if (error instanceof AxiosError) {
    // error.response é undefined quando o servidor não respondeu
    // error.response?.data.message retorna undefined sem quebrar
    console.log(error.response?.data.message)
    // Sem optional chaining → TypeError: Cannot read properties of undefined
  }
}
```