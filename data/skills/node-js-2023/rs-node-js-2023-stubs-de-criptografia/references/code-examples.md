# Code Examples: Stubs de Criptografia

## Exemplo completo do FakeHasher

```typescript
// test/cryptography/fake-hasher.ts
import { HashGenerator } from '@/domain/cryptography/hash-generator'
import { HashComparer } from '@/domain/cryptography/hash-comparer'

export class FakeHasher implements HashGenerator, HashComparer {
  // Implementa hash ficticio: concatena '-hashed' ao final
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  // Compara recriando o hash e verificando igualdade
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
```

### Como o FakeHasher e usado em testes

```typescript
// Exemplo de uso em teste de registro de usuario
const fakeHasher = new FakeHasher()

// Quando o use case chama hash('minha-senha')
const hashed = await fakeHasher.hash('minha-senha')
// hashed === 'minha-senha-hashed'

// Quando o use case verifica a senha
const isValid = await fakeHasher.compare('minha-senha', 'minha-senha-hashed')
// isValid === true

const isInvalid = await fakeHasher.compare('senha-errada', 'minha-senha-hashed')
// isInvalid === false
```

## Exemplo completo do FakeEncrypter

```typescript
// test/cryptography/fake-encrypter.ts
import { Encrypter } from '@/domain/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  // Transforma o payload em JSON string ao inves de gerar JWT real
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
```

### Como o FakeEncrypter e usado em testes

```typescript
// Exemplo de uso em teste de autenticacao
const fakeEncrypter = new FakeEncrypter()

const token = await fakeEncrypter.encrypt({ sub: 'user-id-123' })
// token === '{"sub":"user-id-123"}'

// No teste, voce pode verificar o conteudo do token:
const parsed = JSON.parse(token)
expect(parsed.sub).toBe('user-id-123')
```

## Contratos que os stubs implementam

```typescript
// src/domain/cryptography/hash-generator.ts
export abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>
}

// src/domain/cryptography/hash-comparer.ts
export abstract class HashComparer {
  abstract compare(plain: string, hash: string): Promise<boolean>
}

// src/domain/cryptography/encrypter.ts
export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
```

## Estrutura de arquivos

```
test/
├── cryptography/
│   ├── fake-hasher.ts        # Stub para hash + compare
│   └── fake-encrypter.ts     # Stub para token generation
├── repositories/
│   ├── in-memory-students-repository.ts
│   └── in-memory-questions-repository.ts
src/
├── domain/
│   └── cryptography/
│       ├── hash-generator.ts   # Contrato real
│       ├── hash-comparer.ts    # Contrato real
│       └── encrypter.ts        # Contrato real
└── infra/
    └── cryptography/
        ├── bcrypt-hasher.ts    # Implementacao real
        └── jwt-encrypter.ts    # Implementacao real
```