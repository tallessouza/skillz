---
name: rs-next-js-logica-periodos
description: "Applies time-period grouping patterns when organizing scheduled data into morning/afternoon/evening sections in TypeScript/Next.js. Use when user asks to 'group by period', 'separate by time of day', 'organize appointments', 'split schedule into morning afternoon evening', or 'create period sections'. Enforces proper typing with union types for periods, deterministic period classification, and array filtering by category. Make sure to use this skill whenever grouping time-based data into day periods. Not for date range filtering, calendar views, or timezone conversion."
---

# Logica de Agrupamento por Periodos

> Ao agrupar dados por periodo do dia, crie tipos explicitos para os periodos, uma funcao deterministica de classificacao, e filtre o array transformado para cada categoria.

## Rules

1. **Defina um union type para os periodos** — `type AppointmentPeriod = 'morning' | 'afternoon' | 'evening'`, porque evita strings magicas espalhadas pelo codigo e habilita autocomplete
2. **Classifique com funcao pura** — `getPeriod(hour: number): Period` sem side effects, porque a logica de classificacao deve ser testavel e reutilizavel
3. **Transforme antes de filtrar** — primeiro faca `map` adicionando o campo `period`, depois `filter` por cada periodo, porque evita recalcular a classificacao multiplas vezes
4. **Retorne estrutura tipada com metadados** — cada grupo deve ter `title`, `type`, `timeRange` e `appointments`, porque o componente de UI precisa dessas informacoes sem logica adicional
5. **Formate horarios com toLocaleTimeString** — use `{ hour: '2-digit', minute: '2-digit' }` com locale `pt-BR`, porque garante formato consistente independente do ambiente

## How to write

### Union type para periodos

```typescript
export type AppointmentPeriod = 'morning' | 'afternoon' | 'evening'

export type AppointmentPeriodDay = {
  title: string
  type: AppointmentPeriod
  timeRange: string
  appointments: Appointment[]
}
```

### Funcao de classificacao por hora

```typescript
function getPeriod(hour: number): AppointmentPeriod {
  if (hour >= 9 && hour < 12) return 'morning'
  if (hour >= 13 && hour < 18) return 'afternoon'
  return 'evening'
}
```

### Transformacao e agrupamento

```typescript
function groupAppointmentsByPeriod(
  appointments: AppointmentPrisma[]
): AppointmentPeriodDay[] {
  const transformed: Appointment[] = appointments.map((apt) => ({
    ...apt,
    time: apt.schedule.scheduleAt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    service: apt.description,
    period: getPeriod(apt.schedule.scheduleAt.getHours()),
  }))

  const morning = transformed.filter((apt) => apt.period === 'morning')
  const afternoon = transformed.filter((apt) => apt.period === 'afternoon')
  const evening = transformed.filter((apt) => apt.period === 'evening')

  return [
    { title: 'Manhã', type: 'morning', timeRange: '09:00 - 12:00', appointments: morning },
    { title: 'Tarde', type: 'afternoon', timeRange: '13:00 - 18:00', appointments: afternoon },
    { title: 'Noite', type: 'evening', timeRange: '19:00 - 21:00', appointments: evening },
  ]
}
```

## Example

**Before (logica misturada no componente):**
```typescript
// Sem tipagem, filtragem repetida, strings magicas
const morning = appointments.filter(a => {
  const h = new Date(a.time).getHours()
  return h >= 9 && h < 12
})
// Repete a mesma logica para tarde e noite...
```

**After (com este skill aplicado):**
```typescript
// Tipagem explicita, funcao pura, transformacao unica
const periods = groupAppointmentsByPeriod(appointments)
// periods ja vem com title, type, timeRange e appointments filtrados
{periods.map((period, index) => (
  <PeriodSection key={index} {...period} />
))}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados vem do Prisma com relacoes | Crie tipo separado do Prisma para a UI, mapeie no `map` |
| Precisa exibir horario formatado | Use `toLocaleTimeString` no momento do map, nao no render |
| Componente recebe periodo como prop | Tipe a prop com o union type, nao com `string` |
| Faixas de horario podem mudar | Mantenha os ranges no array de retorno como metadado |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `period: string` | `period: AppointmentPeriod` |
| Filtrar array original 3x com logica de hora | Transformar uma vez, filtrar pelo campo `period` |
| `if (period === "morning")` em JSX | Iterar sobre o array de periodos com `map` |
| Hardcode de titulos no componente | Incluir `title` e `timeRange` na estrutura retornada |
| `new Date(x).getHours()` repetido | `getPeriod(date.getHours())` chamado uma vez no map |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-criando-logica-para-os-periodos/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-criando-logica-para-os-periodos/references/code-examples.md)
