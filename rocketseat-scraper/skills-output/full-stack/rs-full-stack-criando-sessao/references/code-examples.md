# Code Examples: Criando Sessão com JWT

## Exemplo 1: Controller completo da aula (com fakeUser)

```typescript
import { sign } from "jsonwebtoken"
import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"

class SessionsController {
  async create(request, response) {
    const { username, password } = request.body

    // Simulando busca no banco de dados
    const fakeUser = {
      id: 1,
      username: "Rodrigo",
      password: "123456",
    }

    // Verificação: se username OU password não batem, barra
    if (username !== fakeUser.username || password !== fakeUser.password) {
      throw new AppError("Usuário e/ou senha incorreta", 401)
    }

    // Gera o token JWT
    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: String(fakeUser.id),
      expiresIn,
    })

    return response.json({ token })
  }
}

export { SessionsController }
```

## Exemplo 2: Versão produção com banco de dados

```typescript
import { sign } from "jsonwebtoken"
import { compare } from "bcryptjs"
import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body

    const user = await usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError("Usuário e/ou senha incorreta", 401)
    }

    const passwordMatches = await compare(password, user.password)

    if (!passwordMatches) {
      throw new AppError("Usuário e/ou senha incorreta", 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    return response.json({ token })
  }
}
```

## Exemplo 3: authConfig referenciado

```typescript
// src/configs/auth.ts
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "default-dev-secret",
    expiresIn: "1d",
  },
}
```

## Exemplo 4: Rota de sessão

```typescript
import { Router } from "express"
import { SessionsController } from "@/controllers/SessionsController"

const sessionsRoutes = Router()
const sessionsController = new SessionsController()

sessionsRoutes.post("/", sessionsController.create)

export { sessionsRoutes }
```

## Exemplo 5: Testes no Insomnia/HTTP client

```http
### Login com credenciais corretas
POST http://localhost:3000/sessions
Content-Type: application/json

{
  "username": "Rodrigo",
  "password": "123456"
}

# Response 200:
# { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }

### Login com senha errada
POST http://localhost:3000/sessions
Content-Type: application/json

{
  "username": "Rodrigo",
  "password": "123"
}

# Response 401:
# { "message": "Usuário e/ou senha incorreta" }

### Login com username errado
POST http://localhost:3000/sessions
Content-Type: application/json

{
  "username": "RodrigoX",
  "password": "123456"
}

# Response 401:
# { "message": "Usuário e/ou senha incorreta" }
```

## Variação: Login por email em vez de username

```typescript
// Mesma lógica, apenas muda o campo
const { email, password } = request.body
const user = await usersRepository.findByEmail(email)

if (!user || user.password !== password) {
  throw new AppError("Usuário e/ou senha incorreta", 401)
}
```

## Variação: Adicionando role no payload

```typescript
// Quando precisar de claims adicionais no token
const token = sign(
  { role: user.role },  // payload com claims extras
  secret,
  {
    subject: String(user.id),
    expiresIn,
  }
)
```