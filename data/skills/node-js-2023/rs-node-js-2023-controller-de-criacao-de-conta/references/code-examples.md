# Code Examples: Controller por Rota no NestJS

## Exemplo completo da aula

### 1. Estrutura de pastas

```
src/
├── controllers/
│   └── create-account.controller.ts
├── prisma/
│   └── prisma.service.ts
└── app.module.ts
```

### 2. Controller create-account.controller.ts

```typescript
import {
  Body,
  Controller,
  ConflictException,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same email address already exists.',
      )
    }

    await this.prisma.user.create({
      data: { name, email, password },
    })
  }
}
```

### 3. AppModule registrando o controller

```typescript
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'

@Module({
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
```

### 4. tsconfig.json — strict habilitado

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true
  }
}
```

## Testando a rota

### Com HTTPie (usado na aula)

```bash
# Primeira criacao — retorna 201
http POST localhost:3333/accounts name=Diego email=diego@skillz.com.br password=123456

# Segunda chamada com mesmo email — retorna 409
http POST localhost:3333/accounts name=Diego email=diego@skillz.com.br password=123456
# { "statusCode": 409, "message": "User with same email address already exists." }
```

### Com curl

```bash
curl -X POST http://localhost:3333/accounts \
  -H "Content-Type: application/json" \
  -d '{"name": "Diego", "email": "diego@skillz.com.br", "password": "123456"}'
```

## Variacoes do padrao

### Prefixo no metodo ao inves do controller

```typescript
// Tambem funciona, mas Diego prefere no @Controller
@Controller()
export class CreateAccountController {
  @Post('/accounts')
  async handle(@Body() body: any) { /* ... */ }
}
```

### Desabilitando logs do NestJS

```typescript
// main.ts — quando houver muitos controllers
const app = await NestFactory.create(AppModule, { logger: false })
```

### Exceptions disponiveis no NestJS

```typescript
// Todas mapeiam para status codes HTTP
throw new ConflictException('message')        // 409
throw new NotFoundException('message')        // 404
throw new BadRequestException('message')      // 400
throw new ForbiddenException('message')       // 403
throw new UnauthorizedException('message')    // 401
throw new MethodNotAllowedException('message') // 405
throw new NotAcceptableException('message')   // 406
throw new BadGatewayException('message')      // 502
throw new HttpException('message', statusCode) // generico
```

### Extraindo body com tipagem (melhoria futura)

```typescript
// Na aula, body e tipado como `any` — depois sera substituido por DTO/Zod
async handle(@Body() body: any) {
  const { name, email, password } = body
}

// Versao futura com DTO
async handle(@Body() body: CreateAccountDto) {
  // tipagem segura
}
```