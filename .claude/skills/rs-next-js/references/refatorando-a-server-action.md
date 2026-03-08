---
name: rs-next-js-refatorando-server-action
description: "Applies DRY refactoring patterns for Next.js Server Actions when duplicated logic exists across create/update operations. Use when user asks to 'refactor server action', 'remove duplicated logic', 'extract shared validation', 'DRY up create and update', or 'organize server action code'. Enforces extract-function-first over class/entity abstractions for simple cases. Make sure to use this skill whenever refactoring Next.js server actions or extracting shared logic from CRUD operations. Not for API route handlers, client-side state management, or database query optimization."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: server-actions-refactoring
  tags: [next-js, server-actions, refactoring, dry, extract-function, pure-functions, crud]
---

# Refatorando Server Actions

> Extraia logica duplicada entre server actions de create e update em funcoes puras, preferindo a abordagem mais simples que resolve o problema.

## Rules

1. **Identifique duplicacao entre create e update** — se a mesma logica aparece em ambas as actions, extraia para uma funcao, porque mudancas futuras precisam refletir em ambos os lugares
2. **Prefira funcao pura sobre classe/entity** — para logica simples (< 20 linhas), uma funcao que recebe input e retorna resultado e suficiente, porque classe seria overengineering
3. **Coloque a funcao perto do uso** — se a funcao so e usada no arquivo de actions, mantenha no mesmo arquivo ou em um utils proximo, porque o motivo de mudanca e o mesmo
4. **Retorne um objeto desestruturavel** — a funcao extraida deve retornar um objeto com propriedades nomeadas para facilitar o consumo via destructuring
5. **Mova para utils apenas quando justificado** — se ja existe um arquivo utils do dominio (ex: `appointment-utils.ts`), e um candidato natural, mas nao crie um arquivo novo so por uma funcao pequena

## How to write

### Funcao extraida de Server Action

```typescript
// Funcao pura que encapsula logica compartilhada
function calculatePeriods(hour: number) {
  const isMorning = hour >= 9 && hour < 12
  const isAfternoon = hour >= 13 && hour < 18
  const isEvening = hour >= 18 && hour < 21

  return { isMorning, isAfternoon, isEvening }
}
```

### Consumo via destructuring na action

```typescript
// Em createAppointment e updateAppointment
const { isMorning, isAfternoon, isEvening } = calculatePeriods(hour)
```

### Organizacao em utils (quando aplicavel)

```typescript
// src/app/appointments/appointment-utils.ts
export function calculatePeriods(hour: number) {
  const isMorning = hour >= 9 && hour < 12
  const isAfternoon = hour >= 13 && hour < 18
  const isEvening = hour >= 18 && hour < 21

  return { isMorning, isAfternoon, isEvening }
}
```

## Example

**Before (logica duplicada em create e update):**

```typescript
// actions.ts
async function createAppointment(data: AppointmentInput) {
  const hour = data.time.getHours()
  const isMorning = hour >= 9 && hour < 12
  const isAfternoon = hour >= 13 && hour < 18
  const isEvening = hour >= 18 && hour < 21

  if (!isMorning && !isAfternoon && !isEvening) {
    throw new Error("Horario indisponivel")
  }
  // ... create logic
}

async function updateAppointment(id: string, data: AppointmentInput) {
  const hour = data.time.getHours()
  const isMorning = hour >= 9 && hour < 12
  const isAfternoon = hour >= 13 && hour < 18
  const isEvening = hour >= 18 && hour < 21

  if (!isMorning && !isAfternoon && !isEvening) {
    throw new Error("Horario indisponivel")
  }
  // ... update logic
}
```

**After (com funcao extraida):**

```typescript
// actions.ts
function calculatePeriods(hour: number) {
  const isMorning = hour >= 9 && hour < 12
  const isAfternoon = hour >= 13 && hour < 18
  const isEvening = hour >= 18 && hour < 21

  return { isMorning, isAfternoon, isEvening }
}

async function createAppointment(data: AppointmentInput) {
  const { isMorning, isAfternoon, isEvening } = calculatePeriods(data.time.getHours())

  if (!isMorning && !isAfternoon && !isEvening) {
    throw new Error("Horario indisponivel")
  }
  // ... create logic
}

async function updateAppointment(id: string, data: AppointmentInput) {
  const { isMorning, isAfternoon, isEvening } = calculatePeriods(data.time.getHours())

  if (!isMorning && !isAfternoon && !isEvening) {
    throw new Error("Horario indisponivel")
  }
  // ... update logic
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Logica duplicada < 20 linhas | Extraia funcao pura no mesmo arquivo |
| Ja existe arquivo utils do dominio | Mova para la e exporte |
| Logica complexa com estado | Considere classe/entity em `src/entities/` |
| Funcao usada em 3+ arquivos | Mova para utils compartilhado |
| Unica server action sem duplicacao | Nao extraia — evite abstracao prematura |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Classe com construtor para 3 comparacoes | Funcao pura que retorna objeto |
| Arquivo `utils/periods.ts` para uma funcao de 5 linhas | Funcao no mesmo arquivo da action |
| Logica inline repetida em create e update | Funcao compartilhada com destructuring |
| `export default class Appointment` para validacao simples | `export function calculatePeriods()` |

## Troubleshooting

### Server Action nao executa ao submeter formulario
**Symptom:** Formulario submete mas nada acontece, sem erros no console
**Cause:** Action nao esta sendo passada corretamente ao form, ou falta "use server" no topo do arquivo de action
**Fix:** Garantir que a funcao de action tem `"use server"` no topo. Passar a action via atributo `action` do form: `<form action={minhaAction}>`

### Validacao de formulario nao mostra erros
**Symptom:** Dados invalidos sao submetidos sem feedback ao usuario
**Cause:** Validacao esta no servidor mas o retorno nao e tratado no cliente
**Fix:** Usar `useActionState` (React 19) para capturar o retorno da server action e exibir erros. Adicionar validacao client-side com Zod para feedback instantaneo

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-refatorando-a-server-action/references/deep-explanation.md) — O instrutor identifica um problema classico: a mesma logica de validacao de horarios aparece tanto n
- [code-examples.md](../../../data/skills/next-js/rs-next-js-refatorando-a-server-action/references/code-examples.md) — // Pode ficar em actions.ts ou em appointment-utils.ts
