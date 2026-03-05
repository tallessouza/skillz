# Code Examples: Datas em Producao (Next.js)

## 1. Funcao formatDateTime completa

```typescript
// utils/appointment-utils.ts (ou similar)
export function formatDateTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  })
}
```

**Pontos criticos:**
- O metodo e `toLocaleTimeString` (nao `toLocaleDateString`)
- O locale e `'pt-BR'` (com hifen, maiusculas)
- O timezone e `'America/Sao_Paulo'` (com underline)

## 2. Uso em server action (create)

```typescript
import { formatDateTime } from '@/utils/appointment-utils'

// Dentro da server action de criacao
const hour = parseInt(formatDateTime(scheduledAt))
```

## 3. Uso em server action (update)

```typescript
import { formatDateTime } from '@/utils/appointment-utils'

// Dentro da server action de atualizacao
const hour = parseInt(formatDateTime(scheduledAt))
```

## 4. Uso em agrupamento por periodo

```typescript
import { formatDateTime } from '@/utils/appointment-utils'

function groupAppointmentByPeriod(appointments: Appointment[]) {
  // Para exibicao do horario
  const time = formatDateTime(apt.scheduledAt)

  // Para classificacao de periodo
  const hour = parseInt(formatDateTime(apt.scheduledAt))
  // hour < 12 = manha, hour >= 12 = tarde
}
```

## 5. Antes vs Depois — Server Action

**Antes (quebra em producao):**
```typescript
// actions.ts
export async function createAppointment(data: FormData) {
  const scheduledAt = new Date(data.get('date') as string)
  const hour = scheduledAt.getHours()    // Retorna hora do SERVIDOR
  const minutes = scheduledAt.getMinutes()
  // ...
}
```

**Depois (funciona em qualquer ambiente):**
```typescript
// actions.ts
import { formatDateTime } from '@/utils/appointment-utils'

export async function createAppointment(data: FormData) {
  const scheduledAt = new Date(data.get('date') as string)
  const hour = parseInt(formatDateTime(scheduledAt))  // Sempre America/Sao_Paulo
  // ...
}
```

## 6. Antes vs Depois — Agrupamento

**Antes:**
```typescript
function groupAppointmentByPeriod(appointments: Appointment[]) {
  const time = `${apt.scheduledAt.getHours()}:${apt.scheduledAt.getMinutes()}`
  const period = apt.scheduledAt.getHours() < 12 ? 'morning' : 'afternoon'
}
```

**Depois:**
```typescript
function groupAppointmentByPeriod(appointments: Appointment[]) {
  const time = formatDateTime(apt.scheduledAt)
  const period = parseInt(formatDateTime(apt.scheduledAt)) < 12 ? 'morning' : 'afternoon'
}
```

## 7. Ajuste de set no appointment form (client side)

O instrutor mostra que no appointment form, onde se faz `setHours`/`setMinutes`, tambem e preciso ter cuidado. A abordagem em duas etapas:

```typescript
// Etapa 1: ajustar a hora
const dateWithHour = new Date(selectedDate)
dateWithHour.setUTCHours(parseInt(selectedHour))

// Etapa 2: ajustar os minutos
dateWithHour.setUTCMinutes(parseInt(selectedMinute))

setScheduledAt(dateWithHour)
```

Usando `setUTCHours`/`setUTCMinutes` ao inves de `setHours`/`setMinutes` para consistencia.

## 8. Uso opcional de date-fns com locale

```typescript
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const formatted = format(date, "HH:mm", { locale: ptBR })
```

O instrutor menciona que nao foi necessario no projeto, mas e recomendado para aplicacoes mais complexas com multiplos fusos.

## 9. Ajuste visual com gap

```tsx
// page.tsx — container entre titulo e date picker
<div className="flex flex-col gap-4">
  <h1>Titulo</h1>
  <p>Subtitulo</p>
</div>
```

Substituir `margin-bottom` individual por `gap` no container pai — 16px (`gap-4` no Tailwind).