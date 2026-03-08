# Code Examples: Validando Dados da Session com Zod

## Exemplo completo: Session Controller com validação Zod

```typescript
import { z } from "zod"
import { Request, Response } from "express"

class SessionController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email("E-mail inválido"),
      password: z.string(),
    })

    const { email, password } = bodySchema.parse(request.body)

    // Agora email e password são strings validadas
    // Próximo passo: buscar usuário no banco e comparar senha
    return response.json({ email, password })
  }
}

export { SessionController }
```

## Comparação: Schema de cadastro vs Schema de login

### Cadastro (User Controller)
```typescript
const bodySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})
```

### Login (Session Controller)
```typescript
const bodySchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string(), // Sem .min() — banco valida
})
```

## Variação: Com mensagens customizadas para todos os campos

```typescript
const bodySchema = z.object({
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .email("E-mail inválido"),
  password: z
    .string({ required_error: "Senha é obrigatória" }),
})
```

## Variação: Extraindo o schema para reutilização

```typescript
// schemas/session.ts
import { z } from "zod"

export const sessionBodySchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string(),
})

export type SessionBody = z.infer<typeof sessionBodySchema>
```

```typescript
// controllers/SessionController.ts
import { sessionBodySchema } from "../schemas/session"

class SessionController {
  async create(request: Request, response: Response) {
    const { email, password } = sessionBodySchema.parse(request.body)
    // ...
  }
}
```

## Testando manualmente (Insomnia/Thunder Client)

### Request sem body → erro de validação
```
POST /sessions
Content-Type: application/json

{}
// Response 400:
// { issues: [{ path: ["email"], message: "Required" }, { path: ["password"], message: "Required" }] }
```

### Request com email inválido → erro específico
```
POST /sessions
Content-Type: application/json

{
  "email": "emailaleatorio",
  "password": "123456"
}
// Response 400:
// { issues: [{ path: ["email"], message: "E-mail inválido" }] }
```

### Request válida → passa na validação
```
POST /sessions
Content-Type: application/json

{
  "email": "rodrigo@email.com",
  "password": "123456"
}
// Response 200: OK
```