---
name: rs-clean-code-principios-de-solid
description: "Applies SOLID principles when writing or reviewing TypeScript/Node.js code. Use when user asks to 'refactor code', 'improve architecture', 'apply SOLID', 'create a service', 'design classes', or 'make code testable'. Enforces SRP via connectors test, OCP via extension over conditionals, LSP via substitutable dependencies, ISP via granular interfaces, DIP via injected dependencies. Make sure to use this skill whenever structuring backend services or reviewing class design. Not for UI styling, database queries, or DevOps configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: principios-de-solid
  tags: [solid, srp, ocp, lsp, isp, dip, dependency-injection, typescript, architecture]
---

# Principios SOLID

> Aplique os 5 principios SOLID como um emaranhado conectado, nunca como regras isoladas — eles se sobrepoem no codigo real.

## Rules

1. **SRP — Teste do conector "e"** — descreva o que um metodo/classe faz. Se usar "e" conectando duas acoes, separe em duas unidades, porque cada unidade deve ter uma unica responsabilidade
2. **OCP — Extensao, nunca modificacao** — se adicionar uma variacao exige novo `if/else` na classe original, o design esta errado. Estenda via composicao ou estrategia, porque a classe original nao deve mudar a cada variacao
3. **LSP — Dependencias substituiveis** — qualquer dependencia deve poder ser trocada por outra com o mesmo formato sem quebrar a classe consumidora, porque isso garante testabilidade e flexibilidade
4. **ISP — Interfaces granulares** — separe interfaces grandes em menores e especificas, porque nem todo consumidor precisa de todos os metodos
5. **DIP — Injete dependencias** — nunca importe dependencias diretamente dentro da funcao/classe. Receba-as como parametro, porque isso inverte o controle e permite testes e substituicao

## How to write

### SRP — Separar responsabilidades

```typescript
// ERRADO: createUser cria usuario E envia email
async function createUser(data: CreateUserInput) {
  const user = await db.users.create(data)
  await sendWelcomeEmail(user.email) // segunda responsabilidade
  return user
}

// CERTO: cada funcao faz uma coisa
async function createUser(data: CreateUserInput) {
  return await db.users.create(data)
}

async function sendWelcomeEmail(email: string) {
  await mailer.send({ to: email, template: 'welcome' })
}
```

### OCP — Extensao via estrategia

```typescript
// ERRADO: novo if para cada transportadora
function calculateShipping(carrier: string, weight: number) {
  if (carrier === 'correios') return correiosAPI.calc(weight)
  if (carrier === 'rocketpress') return rocketAPI.calc(weight)
  // cada nova transportadora = novo if = modificacao
}

// CERTO: estrategia injetada
interface ShippingCalculator {
  calculate(weight: number): Promise<number>
}

function calculateShipping(calculator: ShippingCalculator, weight: number) {
  return calculator.calculate(weight)
}
```

### DIP — Inversao de dependencia

```typescript
// ERRADO: importacao direta dentro da funcao
import { createUserOnDatabase } from './database'

function createUser(name: string) {
  return createUserOnDatabase(name)
}

// CERTO: dependencia recebida como parametro
function createUser(
  repository: { create: (name: string) => Promise<User> },
  name: string
) {
  return repository.create(name)
}
```

### ISP — Interfaces segregadas

```typescript
// ERRADO: interface monolitica
interface Printer {
  print(): void
  scan(): void
}

// CERTO: interfaces granulares
interface Printable { print(): void }
interface Scannable { scan(): void }

class MultiFunctionPrinter implements Printable, Scannable {
  print() { /* ... */ }
  scan() { /* ... */ }
}

class BasicPrinter implements Printable {
  print() { /* ... */ }
}
```

## Example

**Before (viola SRP + OCP + DIP):**
```typescript
import { prisma } from './database'
import { sendEmail } from './mailer'

async function createUser(data: CreateUserInput) {
  const user = await prisma.user.create({ data })
  await sendEmail(user.email, 'Bem-vindo!')
  if (user.role === 'admin') await notifySlack(user)
  return user
}
```

**After (todos os principios aplicados):**
```typescript
interface UserRepository {
  create(data: CreateUserInput): Promise<User>
}

async function createUser(
  repository: UserRepository,
  data: CreateUserInput
): Promise<User> {
  return repository.create(data)
}

// Composicao separada orquestra as acoes
async function registerUser(
  repository: UserRepository,
  mailer: Mailer,
  data: CreateUserInput
) {
  const user = await createUser(repository, data)
  await mailer.sendWelcome(user.email)
  return user
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Descreveu o metodo usando "e" | Separe em dois (SRP) |
| Adicionando novo `if` para variacao | Use strategy pattern (OCP) |
| Teste precisa de banco real | Injete o repositorio (DIP + LSP) |
| Classe implementa metodo que nao usa | Separe a interface (ISP) |
| Nunca colocou app em producao | Nao force SOLID — escreva o codigo que funciona primeiro |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `import { db } from './database'` dentro do service | Receba `repository` como parametro |
| `if (type === 'X') ... else if (type === 'Y')` crescente | Strategy pattern com interface comum |
| Funcao que cria + notifica + loga | Uma funcao por acao, orquestrador separado |
| Interface com 10 metodos | Varias interfaces de 1-3 metodos |
| Classe que conhece implementacao da dependencia | Classe que conhece apenas a interface |

## Troubleshooting

### Teste unitario requer banco de dados rodando
**Symptom:** Testes falham porque dependem de conexao real com PostgreSQL/MySQL para executar
**Cause:** O use case importa diretamente o ORM ou cliente de banco em vez de receber um repositorio via construtor
**Fix:** Aplique DIP: crie uma interface `UserRepository`, injete via construtor no use case, e nos testes passe uma implementacao `InMemoryUserRepository` que nao precisa de banco real

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-principios-de-solid/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-principios-de-solid/references/code-examples.md)
