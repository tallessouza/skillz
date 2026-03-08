---
name: rs-node-js-2023-stubs-de-criptografia
description: "Applies stub patterns for cryptography contracts when writing unit tests in NestJS or Node.js. Use when user asks to 'create test doubles', 'mock crypto', 'fake hasher', 'stub encryption', 'write unit tests for auth', or 'test password hashing'. Ensures stubs implement real interfaces with fictitious but verifiable logic. Make sure to use this skill whenever creating test infrastructure for hashing, encryption, or JWT token generation. Not for production cryptography implementation, bcrypt configuration, or integration tests."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [testing, stubs, cryptography, hash, fake, test-doubles]
---

# Stubs de Criptografia

> Stubs implementam contratos reais com logica ficticia mas verificavel — nunca retorne o input inalterado.

## Rules

1. **Implemente o contrato real** — o stub deve implementar a mesma interface/abstract class que a implementacao de producao, porque isso garante que mudancas no contrato quebram o stub tambem
2. **Uma classe pode implementar multiplos contratos** — `FakeHasher implements HashGenerator, HashCompare` e valido e reduz arquivos de teste
3. **Nunca retorne o input inalterado** — `hash('123')` retornar `'123'` nao testa nada. Transforme o input de forma previsivel (`'123-hashed'`), porque o teste precisa verificar que o hash foi aplicado
4. **Use transformacoes deterministicas** — concatenar string, JSON.stringify, inverter caracteres. Nunca use Math.random() ou Date.now() em stubs, porque testes devem ser reproduziveis
5. **Mantenha async mesmo no fake** — se o contrato retorna Promise, o stub tambem retorna Promise com async, porque o codigo consumidor usa await
6. **Organize stubs espelhando a estrutura de dominio** — `test/cryptography/fake-hasher.ts` espelha `src/cryptography/`, porque facilita localizar o stub correspondente

## How to write

### FakeHasher (hash + compare)

```typescript
import { HashGenerator } from '@/domain/cryptography/hash-generator'
import { HashComparer } from '@/domain/cryptography/hash-comparer'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
```

### FakeEncrypter (token generation)

```typescript
import { Encrypter } from '@/domain/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
```

## Example

**Before (stub que nao testa nada):**
```typescript
export class FakeHasher implements HashGenerator {
  async hash(plain: string): Promise<string> {
    return plain // retorna inalterado — compare sempre passa
  }
}
```

**After (stub verificavel):**
```typescript
export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Contrato retorna Promise | Stub usa async, mesmo que a logica seja sincrona |
| Dois contratos relacionados (hash/compare) | Uma unica classe implementa ambos |
| Contrato recebe objeto e retorna string | Use JSON.stringify como transformacao ficticia |
| Precisa verificar que hash foi chamado | Concatene sufixo previsivel (`-hashed`) |
| Stub fica complexo demais | Pare — stub complexo indica contrato mal definido |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `return plain` (identity function) | `return plain.concat('-hashed')` |
| `return 'fixed-token'` (valor fixo) | `return JSON.stringify(payload)` |
| `return bcrypt.hash(plain, 1)` (bcrypt real no stub) | `return plain.concat('-hashed')` |
| Classe separada para cada contrato relacionado | Uma classe implementando multiplos contratos |
| `Math.random().toString()` no stub | Transformacao deterministica do input |

## Troubleshooting

### Stub de hash retorna o input inalterado e compare sempre passa
**Symptom:** Teste de autenticacao nunca falha mesmo com senha errada
**Cause:** FakeHasher implementa hash como identity function (`return plain`)
**Fix:** Transforme o input de forma previsivel: `return plain.concat('-hashed')` e compare com a mesma transformacao

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
