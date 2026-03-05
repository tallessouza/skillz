# Code Examples: Gerando Token JWT com RS256

## 1. Comandos OpenSSL completos

```bash
# Gerar chave privada RSA 2048 bits
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# Gerar chave publica a partir da privada
openssl rsa -pubout -in private_key.pem -out public_key.pem

# Converter para base64 (Mac/Linux)
base64 -i private_key.pem -o private_key-base64.txt
base64 -i public_key.pem -o public_key-base64.txt
```

## 2. Arquivo .env

```env
JWT_PRIVATE_KEY=conteudo_base64_da_chave_privada_sem_quebras
JWT_PUBLIC_KEY=conteudo_base64_da_chave_publica_sem_quebras
```

## 3. Validacao de env com Zod (env.ts)

```typescript
import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
```

## 4. AuthModule com JwtModule configurado

```typescript
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthenticateController } from './authenticate.controller'
import { Env } from '../env'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env>) {
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  controllers: [AuthenticateController],
})
export class AuthModule {}
```

## 5. AuthenticateController (esqueleto da aula)

```typescript
import { Body, Controller, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  async handle() {
    // Na aula, o instrutor usa um user id ficticio para testar
    const token = this.jwt.sign({ sub: 'user-id' })

    return { access_token: token }
  }
}
```

## 6. AppModule registrando o controller

```typescript
@Module({
  imports: [ConfigModule.forRoot(/*...*/), AuthModule],
  controllers: [CreateAccountController, AuthenticateController],
})
export class AppModule {}
```

O instrutor destaca que esqueceu de adicionar o `AuthenticateController` no AppModule inicialmente, o que causou um 404. Esse e um erro comum — todo controller precisa estar declarado no array `controllers` de algum module.

## 7. Testando com HTTP client

```http
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "johndoe@example.com",
  "password": "123456"
}
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 8. Validacao no jwt.io

1. Acesse jwt.io
2. Selecione algoritmo **RS256**
3. Cole o token no campo "Encoded"
4. No campo "VERIFY SIGNATURE", cole o conteudo de `public_key.pem`
5. A assinatura deve aparecer como "Signature Verified"
6. O payload mostra: `{ "sub": "user-id" }`