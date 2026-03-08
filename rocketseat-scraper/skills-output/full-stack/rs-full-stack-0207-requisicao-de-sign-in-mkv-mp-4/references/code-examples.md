# Code Examples: Requisição de SignIn

## Exemplo 1: Implementação completa do handleSignIn

Código demonstrado na aula, integrado com validação do formulário:

```typescript
import { api } from "../service/api"
import { AxiosError } from "axios"

interface SignInFormData {
  email: string
  password: string
}

async function handleSignIn(data: SignInFormData) {
  try {
    const response = await api.post("/sessions", data)
    console.log(response.data)
    // { token: "...", user: { id, name, email, role, created_at } }
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data?.message)
    }
  }
}
```

## Exemplo 2: Contexto do backend (SessionsController)

O instrutor mostrou o fluxo no backend para explicar o que a API retorna:

```javascript
// Backend: SessionsController.create
class SessionsController {
  async create(request, response) {
    const { email, password } = request.body

    // Validações...
    // 1. Usuário existe?
    // 2. Senha confere?

    // Retorno: token + user sem senha
    return response.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
        // password NÃO é incluído
      }
    })
  }
}
```

## Exemplo 3: Fluxo de rotas no backend

```javascript
// Backend: routes/index.js
router.post("/sessions", sessionsRouter)

// Backend: routes/sessions.routes.js
sessionsRouter.post("/", sessionsController.create)
```

## Exemplo 4: Desestruturando a resposta

```typescript
async function handleSignIn(data: SignInFormData) {
  try {
    const response = await api.post("/sessions", data)
    const { token, user } = response.data

    // Usar token para autenticação futura
    // Usar user para exibir dados na interface
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data?.message)
    }
  }
}
```

## Exemplo 5: Diferença entre erros

```typescript
catch (error) {
  // Erro da API (ex: 401 Unauthorized)
  if (error instanceof AxiosError) {
    // error.response existe → API respondeu com erro
    // error.response.data.message → "E-mail ou senha inválida"
    alert(error.response?.data?.message)
  }

  // Erro genérico (ex: rede, código local)
  // Não tem .response, não é AxiosError
  // O optional chaining (?.) previne crash nesses casos
}
```

## Exemplo 6: Cenários de teste mostrados na aula

```typescript
// Cenário 1: Credenciais inválidas
// Input: { email: "rodrigox@email.com", password: "qualquer" }
// API retorna: 401 { message: "E-mail ou senha inválida" }
// alert() mostra: "E-mail ou senha inválida"

// Cenário 2: Credenciais válidas
// Input: { email: "rodrigo@email.com", password: "senhaCorreta" }
// API retorna: 200 { token: "jwt...", user: { id, name, email, role: "employee", created_at } }
// console.log mostra os dados completos
```

## Exemplo 7: Integração com o formulário (contexto completo)

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "../service/api"
import { AxiosError } from "axios"

const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

type SignInFormData = z.infer<typeof signInSchema>

function SignIn() {
  const { register, handleSubmit } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  async function handleSignIn(data: SignInFormData) {
    try {
      const response = await api.post("/sessions", data)
      const { token, user } = response.data
      // Próximo passo: salvar token e redirecionar
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSignIn)}>
      <input type="email" {...register("email")} />
      <input type="password" {...register("password")} />
      <button type="submit">Entrar</button>
    </form>
  )
}
```