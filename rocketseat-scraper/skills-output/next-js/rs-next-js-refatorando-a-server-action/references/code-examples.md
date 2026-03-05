# Code Examples: Refatorando Server Actions

## Exemplo completo da aula

### Funcao calculatePeriods extraida

```typescript
// Pode ficar em actions.ts ou em appointment-utils.ts
function calculatePeriods(hour: number) {
  const isMorning = hour >= 9 && hour < 12
  const isAfternoon = hour >= 13 && hour < 18
  const isEvening = hour >= 18 && hour < 21

  return { isMorning, isAfternoon, isEvening }
}
```

### Uso na createAppointment

```typescript
async function createAppointment(data: AppointmentInput) {
  const hour = data.time.getHours()
  const { isMorning, isAfternoon, isEvening } = calculatePeriods(hour)

  if (!isMorning && !isAfternoon && !isEvening) {
    return { error: "Agendamento não pode ser feito neste horário" }
  }

  // ... resto da logica de criacao
}
```

### Uso na updateAppointment

```typescript
async function updateAppointment(id: string, data: AppointmentInput) {
  const hour = data.time.getHours()
  const { isMorning, isAfternoon, isEvening } = calculatePeriods(hour)

  if (!isMorning && !isAfternoon && !isEvening) {
    return { error: "Agendamento não pode ser feito neste horário" }
  }

  // ... resto da logica de atualizacao
}
```

### Versao movida para utils

```typescript
// src/app/appointments/appointment-utils.ts
export function calculatePeriods(hour: number) {
  const isMorning = hour >= 9 && hour < 12
  const isAfternoon = hour >= 13 && hour < 18
  const isEvening = hour >= 18 && hour < 21

  return { isMorning, isAfternoon, isEvening }
}
```

```typescript
// src/app/appointments/actions.ts
import { calculatePeriods } from "./appointment-utils"

// Uso identico em ambas as actions
```

## Variacao: classe Entity (mencionada mas descartada)

O instrutor menciona esta abordagem como alternativa para casos mais complexos:

```typescript
// src/entities/appointment.ts — NAO usado neste caso
class Appointment {
  public isMorning: boolean
  public isAfternoon: boolean
  public isEvening: boolean

  constructor(hour: number) {
    this.isMorning = hour >= 9 && hour < 12
    this.isAfternoon = hour >= 13 && hour < 18
    this.isEvening = hour >= 18 && hour < 21
  }

  isValidPeriod(): boolean {
    return this.isMorning || this.isAfternoon || this.isEvening
  }
}
```

**Por que foi descartada:** overengineering para 3 comparacoes booleanas. Uma funcao pura resolve o mesmo problema com menos codigo e sem estado.

## Cenarios de teste validados na aula

| Input (hora) | isMorning | isAfternoon | isEvening | Agendamento valido? |
|--------------|-----------|-------------|-----------|---------------------|
| 10 | true | false | false | Sim |
| 12 | false | false | false | Nao |
| 12:30 | false | false | false | Nao |
| 13 | false | true | false | Sim |
| 18 | false | false | true | Sim |
| 18:30 | false | false | true | Sim |
| 19 | false | false | true | Sim |
| 21 | false | false | false | Nao |

**Nota:** A funcao `getHours()` retorna inteiro, entao 12:30 retorna 12 (que nao cai em nenhum periodo valido). O intervalo 18-21 inclui 18 e exclui 21.