---
name: rs-node-js-2023-criptografia
description: "Applies NestJS provider pattern for cryptography implementations (bcrypt, JWT) using abstract class binding with provide/useClass. Use when user asks to 'implement encryption', 'add bcrypt', 'create JWT service', 'implement hasher', 'bind interface to implementation in NestJS', or 'create cryptography module'. Make sure to use this skill whenever implementing authentication crypto or abstract-to-concrete bindings in NestJS. Not for generic encryption theory, frontend auth, or non-NestJS dependency injection."
---

# Implementacao da Criptografia no NestJS

> Implemente criptografia criando classes concretas (BcryptHasher, JwtEncryptor) que implementam interfaces do dominio, e registre-as no modulo NestJS usando provide/useClass.

## Rules

1. **Separe em modulo dedicado** — crie `CryptographyModule` isolado, porque mantem responsabilidades organizadas e facilita imports seletivos
2. **Classe concreta implementa interface do dominio** — `BcryptHasher implements HashGenerator, HashComparer`, porque o dominio nao conhece detalhes de infra
3. **Use provide/useClass para binding** — `{ provide: Encryptor, useClass: JwtEncryptor }`, porque permite trocar implementacao sem alterar consumidores
4. **Exporte as classes abstratas, nao as concretas** — `exports: [Encryptor, HashComparer, HashGenerator]`, porque outros modulos dependem do contrato, nao da implementacao
5. **Injete dependencias do framework via construtor** — `constructor(private jwtService: JwtService)`, porque classes de infra podem depender de outros modulos NestJS
6. **Extraia configuracoes como propriedades** — `private SALT_LENGTH = 8` em vez de magic number, porque facilita ajustes futuros

## How to write

### Encryptor com JWT

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

### Hasher com Bcrypt

```typescript
import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcryptjs'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'

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

### Modulo de Criptografia

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

## Example

**Before (crypto acoplado no controller):**
```typescript
@Controller()
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  async handle() {
    const token = await this.jwt.signAsync({ sub: user.id })
    // bcrypt direto no controller
    const isValid = await compare(password, user.password)
  }
}
```

**After (com CryptographyModule):**
```typescript
@Controller()
export class AuthenticateController {
  constructor(
    private authenticateStudent: AuthenticateStudentUseCase,
  ) {}

  async handle() {
    // use case usa Encryptor e HashComparer internamente
    const result = await this.authenticateStudent.execute({ email, password })
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Uma classe concreta implementa 2+ interfaces | Registre multiplos providers com `useClass` apontando para a mesma classe |
| Classe de infra precisa de outro modulo NestJS | Injete via construtor (ex: `JwtService`) |
| Funcao retorna Promise sem usar await | Remova `async`, retorne a Promise diretamente |
| Magic number em algoritmo crypto | Extraia como propriedade privada com nome descritivo |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `import { hash } from 'bcryptjs'` direto no use case | Injete `HashGenerator` no use case, implemente com bcrypt na infra |
| `exports: [JwtEncryptor, BcryptHasher]` | `exports: [Encryptor, HashComparer, HashGenerator]` |
| `hash(plain, 8)` com magic number | `hash(plain, this.HASH_SALT_LENGTH)` |
| `async encrypt() { return this.jwt.signAsync() }` | `encrypt() { return this.jwt.signAsync() }` — sem async desnecessario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
