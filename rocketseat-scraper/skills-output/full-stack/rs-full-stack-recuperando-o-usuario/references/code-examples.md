# Code Examples: Recuperando o Usuário na Autenticação

## Exemplo completo do SessionsController

```typescript
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { compare } from "bcrypt"

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

class SessionsController {
  async create(request, response) {
    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      throw new AppError("E-mail ou senha inválidos", 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError("E-mail ou senha inválidos", 401)
    }

    // Próximo passo: gerar JWT token
    return response.json({ user })
  }
}

module.exports = SessionsController
```

## Testes no Insomnia — cenários demonstrados

### Cenário 1: Sem body (falha na validação Zod)

```http
POST /sessions
Content-Type: application/json

{}
```

Resposta: Erro de validação do Zod — campos obrigatórios faltando.

### Cenário 2: E-mail sem formato válido

```json
{
  "email": "rodrigo123.com",
  "password": "123456"
}
```

Resposta: Erro de validação — "Invalid email".

### Cenário 3: Senha com menos de 6 caracteres

```json
{
  "email": "rodrigo@email.com",
  "password": "12345"
}
```

Resposta: Erro de validação — string min 6.

### Cenário 4: E-mail inexistente no banco

```json
{
  "email": "naoexiste@email.com",
  "password": "123456"
}
```

Resposta:
```json
{
  "message": "E-mail ou senha inválidos"
}
```
Status: 401

### Cenário 5: E-mail correto, senha errada

```json
{
  "email": "rodrigo@email.com",
  "password": "senhaerrada"
}
```

Resposta:
```json
{
  "message": "E-mail ou senha inválidos"
}
```
Status: 401

### Cenário 6: E-mail e senha corretos

```json
{
  "email": "rodrigo@email.com",
  "password": "123456"
}
```

Resposta: Autenticação bem-sucedida (200).

## Variação: com TypeScript tipado

```typescript
import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { compare } from "bcrypt"

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

class SessionsController {
  async create(request: Request, response: Response) {
    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      throw new AppError("E-mail ou senha inválidos", 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError("E-mail ou senha inválidos", 401)
    }

    return response.json({ user })
  }
}

export { SessionsController }
```

## Variação: extraindo a lógica para um use case

```typescript
// authenticate-user.usecase.ts
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { compare } from "bcrypt"

interface AuthenticateUserInput {
  email: string
  password: string
}

export async function authenticateUser({ email, password }: AuthenticateUserInput) {
  const user = await prisma.user.findFirst({
    where: { email },
  })

  if (!user) {
    throw new AppError("E-mail ou senha inválidos", 401)
  }

  const passwordMatched = await compare(password, user.password)

  if (!passwordMatched) {
    throw new AppError("E-mail ou senha inválidos", 401)
  }

  return { user }
}
```

```typescript
// sessions.controller.ts
import { z } from "zod"
import { authenticateUser } from "@/usecases/authenticate-user.usecase"

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

class SessionsController {
  async create(request, response) {
    const { email, password } = bodySchema.parse(request.body)
    const { user } = await authenticateUser({ email, password })
    return response.json({ user })
  }
}
```

## Padrão de importações na ordem utilizada na aula

```typescript
// 1. Validação
import { z } from "zod"

// 2. Database
import { prisma } from "@/database/prisma"

// 3. Utilitários de erro
import { AppError } from "@/utils/AppError"

// 4. Criptografia
import { compare } from "bcrypt"
```

## Naming patterns utilizados

| Variável | Por quê |
|----------|---------|
| `bodySchema` | Descreve que valida o body da request |
| `passwordMatched` | Boolean que descreve se a senha bateu (causa, não efeito) |
| `user` | Resultado da busca — descreve o conteúdo, não a operação |