---
name: rs-node-js-2023-caso-de-uso-de-autenticacao
description: "Enforces inside-out authentication use case patterns when building auth features in Node.js with SOLID principles. Use when user asks to 'implement login', 'create authentication', 'build auth use case', 'add sign in', or 'validate credentials'. Applies rules: start from use case not controller, generic error messages for all auth failures, bcrypt compare for password validation, boolean naming with is/has/does prefix. Make sure to use this skill whenever implementing authentication flows in Node.js applications. Not for JWT token generation, session management, OAuth flows, or frontend auth UI."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: authentication
  tags: [authentication, use-case, bcrypt, solid, security, credentials, nodejs]
---

# Caso de Uso de Autenticacao

> Sempre comece uma funcionalidade pelo caso de uso (nivel mais baixo), nunca pelo controller, porque o caso de uso pode ser testado unitariamente desde o inicio.

## Rules

1. **Comece de baixo para cima** — crie o use case antes do controller, porque o controller sozinho nao tem responsabilidade nenhuma e nao pode ser validado isoladamente
2. **Use classe com injecao de dependencia** — o use case recebe repositorios via construtor, porque permite inversao de dependencia (SOLID) e facilita testes com in-memory repositories
3. **Erros de autenticacao sempre genericos** — use `InvalidCredentialsError` para todos os casos (email errado, senha errada, usuario inexistente), porque erros especificos dao indicios a atacantes sobre o que esta correto
4. **Compare senhas com bcrypt.compare** — nunca tente reverter o hash, porque hashing e unidirecional; use `compare(plaintext, hash)` para verificar equivalencia
5. **Booleanos com prefixo semantico** — use `is`, `has`, `does` para que a leitura como `if doesPasswordMatches` faca sentido gramatical, porque `if match` nao tem concordancia verbal
6. **Reutilize metodos do repositorio** — antes de criar novos metodos, verifique se ja existe algo como `findByEmail` que serve para autenticacao tambem

## How to write

### Estrutura do Use Case

```typescript
import { compare } from 'bcryptjs'
import type { User } from '@prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
```

### Erro generico de autenticacao

```typescript
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials.')
  }
}
```

## Example

**Before (erros especificos — inseguro):**
```typescript
const user = await this.usersRepository.findByEmail(email)
if (!user) {
  throw new UserDoesNotExistError() // revela que email nao existe
}
const match = await compare(password, user.password_hash)
if (!match) {
  throw new WrongPasswordError() // revela que email esta correto
}
```

**After (erro generico — seguro):**
```typescript
const user = await this.usersRepository.findByEmail(email)
if (!user) {
  throw new InvalidCredentialsError()
}
const doesPasswordMatches = await compare(password, user.password_hash)
if (!doesPasswordMatches) {
  throw new InvalidCredentialsError()
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova funcionalidade | Comece pelo use case, depois teste, depois controller |
| Repositorio ja tem metodo util | Reutilize (ex: `findByEmail` serve para cadastro E autenticacao) |
| Retorno do use case de auth | Retorne o `user` autenticado, nao um token (token e responsabilidade do controller/camada externa) |
| Tipagem de retorno vazia temporariamente | Use `Promise<void>` enquanto desenvolve, troque depois |
| Variavel booleana | Leia como frase: `if doesPasswordMatches` deve fazer sentido |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `throw new UserDoesNotExistError()` em auth | `throw new InvalidCredentialsError()` |
| `throw new WrongPasswordError()` em auth | `throw new InvalidCredentialsError()` |
| `const match = await compare(...)` | `const doesPasswordMatches = await compare(...)` |
| Comecar pelo controller | Comecar pelo use case |
| `if (password === user.password)` | `if (await compare(password, user.password_hash))` |
| Use case como funcao solta | Use case como classe com constructor recebendo dependencias |

## Troubleshooting

### Use case lanca erro inesperado
**Symptom:** Teste falha com erro nao tratado no use case
**Cause:** Entidade dependente nao foi criada no repositorio in-memory antes de executar
**Fix:** Pre-seed o repositorio com todas as entidades necessarias usando factories antes de chamar `sut.execute()`

### Comparacao de ID falha silenciosamente
**Symptom:** `authorId !== entity.authorId` sempre retorna true mesmo com IDs corretos
**Cause:** `entity.authorId` e um UniqueEntityID, nao uma string
**Fix:** Use `.toString()` na comparacao: `entity.authorId.toString() !== authorId`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-de-autenticacao/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-de-autenticacao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
