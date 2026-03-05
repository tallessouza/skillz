# Code Examples: Implementacao da Criptografia

## Estrutura de pastas

```
src/
├── domain/forum/application/cryptography/
│   ├── encryptor.ts          # classe abstrata
│   ├── hash-generator.ts     # classe abstrata
│   └── hash-comparer.ts      # classe abstrata
└── infra/cryptography/
    ├── cryptography.module.ts
    ├── jwt-encryptor.ts
    └── bcrypt-hasher.ts
```

## JwtEncryptor completo

```typescript
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Encryptor } from '@/domain/forum/application/cryptography/encryptor'

@Injectable()
export class JwtEncryptor implements Encryptor {
  constructor(private jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload)
  }
}
```

**Pontos-chave:**
- `@Injectable()` para participar do DI do NestJS
- Dependencia em `JwtService` via construtor
- `signAsync` em vez de `sign` porque o contrato retorna `Promise<string>`
- Sem `async` porque nao usa `await`

## BcryptHasher completo

```typescript
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
```

**Pontos-chave:**
- Implementa duas interfaces simultaneamente
- `bcryptjs` (versao JS pura, sem dependencia nativa)
- Salt length extraido como propriedade privada
- Ordem dos parametros em `compare`: `plain` primeiro, `hash` segundo

## CryptographyModule completo

```typescript
import { Module } from '@nestjs/common'
import { Encryptor } from '@/domain/forum/application/cryptography/encryptor'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { JwtEncryptor } from './jwt-encryptor'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    { provide: Encryptor, useClass: JwtEncryptor },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encryptor, HashComparer, HashGenerator],
})
export class CryptographyModule {}
```

## Comparacao: DatabaseModule (mesmo padrao)

```typescript
// O instrutor referencia este padrao como identico
@Module({
  providers: [
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
    // futuramente mais repositorios aqui
  ],
  exports: [QuestionsRepository],
})
export class DatabaseModule {}
```

## Antes da refatoracao (controller acoplado)

```typescript
// AuthenticateController ANTES — usando JwtService diretamente
@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  async handle(@Body() body) {
    // logica de autenticacao misturada no controller
    const accessToken = await this.jwt.signAsync({ sub: user.id })
    return { access_token: accessToken }
  }
}
```

## Depois da refatoracao (controller usa use case)

```typescript
// AuthenticateController DEPOIS — delegando para use case
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private authenticateStudent: AuthenticateStudentUseCase,
  ) {}

  @Post()
  async handle(@Body() body) {
    const result = await this.authenticateStudent.execute({
      email: body.email,
      password: body.password,
    })
    // use case internamente usa Encryptor e HashComparer
  }
}
```