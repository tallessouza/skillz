---
name: rs-node-js-2023-caso-uso-criacao-academia
description: "Applies the use case creation pattern following SOLID and repository pattern in Node.js APIs. Use when user asks to 'create a use case', 'implement a feature', 'add CRUD operation', 'create a service layer', or 'implement business logic with tests'. Enforces: null vs undefined semantics, Prisma Decimal conversion, in-memory repository with optional ID, custom error classes, and test-first confidence. Make sure to use this skill whenever creating new use cases or services in Node.js SOLID projects. Not for route/controller creation, database migrations, or authentication/authorization logic."
---

# Caso de Uso — Padrao de Criacao (SOLID + Repository)

> Ao criar um caso de uso, siga o padrao: interface do repositorio → implementacao in-memory → use case → teste unitario → erros customizados.

## Rules

1. **Reaproveite casos de uso existentes como base** — copie um use case semelhante e adapte, porque manter consistencia estrutural e mais importante que escrever do zero
2. **Diferencie null de undefined em inputs** — `null` significa "quero remover o valor", `undefined` significa "nao quero mexer nesse campo", porque em updates parciais essa semantica evita bugs silenciosos
3. **Converta tipos Prisma no repositorio in-memory** — latitude/longitude precisam de `new Prisma.Decimal(value.toString())`, porque o Prisma espera seu tipo Decimal proprio
4. **Permita ID opcional no repositorio in-memory** — `id: data.id ?? randomUUID()`, porque testes precisam criar entidades com IDs especificos para validar relacoes
5. **Crie erros customizados por regra de negocio** — `MaxDistanceError`, `MaxNumberOfCheckInsError`, nao erros genericos, porque erros especificos permitem tratamento diferenciado no controller
6. **Rode testes apos cada refatoracao** — testes passando = confianca de que nada quebrou, porque refatorar sem testes e voar as cegas

## How to write

### Interface do repositorio (novo metodo)

```typescript
// Adicione ao contrato da interface
export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
}
```

### Repositorio in-memory

```typescript
async create(data: Prisma.GymCreateInput) {
  const gym: Gym = {
    id: data.id ?? randomUUID(),
    title: data.title,
    description: data.description ?? null,
    phone: data.phone ?? null,
    latitude: new Prisma.Decimal(data.latitude.toString()),
    longitude: new Prisma.Decimal(data.longitude.toString()),
  }

  this.items.push(gym)
  return gym
}
```

### Use case

```typescript
interface CreateGymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title, description, phone, latitude, longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}
```

### Erro customizado

```typescript
export class MaxDistanceError extends Error {
  constructor() {
    super('Max distance reached.')
  }
}
```

### Teste unitario

```typescript
let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

beforeEach(() => {
  gymsRepository = new InMemoryGymsRepository()
  sut = new CreateGymUseCase(gymsRepository)
})

it('should be able to create gym', async () => {
  const { gym } = await sut.execute({
    title: 'JavaScript Gym',
    description: null,
    phone: null,
    latitude: -27.2092052,
    longitude: -49.6401091,
  })

  expect(gym.id).toEqual(expect.any(String))
})
```

## Example

**Before (erro generico + push direto no array):**
```typescript
// No teste de check-in
gymsRepository.items.push({
  id: 'gym-01',
  title: 'Gym',
  latitude: new Decimal(-27.2092052),
  // ...
})

// No use case
throw new Error('Max distance reached.')
```

**After (metodo create + erro customizado):**
```typescript
// No teste de check-in
await gymsRepository.create({
  id: 'gym-01',
  title: 'Gym',
  latitude: -27.2092052,
  longitude: -49.6401091,
})

// No use case
throw new MaxDistanceError()
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo opcional na criacao | `string \| null` (nao `string \| undefined`) |
| Campo opcional em update | `string \| null \| undefined` (3 estados) |
| Use case sem regra de negocio | Implemente mesmo assim, porque regras virao depois |
| Prisma Decimal no in-memory | `new Prisma.Decimal(value.toString())` |
| Teste precisa de entidade com ID fixo | Passe `id` no create do repositorio |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `throw new Error('generico')` | `throw new MaxDistanceError()` |
| `this.items.push({ ... })` no teste | `await repository.create({ ... })` |
| `description?: string` (opcional) | `description: string \| null` (nulavel) |
| `latitude: data.latitude` no in-memory | `latitude: new Prisma.Decimal(data.latitude.toString())` |
| ID sempre `randomUUID()` | `data.id ?? randomUUID()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
