# Code Examples: Controller de Autenticação NestJS

## Exemplo completo do controller

```typescript
import { Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
```

## Testando a rota via HTTP client

```http
### Authenticate
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "diego4@skillz.com.br",
  "password": "123456"
}
```

### Resposta de sucesso (201):
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Resposta de erro (401):
```json
{
  "statusCode": 401,
  "message": "User credentials do not match.",
  "error": "Unauthorized"
}
```

## Decodificando o token no jwt.io

O payload do token gerado:
```json
{
  "sub": "clg1234567890",
  "iat": 1680000000
}
```

O `sub` contém o ID do usuário do banco de dados (Prisma gera IDs como cuid por padrão).

## Comparação: Controller de Criação vs Autenticação

### Criação de conta (referência)
```typescript
const authenticateBodySchema = z.object({
  name: z.string(),    // tem name
  email: z.string().email(),
  password: z.string(),
})
```

### Autenticação (esta aula)
```typescript
const authenticateBodySchema = z.object({
  email: z.string().email(),  // sem name
  password: z.string(),
})
```

A diferença principal: autenticação não recebe `name`, apenas `email` e `password`.

## Fluxo completo de autenticação

```typescript
// 1. Validação do body (automática via Zod pipe)
// Se email não for válido → 400 Bad Request

// 2. Busca usuário por email
const user = await this.prisma.user.findUnique({ where: { email } })
// Se não encontrar → 401 Unauthorized

// 3. Compara senha com hash
const isPasswordValid = await compare(password, user.password)
// Se não bater → 401 Unauthorized (mesma mensagem!)

// 4. Gera JWT com sub = user.id
const accessToken = this.jwt.sign({ sub: user.id })

// 5. Retorna token em snake_case
return { access_token: accessToken }
```

## Próximo passo: Guards

Após o controller de autenticação, o próximo conceito é NestJS Guards — mecanismo para proteger rotas que exigem autenticação. O token retornado aqui será enviado nas requisições subsequentes via header `Authorization: Bearer {token}`.