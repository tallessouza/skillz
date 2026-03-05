# Code Examples: Entendendo as Camadas no NestJS

## Exemplo 1: Fluxo Completo de Criacao de Usuario

O instrutor descreve o fluxo de criacao de usuario passando por todas as camadas:

```typescript
// 1. CAMADA EXTERNA — Controller recebe a requisicao HTTP
// infra/http/controllers/create-user.controller.ts
@Controller('/users')
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  async handle(@Body() body: CreateUserDto) {
    // Controller NAO faz logica — apenas delega
    const user = await this.createUser.execute({
      name: body.name,
      email: body.email,
      password: body.password,
    })

    // Presenter adapta a resposta
    return UserPresenter.toHTTP(user)
  }
}

// 2. CAMADA DE APLICACAO — Use Case orquestra
// application/use-cases/create-user.ts
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator, // Gateway para criptografia
  ) {}

  async execute({ name, email, password }: CreateUserRequest) {
    // Use case pode interagir com entidades...
    const user = User.create({ name, email, password })

    // ...e com repositorios (volta para camada externa)
    const hashedPassword = await this.hashGenerator.hash(password)
    user.password = hashedPassword

    await this.usersRepository.create(user)

    return user
  }
}

// 3. CAMADA DE DOMINIO — Entidade pura
// domain/entities/user.ts
export class User {
  id: string
  name: string
  email: string
  password: string

  static create(props: CreateUserProps): User {
    // Regras de negocio vivem aqui
    // Validacoes de dominio vivem aqui
  }
}

// 4. CAMADA DE ADAPTADORES — Repository (interface)
// application/repositories/users-repository.ts
export abstract class UsersRepository {
  abstract create(user: User): Promise<void>
  abstract findAll(): Promise<User[]>
  abstract findByEmail(email: string): Promise<User | null>
}

// 5. CAMADA EXTERNA — Repository (implementacao com Prisma)
// infra/database/prisma/repositories/prisma-users-repository.ts
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany()
    return users.map(PrismaUserMapper.toDomain)
  }
}

// 6. CAMADA DE ADAPTADORES — Presenter
// infra/http/presenters/user-presenter.ts
export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      // password NAO e retornado — esse e o papel do presenter
    }
  }
}
```

## Exemplo 2: Fluxo de Autenticacao (Ida e Volta entre Camadas)

Demonstra o ponto do instrutor sobre o fluxo nao ser uma linha reta:

```typescript
// Use case de autenticacao — vai e volta entre camadas
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,    // Gateway → DB
    private hashComparer: HashComparer,           // Gateway → crypto
    private tokenGenerator: TokenGenerator,       // Gateway → JWT
  ) {}

  async execute({ email, password }: AuthenticateRequest) {
    // 1. Volta para camada externa (banco) via repositorio
    const user = await this.usersRepository.findByEmail(email)
    if (!user) throw new InvalidCredentialsError()

    // 2. Usa gateway de criptografia (camada externa)
    const passwordMatch = await this.hashComparer.compare(password, user.password)
    if (!passwordMatch) throw new InvalidCredentialsError()

    // 3. Usa gateway de token (camada externa)
    const token = await this.tokenGenerator.generate({ sub: user.id })

    // Retorna para o controller, que usa Presenter
    return { token }
  }
}
```

## Exemplo 3: Listagem com Presenter Filtrando Campos

O instrutor enfatiza que na listagem, talvez voce so precise de alguns campos:

```typescript
// Presenter para listagem — campos reduzidos
export class UserListPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      // Apenas id e nome na listagem
    }
  }
}

// Presenter para detalhe — mais campos
export class UserDetailPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      // Mais dados no detalhe, mas ainda sem senha
    }
  }
}
```

## Exemplo 4: Gateway para Servico Externo (Email)

Demonstra o conceito de Gateway generalizado:

```typescript
// application/gateways/email-sender.ts — Interface (camada interna)
export abstract class EmailSender {
  abstract send(to: string, subject: string, body: string): Promise<void>
}

// infra/gateways/sendgrid-email-sender.ts — Implementacao (camada externa)
export class SendGridEmailSender implements EmailSender {
  async send(to: string, subject: string, body: string): Promise<void> {
    // Implementacao especifica do SendGrid
    // Camada interna nao conhece SendGrid
  }
}

// Use case usa a interface, nao a implementacao
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private emailSender: EmailSender, // Gateway — inversao de dependencia
  ) {}

  async execute(data: CreateUserRequest) {
    const user = User.create(data)
    await this.usersRepository.create(user)
    await this.emailSender.send(user.email, 'Bem-vindo!', '...')
    return user
  }
}
```