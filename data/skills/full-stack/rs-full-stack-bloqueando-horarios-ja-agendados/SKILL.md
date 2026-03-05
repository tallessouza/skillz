---
name: rs-full-stack-bloqueando-horarios-agendados
description: "Enforces time slot blocking logic when building scheduling systems in JavaScript/TypeScript. Use when user asks to 'block booked hours', 'prevent double booking', 'filter available time slots', 'build a scheduling system', or 'validate appointment availability'. Applies includes() for occupied-slot checking and isBefore() for past-time filtering with AND logic. Make sure to use this skill whenever implementing appointment or booking availability logic. Not for calendar UI rendering, date picker styling, or backend API design."
---

# Bloqueando Horários Já Agendados

> Ao construir disponibilidade de horários, combine verificação de ocupação (includes) com verificação temporal (isBefore) usando AND — ambas condições devem ser verdadeiras para o horário estar disponível.

## Rules

1. **Extraia apenas os horários dos agendamentos** — use `map` + `dayjs().format("HH:mm")` para transformar objetos de agendamento em array simples de strings de horário, porque a comparação com `includes` precisa de formato idêntico
2. **Use `includes` para verificar ocupação** — `!unavailableHours.includes(hour)` retorna true se o horário está livre, porque é legível e expressa a intenção diretamente
3. **Use AND (`&&`), nunca OR (`||`)** — disponível = não está ocupado AND não está no passado, porque OR tornaria TODOS os horários disponíveis se apenas uma condição fosse true
4. **Negue as condições bloqueantes** — `!includes` e `!isBefore` expressam "está disponível", porque a lógica positiva facilita a leitura
5. **Passe os agendamentos para a função de carregamento** — a função que monta horários precisa receber a lista de agendamentos como parâmetro, porque ela precisa dos dados para filtrar

## How to write

### Extrair horários ocupados

```javascript
// Transforma agendamentos em lista simples de horários "HH:mm"
const unavailableHours = dailySchedules.map((schedule) =>
  dayjs(schedule.when).format("HH:mm")
)
```

### Determinar disponibilidade com dupla verificação

```javascript
// Disponível = não ocupado AND não no passado
const available =
  !unavailableHours.includes(hour) && !dayjs(hour).isBefore(dayjs())
```

## Example

**Before (sem bloqueio — permite agendamento duplicado):**

```javascript
function hoursLoad(date) {
  hoursList.innerHTML = ""
  hours.forEach((hour) => {
    const isHourPast = dayjs(hour).isBefore(dayjs())
    hoursList.innerHTML += `<li class="hour ${isHourPast ? "unavailable" : ""}">${hour}</li>`
  })
}
```

**After (com bloqueio de horários ocupados):**

```javascript
function hoursLoad(date, dailySchedules) {
  hoursList.innerHTML = ""

  // Obtém lista de horários ocupados
  const unavailableHours = dailySchedules.map((schedule) =>
    dayjs(schedule.when).format("HH:mm")
  )

  hours.forEach((hour) => {
    const isBefore = dayjs(hour).isBefore(dayjs())
    const available = !unavailableHours.includes(hour) && !isBefore

    hoursList.innerHTML += `<li class="hour ${available ? "" : "unavailable"}">${hour}</li>`
  })
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Agendamentos vêm como objetos com data+hora | `map` para extrair só "HH:mm" antes de comparar |
| Precisa verificar disponibilidade | Combine ocupação + tempo passado com `&&` |
| Lista de horários não atualiza | Limpe `innerHTML` antes de recarregar |
| Novo dado de agendamento disponível | Passe como parâmetro para a função de horários |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `available = !includes(hour) \|\| !isBefore` | `available = !includes(hour) && !isBefore` |
| Comparar objeto inteiro de agendamento | Extrair hora formatada com `dayjs().format("HH:mm")` |
| Verificar só passado sem verificar ocupação | Verificar ambas condições |
| Hardcodar horários ocupados | Receber agendamentos da API como parâmetro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre lógica booleana AND vs OR e o bug clássico
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações