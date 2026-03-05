# Code Examples: Casos de Uso — Autenticação e Cadastro

## Exemplo completo: RegisterStudent

```typescript
// src/domain/forum/application/use-cases/register-student.ts
import { Either, left, right } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>

export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return right({ student })
  }
}
```

## Exemplo completo: AuthenticateStudent

```typescript
// src/domain/forum/application/use-cases/authenticate-student.ts
import { Either, left, right } from '@/core/either'
import { StudentsRepository } from '../repositories/students-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({ accessToken })
  }
}
```

## Classes de erro

```typescript
// src/domain/forum/application/use-cases/errors/student-already-exists-error.ts
import { UseCaseError } from '@/core/errors/use-case-error'

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student "${identifier}" already exists.`)
  }
}
```

```typescript
// src/domain/forum/application/use-cases/errors/wrong-credentials-error.ts
import { UseCaseError } from '@/core/errors/use-case-error'

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Credentials are not valid.')
  }
}
```

```typescript
// src/core/errors/use-case-error.ts
export interface UseCaseError {
  message: string
}
```

## Contratos de criptografia (gateways)

```typescript
// src/domain/forum/application/cryptography/hash-generator.ts
export abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>
}

// src/domain/forum/application/cryptography/hash-comparer.ts
export abstract class HashComparer {
  abstract compare(plain: string, hash: string): Promise<boolean>
}

// src/domain/forum/application/cryptography/encrypter.ts
export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
```

## Estrutura de pastas resultante

```
src/domain/forum/application/
├── cryptography/
│   ├── encrypter.ts
│   ├── hash-comparer.ts
│   └── hash-generator.ts
├── repositories/
│   └── students-repository.ts
└── use-cases/
    ├── errors/
    │   ├── student-already-exists-error.ts
    │   └── wrong-credentials-error.ts
    ├── register-student.ts
    └── authenticate-student.ts
```

## Fluxo de dados: Cadastro

```
Request(name, email, password)
    │
    ▼
findByEmail(email)
    │
    ├── found → left(StudentAlreadyExistsError)
    │
    └── not found
         │
         ▼
    hashGenerator.hash(password)
         │
         ▼
    Student.create({ name, email, password: hashed })
         │
         ▼
    studentsRepository.create(student)
         │
         ▼
    right({ student })
```

## Fluxo de dados: Autenticação

```
Request(email, password)
    │
    ▼
findByEmail(email)
    │
    ├── not found → left(WrongCredentialsError)
    │
    └── found
         │
         ▼
    hashComparer.compare(password, student.password)
         │
         ├── false → left(WrongCredentialsError)
         │
         └── true
              │
              ▼
         encrypter.encrypt({ sub: student.id.toString() })
              │
              ▼
         right({ accessToken })
```