# Code Examples: Criando EnvModule

## Exemplo completo: env.ts (schema de validacao)

```typescript
// src/infra/env/env.ts
import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
```

## Exemplo completo: env.service.ts

```typescript
// src/infra/env/env.service.ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T): Env[T] {
    return this.configService.get(key, { infer: true })
  }
}
```

### Por que `ConfigService<Env, true>`?

- Primeiro generic `Env`: indica o shape das variaveis
- Segundo generic `true`: indica que validacao foi feita (todas as chaves existem), removendo `undefined` dos retornos

## Exemplo completo: env.module.ts

```typescript
// src/infra/env/env.module.ts
import { Module } from '@nestjs/common'
import { EnvService } from './env.service'

@Module({
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
```

## Consumo no main.ts

### Antes
```typescript
import { ConfigService } from '@nestjs/config'
import { Env } from './infra/env/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })
  await app.listen(port)
}
```

### Depois
```typescript
import { EnvService } from './infra/env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const envService = app.get(EnvService)
  const port = envService.get('PORT')
  await app.listen(port)
}
```

## Consumo no AuthModule (useFactory)

### Antes
```typescript
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
})
```

### Depois
```typescript
JwtModule.registerAsync({
  imports: [EnvModule],  // CRITICAL: sem isso, EnvService nao e visivel
  inject: [EnvService],
  useFactory(env: EnvService) {
    const privateKey = env.get('JWT_PRIVATE_KEY')
    const publicKey = env.get('JWT_PUBLIC_KEY')
    return {
      signOptions: { algorithm: 'RS256' },
      privateKey: Buffer.from(privateKey, 'base64'),
      publicKey: Buffer.from(publicKey, 'base64'),
    }
  },
})
```

## Consumo no JwtStrategy

### Antes
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }
}
```

### Depois
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKey = env.get('JWT_PUBLIC_KEY')
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }
}
```

## AppModule final

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,  // Importa para disponibilizar no contexto do App
    AuthModule,
    // ... outros modulos
  ],
})
export class AppModule {}
```

## Evolucao do generic: por que a primeira tentativa falhou

```typescript
// Tentativa 1 — retorna string | number (uniao de todos os tipos)
get(key: keyof Env) {
  return this.configService.get(key, { infer: true })
}

// Tentativa 2 — retorna o tipo exato da chave passada
get<T extends keyof Env>(key: T): Env[T] {
  return this.configService.get(key, { infer: true })
}
```

Na tentativa 1, `keyof Env` resolve para `'DATABASE_URL' | 'JWT_PRIVATE_KEY' | 'PORT' | ...`, e o TypeScript nao sabe qual foi passada — retorna a uniao dos tipos de todas as chaves.

Na tentativa 2, `T` captura o **literal especifico** passado como argumento. `get('PORT')` faz `T = 'PORT'`, e `Env['PORT']` = `number`.