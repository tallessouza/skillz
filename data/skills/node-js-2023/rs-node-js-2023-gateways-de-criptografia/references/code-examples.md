# Code Examples: Gateways de Criptografia

## 1. Entidade Student atualizada

```typescript
// domain/forum/enterprise/entities/student.ts
export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: StudentProps, id?: UniqueEntityID) {
    return new Student(props, id)
  }
}
```

## 2. StudentsRepository

```typescript
// domain/forum/application/repositories/students-repository.ts
export abstract class StudentsRepository {
  abstract findByEmail(email: string): Promise<Student | null>
  abstract create(student: Student): Promise<void>
}
```

## 3. Encrypter (contrato para JWT)

```typescript
// domain/forum/application/cryptography/encrypter.ts
export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
```

O payload e `Record<string, unknown>` porque ao autenticar, o conteudo do token pode variar (sub, role, permissions, etc).

## 4. HashGenerator (contrato para gerar hash)

```typescript
// domain/forum/application/cryptography/hash-generator.ts
export abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>
}
```

## 5. HashComparer (contrato para comparar hash)

```typescript
// domain/forum/application/cryptography/hash-comparer.ts
export abstract class HashComparer {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
```

## 6. Implementacao concreta (infra) — BcryptHasher

```typescript
// infra/cryptography/bcrypt-hasher.ts
import { hash, compare } from 'bcryptjs'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
```

Note que `BcryptHasher` implementa **ambos** os contratos. Isso e valido — Interface Segregation nao proibe, apenas permite que consumidores dependam so do que precisam.

## 7. Implementacao concreta (infra) — JwtEncrypter

```typescript
// infra/cryptography/jwt-encrypter.ts
import { JwtService } from '@nestjs/jwt'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload)
  }
}
```

## 8. Evolucao do Hasher (passo a passo do instrutor)

### Passo 1: Contrato unico (antes do ISP)

```typescript
// O instrutor comeca assim:
export abstract class Hasher {
  abstract hash(plain: string): Promise<string>
  abstract compare(plain: string, hash: string): Promise<boolean>
}
```

### Passo 2: Separado em dois contratos (depois do ISP)

```typescript
// HashGenerator
export abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>
}

// HashComparer
export abstract class HashComparer {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
```

O instrutor explica que a separacao segue o principio da impressora: se tenho uma impressora que copia, escaneia e imprime, posso ter tres contratos. Se uma classe faz tudo, implementa os tres. Se faz so um, implementa so um.

## 9. Contraste: controller acoplado vs. caso de uso desacoplado

### Controller acoplado (codigo existente antes da refatoracao)

```typescript
// create-account.controller.ts (ANTES)
import { hash } from 'bcryptjs'

async handle(@Body() body) {
  const hashedPassword = await hash(body.password, 8)
  await this.prisma.user.create({
    data: { name, email, password: hashedPassword }
  })
}
```

```typescript
// authenticate.controller.ts (ANTES)
import { compare } from 'bcryptjs'

async handle(@Body() body) {
  const user = await this.prisma.user.findUnique({ where: { email } })
  const isPasswordValid = await compare(body.password, user.password)
  const token = await this.jwt.signAsync({ sub: user.id })
}
```

### Caso de uso desacoplado (DEPOIS)

```typescript
// register-student.use-case.ts
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({ name, email, password }) {
    const studentWithSameEmail = await this.studentsRepository.findByEmail(email)
    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }
    const hashedPassword = await this.hashGenerator.hash(password)
    const student = Student.create({ name, email, password: hashedPassword })
    await this.studentsRepository.create(student)
    return right({ student })
  }
}
```

```typescript
// authenticate-student.use-case.ts
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({ email, password }) {
    const student = await this.studentsRepository.findByEmail(email)
    if (!student) return left(new WrongCredentialsError())
    const isPasswordValid = await this.hashComparer.compare(password, student.password)
    if (!isPasswordValid) return left(new WrongCredentialsError())
    const accessToken = await this.encrypter.encrypt({ sub: student.id.toString() })
    return right({ accessToken })
  }
}
```