# Code Examples: Validação de Dados do Usuário com Zod

## Exemplo completo da aula

### Schema de validação

```typescript
import { z } from "zod"
import { UserRole } from "@prisma/client"

const bodySchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
  email: z.string().trim().email({ message: "E-mail inválido" }).toLowerCase(),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 dígitos" }),
  role: z.nativeEnum(UserRole).default(UserRole.EMPLOYEE),
})
```

### Controller usando o schema

```typescript
import { Request, Response } from "express"

class UsersController {
  async create(request: Request, response: Response) {
    const { name, email, password, role } = bodySchema.parse(request.body)

    return response.json({ name, email, password, role })
  }
}
```

### App com express-async-errors

```typescript
import "express-async-errors" // OBRIGATÓRIO: antes de tudo
import express from "express"
import { routes } from "./routes"
import { errorHandler } from "./middlewares/error-handler"

const app = express()

app.use(express.json())
app.use(routes)
app.use(errorHandler)

export { app }
```

## Testes realizados na aula

### Teste 1: Senha curta (3 caracteres)

**Request:**
```json
{
  "name": "Rodrigo Gonçalves",
  "email": "rodrigo@email.com",
  "password": "123"
}
```

**Response (erro):**
```json
{
  "issues": [
    {
      "code": "too_small",
      "minimum": 6,
      "message": "A senha deve ter pelo menos 6 dígitos",
      "path": ["password"]
    }
  ]
}
```

### Teste 2: Senha com 6 caracteres (válido)

**Request:**
```json
{
  "name": "Rodrigo Gonçalves",
  "email": "rodrigo@email.com",
  "password": "123456"
}
```

**Response (sucesso):**
```json
{
  "name": "Rodrigo Gonçalves",
  "email": "rodrigo@email.com",
  "password": "123456",
  "role": "EMPLOYEE"
}
```

### Teste 3: Nome vazio

**Request:**
```json
{
  "name": "",
  "email": "rodrigo@email.com",
  "password": "123456"
}
```

**Response:** Erro indicando que nome é obrigatório (min 2 caracteres).

### Teste 4: Email inválido

**Request:**
```json
{
  "name": "Rodrigo",
  "email": "apenas-um-nome",
  "password": "123456"
}
```

**Response:** Erro "E-mail inválido".

### Teste 5: Email como "100.com"

**Request:**
```json
{
  "name": "Rodrigo",
  "email": "100.com",
  "password": "123456"
}
```

**Response:** Erro "E-mail inválido" — falta o @ e domínio válido.

### Teste 6: Role como "MANAGER"

**Request:**
```json
{
  "name": "Rodrigo Gonçalves",
  "email": "rodrigo@email.com",
  "password": "123456",
  "role": "MANAGER"
}
```

**Response:**
```json
{
  "name": "Rodrigo Gonçalves",
  "email": "rodrigo@email.com",
  "password": "123456",
  "role": "MANAGER"
}
```

### Teste 7: Role inválida

**Request:**
```json
{
  "name": "Rodrigo Gonçalves",
  "email": "rodrigo@email.com",
  "password": "123456",
  "role": "ADMIN"
}
```

**Response:** Erro dizendo que o valor é inválido — aceita apenas EMPLOYEE ou MANAGER.

## Variações do padrão

### Schema para atualização parcial (PATCH)

```typescript
const updateBodySchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é obrigatório" }).optional(),
  email: z.string().trim().email({ message: "E-mail inválido" }).toLowerCase().optional(),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 dígitos" }).optional(),
})
```

### Schema com confirmação de senha

```typescript
const registerSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
  email: z.string().trim().email({ message: "E-mail inválido" }).toLowerCase(),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 dígitos" }),
  passwordConfirmation: z.string(),
}).refine(data => data.password === data.passwordConfirmation, {
  message: "As senhas não coincidem",
  path: ["passwordConfirmation"],
})
```

### Schema com validação de CPF (customizada)

```typescript
const userSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
  cpf: z.string()
    .regex(/^\d{11}$/, { message: "CPF deve ter 11 dígitos numéricos" }),
  email: z.string().trim().email({ message: "E-mail inválido" }).toLowerCase(),
})
```

### Usando safeParse para controle manual de erros

```typescript
async create(request: Request, response: Response) {
  const result = bodySchema.safeParse(request.body)

  if (!result.success) {
    return response.status(400).json({
      message: "Dados inválidos",
      errors: result.error.flatten().fieldErrors,
    })
  }

  const { name, email, password, role } = result.data
  return response.json({ name, email, password, role })
}
```

### Schema com enum manual (sem Prisma)

```typescript
const roleEnum = z.enum(["EMPLOYEE", "MANAGER"], {
  errorMap: () => ({ message: "Role deve ser EMPLOYEE ou MANAGER" }),
}).default("EMPLOYEE")

const bodySchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
  email: z.string().trim().email({ message: "E-mail inválido" }).toLowerCase(),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 dígitos" }),
  role: roleEnum,
})
```