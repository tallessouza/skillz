# Code Examples: Repository Pattern

## Estrutura de pastas

```
src/
├── repositories/
│   └── prisma-users-repository.ts    # Implementacao com Prisma
├── use-cases/
│   └── register.ts                    # Caso de uso de registro
└── lib/
    └── prisma.ts                      # Instancia do Prisma Client
```

## Repositorio completo (como mostrado na aula)

```typescript
// src/repositories/prisma-users-repository.ts
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
```

### Detalhes do tipo `Prisma.UserCreateInput`

O Prisma gera automaticamente este tipo baseado no schema:

```typescript
// Gerado automaticamente pelo Prisma (nao editar)
type UserCreateInput = {
  id?: string            // opcional — gerado automaticamente
  created_at?: Date      // opcional — default now()
  name: string           // obrigatorio
  email: string          // obrigatorio
  password_hash: string  // obrigatorio
}
```

Para update, todos sao opcionais:
```typescript
type UserUpdateInput = {
  id?: string
  created_at?: Date
  name?: string
  email?: string
  password_hash?: string
}
```

## Caso de uso consumindo o repositorio

```typescript
// src/use-cases/register.ts
import { hash } from 'bcryptjs'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const prismaUsersRepository = new PrismaUsersRepository()

  // Verifica se email ja existe
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.')
  }

  // Cria usuario via repositorio (nao via prisma direto)
  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
```

## Convencao de nomenclatura

| Elemento | Padrao | Exemplo |
|----------|--------|---------|
| Pasta | `repositories/` | `src/repositories/` |
| Arquivo | `{orm}-{tabela}-repository.ts` | `prisma-users-repository.ts` |
| Classe | `{Orm}{Entidade}Repository` | `PrismaUsersRepository` |
| Metodo | verbo da operacao | `create`, `findByEmail`, `findById` |
| Tipo do parametro | `Prisma.{Entidade}{Operacao}Input` | `Prisma.UserCreateInput` |

## Extensao futura do repositorio

Conforme a aplicacao cresce, o repositorio ganha mais metodos:

```typescript
export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data })
    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    return user
  }
}
```