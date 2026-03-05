# Code Examples: Configurando Autenticacao JWT no NestJS

## Exemplo 1: AuthModule basico (passo a passo)

### Passo 1 — Criar o modulo vazio

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common'

@Module({})
export class AuthModule {}
```

### Passo 2 — Importar no AppModule

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot(/* ... */),
    AuthModule,
  ],
})
export class AppModule {}
```

### Passo 3 — Adicionar PassportModule e JwtModule

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'temporario', // vai mudar no proximo passo
    }),
  ],
})
export class AuthModule {}
```

### Passo 4 — Migrar para registerAsync com ConfigService

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { Env } from '@/env'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<Env, true>) {
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
})
export class AuthModule {}
```

## Exemplo 2: Instalacao dos pacotes

```bash
# Instalar Passport e JWT para NestJS
npm install @nestjs/passport @nestjs/jwt passport passport-jwt
npm install -D @types/passport-jwt
```

## Exemplo 3: Configuracao do .env

```env
# Gerar par de chaves RS256:
# openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
# openssl rsa -pubout -in private.pem -out public.pem
# base64 -w 0 private.pem > private_base64.txt
# base64 -w 0 public.pem > public_base64.txt

JWT_PRIVATE_KEY=LS0tLS1CRUdJTi...base64_da_chave_privada
JWT_PUBLIC_KEY=LS0tLS1CRUdJTi...base64_da_chave_publica
```

## Exemplo 4: Validacao no schema Env (com Zod)

```typescript
// src/env.ts
import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
```

## Exemplo 5: Comparacao HS256 vs RS256

### HS256 (simetrico — mesmo secret cria e valida)

```typescript
JwtModule.register({
  secret: 'uma-string-qualquer-que-voce-bate-no-teclado',
  signOptions: { algorithm: 'HS256', expiresIn: '1d' },
})

// Problema: qualquer servico com esse secret pode criar tokens
```

### RS256 (assimetrico — chave privada cria, publica valida)

```typescript
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory(config: ConfigService<Env, true>) {
    return {
      signOptions: { algorithm: 'RS256' },
      privateKey: Buffer.from(
        config.get('JWT_PRIVATE_KEY', { infer: true }),
        'base64',
      ),
      publicKey: Buffer.from(
        config.get('JWT_PUBLIC_KEY', { infer: true }),
        'base64',
      ),
    }
  },
})

// Servico de notificacoes recebe SOMENTE a publicKey
// Consegue validar tokens, mas NAO criar novos
```

## Exemplo 6: Debug — verificando se ConfigService funciona no registerAsync

```typescript
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory(config: ConfigService<Env, true>) {
    const secret = config.get('JWT_PRIVATE_KEY', { infer: true })
    console.log(secret) // deve mostrar o valor do .env

    return {
      signOptions: { algorithm: 'RS256' },
      privateKey: Buffer.from(secret, 'base64'),
      publicKey: Buffer.from(
        config.get('JWT_PUBLIC_KEY', { infer: true }),
        'base64',
      ),
    }
  },
})
```