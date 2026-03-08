---
name: rs-node-js-2023-gerando-token-jwt
description: "Applies RSA256 JWT token generation pattern when building authentication in NestJS applications. Use when user asks to 'implement JWT auth', 'generate token', 'setup authentication', 'configure JWT module', or 'create login endpoint' in NestJS. Enforces RS256 with PEM key pairs stored as base64 in env vars, Buffer.from decode, and JwtService injection. Make sure to use this skill whenever implementing JWT authentication in NestJS projects. Not for session-based auth, OAuth flows, or frontend token handling."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: jwt-rs256
  tags: [jwt, rs256, authentication, nestjs, openssl, pem, security]
---

# Gerando Token JWT com RS256 no NestJS

> Usar sempre RS256 com par de chaves PEM (privada + publica) armazenadas como base64 nas variaveis de ambiente, decodificadas com Buffer.from na configuracao do JwtModule.

## Rules

1. **Gere chaves RSA via OpenSSL** — nunca use chaves inventadas ou HS256 para producao, porque RS256 permite validar tokens apenas com a chave publica (sem expor a privada)
2. **Armazene chaves como base64 no .env** — porque chaves PEM tem quebras de linha que quebram variaveis de ambiente
3. **Decodifique com Buffer.from(key, 'base64')** — nunca passe a string base64 diretamente ao JwtModule, porque ele espera o conteudo PEM original
4. **Use JwtService do @nestjs/jwt** — injete via constructor e chame `this.jwt.sign(payload)`, porque centraliza a configuracao de algoritmo e chaves
5. **Registre o JwtModule com isGlobal: true** — porque o servico JWT sera usado em multiplos controllers (authenticate, refresh, etc)
6. **Nunca commite arquivos .pem no repositorio** — adicione ao .gitignore imediatamente apos gerar

## How to write

### Gerar chaves RSA e converter para base64

```bash
# 1. Gerar chave privada
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# 2. Gerar chave publica a partir da privada
openssl rsa -pubout -in private_key.pem -out public_key.pem

# 3. Converter para base64 (Mac/Linux)
base64 -i private_key.pem -o private_key-base64.txt
base64 -i public_key.pem -o public_key-base64.txt

# 4. Copiar conteudo base64 para .env e deletar arquivos
```

### Configurar .env

```env
JWT_PRIVATE_KEY=MIIEvgIBADANBgkqhki...base64_sem_quebras_de_linha
JWT_PUBLIC_KEY=MIIBIjANBgkqhki...base64_sem_quebras_de_linha
```

### Configurar JwtModule no AuthModule

```typescript
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

### Gerar token no controller

```typescript
@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  async handle(@Body() body: AuthenticateBodyDto) {
    // ...validar credenciais...

    const token = this.jwt.sign({ sub: user.id })

    return { access_token: token }
  }
}
```

## Example

**Before (HS256 com secret simples — inseguro para producao):**
```typescript
JwtModule.register({
  secret: 'minha-senha-secreta',
  signOptions: { expiresIn: '1d' },
})
```

**After (RS256 com par de chaves — seguro):**
```typescript
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
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto NestJS com auth | Gere chaves RSA antes de qualquer codigo |
| Precisa validar token em outro servico | Compartilhe apenas a chave publica |
| CI/CD precisa das chaves | Use secrets do pipeline, nunca hardcode |
| Validar token manualmente | Cole no jwt.io com RS256, cole chaves PEM para verificar assinatura |
| Env validation com Zod | Adicione JWT_PRIVATE_KEY e JWT_PUBLIC_KEY no schema |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `secret: 'string-qualquer'` com RS256 | `privateKey: Buffer.from(key, 'base64')` |
| Passar string base64 direto como privateKey | `Buffer.from(privateKey, 'base64')` para decodificar |
| Commitar arquivos .pem | Armazenar como base64 no .env e .gitignore os .pem |
| Usar HS256 em producao | RS256 com par de chaves assimetricas |
| Registrar JwtModule sem `global: true` | `global: true` para reutilizar em multiplos controllers |
| Gerar chaves via ferramentas online em producao | OpenSSL local para chaves de producao |

## Troubleshooting

### JwtModule falha com erro de chave invalida
**Symptom:** Erro secretOrPrivateKey must be an asymmetric key ao tentar gerar token
**Cause:** A string base64 da chave PEM foi passada diretamente sem decodificar com Buffer.from
**Fix:** Decodifique com Buffer.from(privateKey, 'base64') antes de passar ao JwtModule

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
