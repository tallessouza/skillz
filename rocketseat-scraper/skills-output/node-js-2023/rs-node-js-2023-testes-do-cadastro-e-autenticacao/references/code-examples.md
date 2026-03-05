# Code Examples: Testes de Cadastro e Autenticacao

## InMemoryStudentsRepository completo

```typescript
// test/repositories/in-memory-students-repository.ts
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async create(student: Student) {
    this.items.push(student)
  }

  async findByEmail(email: string) {
    const student = this.items.find((item) => item.email === email)

    if (!student) {
      return null
    }

    return student
  }
}
```

## Factory makeStudent

```typescript
// test/factories/make-student.ts
import { faker } from '@faker-js/faker'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return student
}
```

## RegisterStudent spec completo

```typescript
// src/domain/forum/application/use-cases/register-student.spec.ts
import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
```

## AuthenticateStudent spec completo

```typescript
// src/domain/forum/application/use-cases/authenticate-student.spec.ts
import { AuthenticateStudentUseCase } from './authenticate-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryStudentsRepository.items.push(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
```

## Tecnica de criacao de repositorio in-memory

O instrutor demonstra o processo:

1. Copiar repositorio existente (`in-memory-questions-repository.ts`)
2. Renomear arquivo para `in-memory-students-repository.ts`
3. Usar Ctrl+Shift+P → "Replace" com "Preserve Case" ativado
4. Substituir `question` por `student` — preserve case mantem `Question` → `Student`, `question` → `student`
5. Remover metodos que nao existem na interface (`delete`, `save`)
6. Adicionar metodos faltantes (`findByEmail`)

```typescript
// Metodo findByEmail adicionado manualmente
async findByEmail(email: string) {
  const student = this.items.find((item) => item.email === email)
  if (!student) {
    return null
  }
  return student
}
```

## Ordem das dependencias no AuthenticateStudentUseCase

A ordem importa e deve seguir a assinatura do construtor:

```typescript
// Ordem correta: repository, hasher, encrypter
sut = new AuthenticateStudentUseCase(
  inMemoryStudentsRepository,  // 1. repository
  fakeHasher,                  // 2. hash comparer
  fakeEncrypter,               // 3. encrypter
)
```