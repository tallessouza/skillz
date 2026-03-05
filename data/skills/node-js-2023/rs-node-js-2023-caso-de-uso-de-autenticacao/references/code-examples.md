# Code Examples: Caso de Uso de Autenticacao

## Exemplo completo do use case

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
    // 1. Buscar usuario pelo email
    const user = await this.usersRepository.findByEmail(email)

    // 2. Se nao encontrar, erro generico
    if (!user) {
      throw new InvalidCredentialsError()
    }

    // 3. Comparar senha plain-text com hash armazenado
    const doesPasswordMatches = await compare(password, user.password_hash)

    // 4. Se nao bater, mesmo erro generico (seguranca)
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    // 5. Retornar usuario autenticado
    return { user }
  }
}
```

## Erro de credenciais invalidas

```typescript
// src/use-cases/errors/invalid-credentials-error.ts
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials.')
  }
}
```

## Interface do repositorio reutilizada

```typescript
// O metodo findByEmail ja existia para o caso de uso de cadastro
export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
```

## Evolucao do tipo de retorno durante desenvolvimento

```typescript
// Fase 1: Ainda nao sabe o que retornar
async execute({ email, password }: AuthenticateUseCaseRequest): Promise<void> {
  // implementacao em andamento
}

// Fase 2: Definiu o retorno
async execute({
  email,
  password,
}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
  // ...
  return { user }
}
```

## Comparacao: bcrypt.compare vs comparacao direta

```typescript
// ERRADO: comparacao direta (senhas nunca sao armazenadas em texto plano)
if (password === user.password) { ... }

// ERRADO: tentar "des-hashear" (impossivel por design)
if (dehash(user.password_hash) === password) { ... }

// CORRETO: bcrypt.compare faz hash da nova senha e compara
const doesPasswordMatches = await compare(password, user.password_hash)
```

## Nomeacao de booleanos — exemplos praticos

```typescript
// Ruim: sem concordancia verbal
const match = await compare(password, user.password_hash)
if (match) {} // "if match" — nao soa como pergunta

// Bom: leitura semantica
const doesPasswordMatches = await compare(password, user.password_hash)
if (doesPasswordMatches) {} // "if does password matches" — faz sentido

// Outros exemplos de booleanos bem nomeados:
const isUserActive = user.status === 'active'
const hasPermission = user.roles.includes('admin')
const doesEmailExist = await this.usersRepository.findByEmail(email)
```

## Commit de referencia

[Implementando casos de uso - Caso de uso de autenticacao](https://github.com/skillz-education/ignite-nodejs-03-api-solid-nodejs/commit/70887221894ca0761c02d8fd5eb3b8db2df1650b)