# Deep Explanation: Casos de Uso — Autenticação e Cadastro

## Por que extrair lógica do controller para use cases?

O instrutor mostra que o controller (`create-account.controller.ts`) já tinha toda a lógica de verificação de email duplicado, hash de senha e criação de usuário. O problema é que essa lógica fica acoplada ao framework (NestJS) e à implementação concreta (Prisma, bcrypt).

Ao mover para um use case, a lógica de negócio fica:
- **Testável** sem HTTP, banco de dados ou framework
- **Reutilizável** em diferentes contextos (CLI, queue, outro framework)
- **Substituível** — trocar bcrypt por argon2 é mudar apenas o gateway

## Arquitetura de erros: semântica > genérica

O instrutor faz uma distinção importante:

### Erros de cadastro: específicos
`StudentAlreadyExistsError` — é seguro informar que o email já existe no cadastro, porque o usuário precisa saber para usar outro email.

### Erros de autenticação: genéricos
`WrongCredentialsError` — mesma classe para "usuário não encontrado" E "senha incorreta". O instrutor explica: "no caso da autenticação, a gente não quer retornar para o usuário no front-end qual que foi exatamente o erro que aconteceu." Isso previne:
- **Enumeração de usuários** — atacante não descobre quais emails existem
- **Brute force direcionado** — não sabe se acertou o email

## Pattern: identifier genérico nos erros

O instrutor usa `identifier` ao invés de `email` no constructor do erro:

```typescript
constructor(identifier: string) {
  super(`Student "${identifier}" already exists.`)
}
```

Raciocínio: "se um dia eu fizer um login que não seja por email, seja por usuário ou por CPF, a gente já mantém a identifier." Isso é design para extensibilidade sem over-engineering — o custo é zero (apenas um nome de parâmetro), mas o ganho futuro é real.

## Organização de pastas de erros

```
src/domain/forum/application/
├── use-cases/
│   ├── errors/
│   │   ├── student-already-exists-error.ts    # Específico
│   │   └── wrong-credentials-error.ts         # Específico
│   ├── register-student.ts
│   └── authenticate-student.ts
└── ...

src/core/
├── errors/
│   └── use-case-error.ts    # Interface compartilhada
```

A interface `UseCaseError` centraliza o contrato — todos os erros de use case a implementam. Mas cada erro concreto vive próximo do use case que o gera, a menos que seja compartilhado.

## Separação de gateways criptográficos

O instrutor usa três contratos distintos:

| Gateway | Responsabilidade | Usado em |
|---------|-----------------|----------|
| `HashGenerator` | Gerar hash de senha | Cadastro |
| `HashComparer` | Comparar senha com hash | Login |
| `Encrypter` | Gerar token JWT | Login |

Por que não um único `CryptoService`? Porque cada operação tem semântica diferente. O `HashGenerator` é irreversível (bcrypt), o `Encrypter` é reversível (JWT). Separar permite:
- Substituir implementações independentemente
- Testar com mocks específicos
- Interface Segregation Principle (ISP)

## Either pattern no retorno

O use case não lança exceptions — retorna `Either<Error, Success>`:

```typescript
Promise<Either<StudentAlreadyExistsError, { student: Student }>>
```

- `left(error)` = falha, tipada
- `right(value)` = sucesso, tipado

O controller decide como traduzir: `left` vira `ConflictException` ou `UnauthorizedException`, o use case não sabe nem se importa com HTTP.

## UniqueEntityId.toString()

Detalhe sutil: ao passar o ID do student para o Encrypter, o instrutor usa `.toString()`:

```typescript
const accessToken = await this.encrypter.encrypt({
  sub: student.id.toString(),
})
```

Porque `student.id` é uma instância de `UniqueEntityId` (value object), mas o payload do JWT espera uma string primitiva. Sem o `.toString()`, o JWT serializaria o objeto inteiro.