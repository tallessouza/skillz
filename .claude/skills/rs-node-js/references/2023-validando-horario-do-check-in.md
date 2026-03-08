---
name: rs-node-js-2023-validando-horario-check-in
description: "Enforces TDD workflow for time-based business rule validation in Node.js applications. Use when user asks to 'add a time constraint', 'validate expiration', 'implement time-based rule', 'add TDD test for dates', or 'check-in validation'. Applies red-green-refactor with Vitest date mocking and Day.js diff calculations. Make sure to use this skill whenever adding time-based validation rules to existing features using TDD. Not for cron jobs, scheduling systems, or timezone conversion logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: validacao-temporal-tdd
  tags: [tdd, dayjs, fake-timers, vitest, time-validation, business-rules, mocking]
---

# Validacao de Regras de Negocio Temporais com TDD

> Ao adicionar regras de negocio baseadas em tempo a features existentes, escreva o teste primeiro usando mocking de datas, implemente a validacao, e refatore.

## Rules

1. **Teste antes da implementacao** — escreva o teste que falha primeiro (red), implemente para passar (green), refatore (refactor), porque TDD brilha especialmente ao adicionar regras de negocio a features ja existentes
2. **Sempre mocke datas em testes** — use `vi.useFakeTimers()` e `vi.setSystemTime()` do Vitest, porque datas reais causam falsos positivos dependendo do horario de execucao
3. **Avance tempo com `advanceTimersByTime`** — em vez de setar nova data manualmente, avance milissegundos para simular passagem de tempo, porque expressa melhor a intencao do teste
4. **Nomeie constantes de tempo** — `const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21` nao `1260000`, porque numeros magicos sao ilegíveis
5. **Nomeie variaveis de distancia pelo significado completo** — `distanceInMinutesFromCheckInCreation` nao `diff` ou `minutes`, porque quem der manutencao entende instantaneamente
6. **Use Day.js diff com data passada como parametro** — `dayjs(now).diff(createdAt, 'minutes')` retorna positivo, porque evita necessidade de `Math.abs()`
7. **Crie erros especificos por regra de negocio** — `LateCheckInValidationError` nao `new Error('invalid')`, porque permite tratamento granular no handler HTTP

## How to write

### Teste com mocking de datas (Vitest)

```typescript
// Habilite fake timers no beforeEach e restaure no afterEach
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('should not be able to validate after 20 minutes of creation', async () => {
  vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

  const createdCheckIn = await checkInsRepository.create({
    gym_id: 'gym-01',
    user_id: 'user-01',
  })

  const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21
  vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)

  await expect(() =>
    sut.execute({ checkInId: createdCheckIn.id }),
  ).rejects.toBeInstanceOf(LateCheckInValidationError)
})
```

### Validacao temporal no use case

```typescript
import dayjs from 'dayjs'

const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
  checkIn.created_at,
  'minutes',
)

if (distanceInMinutesFromCheckInCreation > 20) {
  throw new LateCheckInValidationError()
}
```

## Example

**Before (sem validacao temporal):**
```typescript
async execute({ checkInId }: ValidateCheckInRequest) {
  const checkIn = await this.checkInsRepository.findById(checkInId)
  if (!checkIn) throw new ResourceNotFoundError()

  checkIn.validated_at = new Date()
  await this.checkInsRepository.save(checkIn)
  return { checkIn }
}
```

**After (com validacao temporal via TDD):**
```typescript
async execute({ checkInId }: ValidateCheckInRequest) {
  const checkIn = await this.checkInsRepository.findById(checkInId)
  if (!checkIn) throw new ResourceNotFoundError()

  const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
    checkIn.created_at,
    'minutes',
  )

  if (distanceInMinutesFromCheckInCreation > 20) {
    throw new LateCheckInValidationError()
  }

  checkIn.validated_at = new Date()
  await this.checkInsRepository.save(checkIn)
  return { checkIn }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Adicionando regra temporal a feature existente | TDD: teste primeiro, implemente depois |
| Teste compara datas | Sempre use fake timers |
| Precisa simular passagem de tempo | `advanceTimersByTime` em vez de `setSystemTime` duas vezes |
| Calculo de diferenca entre datas | Day.js `diff()` com data passada como parametro |
| Limite temporal da regra de negocio | Constante nomeada com unidade (`IN_MS`, `IN_MINUTES`) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `const diff = date1 - date2` | `const distanceInMinutesFromCreation = dayjs(now).diff(createdAt, 'minutes')` |
| `1260000` (numero magico) | `const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21` |
| `throw new Error('too late')` | `throw new LateCheckInValidationError()` |
| `dayjs(createdAt).diff(new Date())` (retorna negativo) | `dayjs(new Date()).diff(createdAt, 'minutes')` (retorna positivo) |
| Testar datas sem mock | `vi.useFakeTimers()` + `vi.setSystemTime()` |

## Troubleshooting

### Teste de validacao temporal passa mesmo quando nao deveria
**Symptom:** Teste com `advanceTimersByTime(21min)` nao lanca `LateCheckInValidationError`
**Cause:** `vi.useFakeTimers()` nao foi chamado no `beforeEach`, entao `advanceTimersByTime` nao afeta `new Date()` dentro do use case
**Fix:** Adicione `vi.useFakeTimers()` no `beforeEach` e `vi.useRealTimers()` no `afterEach` para garantir que o mock de tempo esta ativo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
