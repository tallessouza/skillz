# Code Examples: Select de Horarios para Agendamento

## Exemplo completo: generateTimeOptions

```typescript
function generateTimeOptions(): string[] {
  const times: string[] = []

  for (let hour = 9; hour <= 21; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      // Fim do expediente: 21:00 é o último horário
      if (hour === 21 && minutes > 0) break

      const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      times.push(timeString)
    }
  }

  return times
}

// Criado fora do componente — constante estática
const TIME_OPTIONS = generateTimeOptions()
```

**Saida gerada:**
```
["09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
 "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
 "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
 "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
 "21:00"]
```

## Exemplo completo: Schema Zod com refine

```typescript
import { z } from 'zod'
import { setHours, setMinutes } from 'date-fns'

const formSchema = z.object({
  description: z.string().min(1, 'A descrição é obrigatória'),
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

## Exemplo: Uso do Select no formulário

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// Dentro do Form component:
<FormField
  control={form.control}
  name="time"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Horário</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um horário" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {TIME_OPTIONS.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Variacao: Horarios customizaveis

```typescript
function generateTimeOptions(
  startHour: number = 9,
  endHour: number = 21,
  intervalMinutes: number = 30
): string[] {
  const times: string[] = []

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += intervalMinutes) {
      if (hour === endHour && minutes > 0) break

      const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      times.push(timeString)
    }
  }

  return times
}

// Clinica medica: 8h-18h, intervalos de 15min
const MEDICAL_TIMES = generateTimeOptions(8, 18, 15)

// Restaurante: 11h-23h, intervalos de 1h
const RESTAURANT_TIMES = generateTimeOptions(11, 23, 60)
```

## Variacao: Filtrar horarios ja ocupados

```typescript
function getAvailableTimeOptions(
  bookedTimes: string[],
  selectedDate: Date
): string[] {
  const now = new Date()
  const isToday = selectedDate.toDateString() === now.toDateString()

  return TIME_OPTIONS.filter((time) => {
    // Remove horarios ja agendados
    if (bookedTimes.includes(time)) return false

    // Se for hoje, remove horarios passados
    if (isToday) {
      const [hour, minutes] = time.split(':')
      const timeDate = setMinutes(
        setHours(selectedDate, Number(hour)),
        Number(minutes)
      )
      return timeDate > now
    }

    return true
  })
}
```