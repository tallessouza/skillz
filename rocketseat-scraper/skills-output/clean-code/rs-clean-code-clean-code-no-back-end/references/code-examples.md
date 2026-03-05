# Code Examples: Clean Code no Back-end

## Exemplo 1: Backend limpo com framework opinado

Quando voce usa um framework como Nest ou Adonis, a estrutura ja vem definida. Clean Code aqui significa aplicar os fundamentos DENTRO da estrutura do framework:

```typescript
// NestJS — a estrutura e do framework, o codigo limpo e seu
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existingUser) {
      throw new ConflictException('Email already in use')
    }

    const hashedPassword = await hash(input.password, 10)

    return this.prisma.user.create({
      data: { ...input, password: hashedPassword },
    })
  }
}
```

Note: nao ha Clean Architecture aqui. Ha codigo limpo — nomes claros, funcoes com responsabilidade unica, tratamento de erro explicito.

## Exemplo 2: Testabilidade como indicador

### Codigo dificil de testar (sinal de codigo sujo)

```typescript
// Tudo acoplado — impossivel testar sem banco de dados real
export async function createUser(name: string, email: string, password: string) {
  const conn = await mysql.createConnection(process.env.DATABASE_URL!)
  const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email])

  if ((rows as any[]).length > 0) {
    throw new Error('exists')
  }

  const hashed = await bcrypt.hash(password, 10)
  await conn.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed])
  conn.end()
}
```

### Codigo facil de testar (sinal de codigo limpo)

```typescript
// Desacoplado — testavel com mock simples, sem precisar de "Clean Architecture"
interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserData): Promise<User>
}

export async function createUser(
  input: CreateUserInput,
  repository: UsersRepository,
) {
  const existingUser = await repository.findByEmail(input.email)

  if (existingUser) {
    throw new ConflictError('Email already in use')
  }

  const hashedPassword = await hashPassword(input.password)

  return repository.create({
    ...input,
    password: hashedPassword,
  })
}
```

```typescript
// Teste simples e resistente a mudancas
test('should create user with hashed password', async () => {
  const mockRepository: UsersRepository = {
    findByEmail: async () => null,
    create: async (data) => ({ id: '1', ...data }),
  }

  const user = await createUser(
    { name: 'John', email: 'john@mail.com', password: '123456' },
    mockRepository,
  )

  expect(user.email).toBe('john@mail.com')
  expect(user.password).not.toBe('123456')
})
```

Note: a segunda versao usa uma interface para o repositorio — isso e desacoplamento basico, NAO e Clean Architecture. A diferenca e importante.

## Exemplo 3: Over-engineering vs simplicidade

### Over-engineering (canhao para matar formiga)

```
src/
├── domain/
│   ├── entities/
│   │   └── User.ts              # Entidade com regras de dominio
│   ├── value-objects/
│   │   ├── Email.ts             # Value object para email
│   │   └── Password.ts          # Value object para senha
│   └── repositories/
│       └── IUserRepository.ts   # Interface do repositorio
├── application/
│   ├── use-cases/
│   │   └── CreateUserUseCase.ts # Caso de uso
│   ├── dtos/
│   │   └── CreateUserDTO.ts     # DTO de entrada
│   └── mappers/
│       └── UserMapper.ts        # Mapper entidade <-> DTO
├── infrastructure/
│   ├── repositories/
│   │   └── PrismaUserRepository.ts  # Implementacao
│   └── factories/
│       └── UserFactory.ts       # Factory
└── presentation/
    └── controllers/
        └── UserController.ts    # Controller

// 12 arquivos para salvar um usuario no banco
// Isso NAO e codigo limpo — e over-engineering
```

### Proporcional ao problema

```
src/
├── modules/
│   └── users/
│       ├── create-user.ts       # Logica + validacao
│       ├── create-user.test.ts  # Testes
│       └── users.routes.ts      # Rotas
└── lib/
    └── prisma.ts                # Cliente do banco

// 4 arquivos. Testavel. Limpo. Proporcional.
```

## Exemplo 4: Entendendo por que, nao so o que

```typescript
// DEV QUE SEGUE REGRA SEM ENTENDER:
// "Preciso de interface para tudo porque SOLID manda"
interface IHasher { hash(value: string): Promise<string> }
interface IValidator { validate(input: unknown): boolean }
interface ILogger { log(message: string): void }
// ... 15 interfaces para um modulo simples

// DEV QUE ENTENDE O PORQUE:
// "Preciso de interface AQUI porque quero trocar a implementacao nos testes"
interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserData): Promise<User>
}
// Uma interface, com motivo claro
```