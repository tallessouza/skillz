# Code Examples: Principios SOLID

## 1. SRP — Identificando violacao com o teste do "e"

O instrutor descreve o cenario verbalmente:

```typescript
// Violacao: "cria um usuario E envia um email"
async function createUser(userData: UserInput) {
  const user = await database.create(userData)
  await emailService.sendWelcome(user.email) // <-- segunda responsabilidade
  return user
}
```

Para identificar: descreva o metodo em uma frase. Se usar "e", ha violacao.

```typescript
// Corrigido: cada funcao faz uma unica coisa
async function createUser(userData: UserInput) {
  return await database.create(userData)
}

async function sendWelcomeEmail(email: string) {
  await emailService.sendWelcome(email)
}

// Orquestrador separado decide a sequencia
async function registerUser(userData: UserInput) {
  const user = await createUser(userData)
  await sendWelcomeEmail(user.email)
  return user
}
```

## 2. OCP — Calculo de frete com ifs crescentes

Cenario do instrutor: sistema de logistica com transportadoras.

```typescript
// VIOLACAO OCP: cada nova transportadora = novo if
function calculateShipping(carrier: string, weight: number): number {
  if (carrier === 'correios') {
    return correiosAPI.calculate(weight)
  }
  if (carrier === 'rocketpress') {
    return rocketpressAPI.calculate(weight)
  }
  // Proxima transportadora? Mais um if aqui...
  throw new Error('Carrier not supported')
}
```

```typescript
// CORRIGIDO: extensao via interface
interface ShippingCalculator {
  calculate(weight: number): Promise<number>
}

class CorreiosCalculator implements ShippingCalculator {
  async calculate(weight: number) {
    return await correiosAPI.calculate(weight)
  }
}

class RocketPressCalculator implements ShippingCalculator {
  async calculate(weight: number) {
    return await rocketpressAPI.calculate(weight)
  }
}

// Funcao nao muda quando nova transportadora e adicionada
async function calculateShipping(
  calculator: ShippingCalculator,
  weight: number
): Promise<number> {
  return calculator.calculate(weight)
}
```

## 3. LSP — Repositorios substituiveis

```typescript
interface UserRepository {
  create(data: CreateUserInput): Promise<User>
  delete(id: string): Promise<void>
  update(id: string, data: Partial<User>): Promise<User>
  list(): Promise<User[]>
}

// Implementacao Postgres
class PostgresUserRepository implements UserRepository {
  async create(data: CreateUserInput) { /* query postgres */ }
  async delete(id: string) { /* query postgres */ }
  async update(id: string, data: Partial<User>) { /* query postgres */ }
  async list() { /* query postgres */ }
}

// Implementacao Mongo — mesmos metodos
class MongoUserRepository implements UserRepository {
  async create(data: CreateUserInput) { /* query mongo */ }
  async delete(id: string) { /* query mongo */ }
  async update(id: string, data: Partial<User>) { /* query mongo */ }
  async list() { /* query mongo */ }
}

// A classe consumidora nao sabe qual repositorio esta usando
class UserService {
  constructor(private repository: UserRepository) {}

  async register(data: CreateUserInput) {
    return this.repository.create(data)
  }
}

// Funciona com qualquer implementacao
new UserService(new PostgresUserRepository())
new UserService(new MongoUserRepository())
```

## 4. ISP — Impressora com interfaces segregadas

Exemplo direto do instrutor:

```typescript
// VIOLACAO: interface monolitica
interface Printer {
  print(): void
  scan(): void
}

// Impressora basica e forcada a implementar scan
class BasicPrinter implements Printer {
  print() { console.log('Imprimindo...') }
  scan() { throw new Error('Nao suportado') } // <-- forcado
}
```

```typescript
// CORRIGIDO: interfaces segregadas
interface Printable {
  print(): void
}

interface Scannable {
  scan(): void
}

// Impressora multifuncional implementa ambas
class MultiFunctionPrinter implements Printable, Scannable {
  print() { console.log('Imprimindo...') }
  scan() { console.log('Escaneando...') }
}

// Impressora basica implementa apenas o que usa
class BasicPrinter implements Printable {
  print() { console.log('Imprimindo...') }
}
```

## 5. DIP — Inversao com funcoes

Exemplo do instrutor usando funcoes (nao classes):

```typescript
// MODELO TRADICIONAL: import direto
import { createUserOnDatabase } from './database'

function createUser(name: string, email: string) {
  return createUserOnDatabase(name, email)
}
```

```typescript
// DIP: dependencia recebida como parametro
type CreateUserOnDB = (name: string, email: string) => Promise<User>

function createUser(
  createUserOnDatabase: CreateUserOnDB,
  name: string,
  email: string
) {
  return createUserOnDatabase(name, email)
}

// Quem chama decide a implementacao
import { createUserOnDatabase } from './database'
createUser(createUserOnDatabase, 'Diego', 'diego@email.com')

// Em testes: passa um mock
createUser(mockCreateUser, 'Test', 'test@email.com')
```

## 6. Todos os principios juntos — Cenario completo

```typescript
// --- Interfaces (ISP) ---
interface UserRepository {
  create(data: CreateUserInput): Promise<User>
}

interface WelcomeMailer {
  send(email: string): Promise<void>
}

// --- Caso de uso com DIP ---
class RegisterUser {
  constructor(
    private repository: UserRepository,  // DIP: injetado
    private mailer: WelcomeMailer         // DIP: injetado
  ) {}

  // SRP: orquestra, mas cada acao e delegada
  async execute(data: CreateUserInput): Promise<User> {
    const user = await this.repository.create(data) // uma acao
    await this.mailer.send(user.email)               // outra acao delegada
    return user
  }
}

// --- LSP: qualquer implementacao funciona ---
const useCase = new RegisterUser(
  new PostgresUserRepository(), // ou MongoUserRepository
  new SendGridMailer()          // ou SESMailer
)

// --- OCP: nova transportadora? Nova classe, nao novo if ---
class JadLogCalculator implements ShippingCalculator {
  async calculate(weight: number) { /* ... */ }
}
```