---
name: rs-next-js-criando-select-data-01
description: "Generates time slot selection logic for scheduling forms in Next.js applications. Use when user asks to 'create a time picker', 'generate time slots', 'build scheduling form', 'add hour selection', or 'validate appointment times'. Applies patterns: generate time options outside render cycle, 30-min interval slots, past-time validation with date-fns, Zod refine for cross-field validation. Make sure to use this skill whenever building booking or scheduling features with time selection. Not for date picker components, calendar views, or timezone conversion logic."
---

# Select de Horarios para Agendamento

> Gere opcoes de horario fora do ciclo de renderizacao e valide que o horario selecionado nao esta no passado.

## Rules

1. **Gere time options fora do componente** — `const TIME_OPTIONS = generateTimeOptions()` no escopo do modulo, porque as opcoes sao estaticas e nao precisam ser recriadas a cada render
2. **Use intervalos de 30 minutos** — incremente minutos de 30 em 30 (`minutes += 30`), porque e o padrao de agendamento comercial
3. **Formate com padStart** — `hour.toString().padStart(2, '0')` para garantir formato `HH:mm` consistente
4. **Valide horario no passado com refine** — use `.refine()` do Zod para validacao cross-field (data + hora), porque validacoes simples nao conseguem comparar campos entre si
5. **Use date-fns para manipulacao** — `setHours` e `setMinutes` do date-fns para montar o datetime completo, porque manipulacao manual de datas e propensa a bugs
6. **Quebre o laco no fim do expediente** — quando `hour === 21 && minutes > 0`, de `break`, porque 21:00 e o ultimo horario valido

## How to write

### Gerador de opcoes de horario

```typescript
function generateTimeOptions(): string[] {
  const times: string[] = []

  for (let hour = 9; hour <= 21; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      if (hour === 21 && minutes > 0) break

      const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      times.push(timeString)
    }
  }

  return times
}

const TIME_OPTIONS = generateTimeOptions()
```

### Validacao Zod com refine

```typescript
const schema = z.object({
  scheduleAt: z.date(),
  time: z.string().min(1, 'A hora é obrigatória'),
}).refine((data) => {
  const [hour, minutes] = data.time.split(':')

  const scheduledDateTime = setMinutes(
    setHours(data.scheduleAt, Number(hour)),
    Number(minutes)
  )

  return scheduledDateTime > new Date()
}, {
  path: ['time'],
  message: 'O horário não pode ser no passado',
})
```

## Example

**Before (sem validacao temporal):**
```typescript
const schema = z.object({
  scheduleAt: z.date(),
  time: z.string().min(1),
})
// Permite agendar 09:00 de ontem — bug silencioso
```

**After (com refine validando passado):**
```typescript
const schema = z.object({
  scheduleAt: z.date(),
  time: z.string().min(1, 'A hora é obrigatória'),
}).refine((data) => {
  const [hour, minutes] = data.time.split(':')
  const scheduledDateTime = setMinutes(
    setHours(data.scheduleAt, Number(hour)),
    Number(minutes)
  )
  return scheduledDateTime > new Date()
}, {
  path: ['time'],
  message: 'O horário não pode ser no passado',
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Horario comercial padrao | 9h-21h, intervalos de 30min |
| Opcoes estaticas de time | Gere fora do componente, constante no modulo |
| Validacao entre campos do form | Use `.refine()` do Zod, nunca validacao inline |
| Formatacao de hora/minuto | `padStart(2, '0')` para garantir dois digitos |
| Componente de select nao existe | Instale via shadcn/ui: `npx shadcn-ui add select` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `useState` para gerar time options | `const TIME_OPTIONS = generateTimeOptions()` no escopo do modulo |
| `if (time < now)` com strings | `setHours`/`setMinutes` do date-fns + comparacao de Date |
| Hardcode de cada horario no JSX | Loop gerando array de strings `HH:mm` |
| Validacao de hora dentro do onChange | `.refine()` no schema Zod |
| `minutes++` (incremento de 1) | `minutes += 30` (intervalo comercial) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-criando-o-select-de-data-parte-01/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-criando-o-select-de-data-parte-01/references/code-examples.md)
