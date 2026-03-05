# Code Examples: Select de Horario com React Hook Form

## Exemplo completo do formulario com campo de horario

```tsx
import { Clock } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

// Geracao do array de horarios (9h-21h)
const timeOptions = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 9
  return `${hour.toString().padStart(2, "0")}:00`
})

// Dentro do componente de formulario:
<FormField
  control={form.control}
  name="time"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Hora</FormLabel>
      <FormControl>
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Selecione um horário" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
    </FormItem>
  )}
/>
```

## Variacao: horarios com intervalos de 30 minutos

```tsx
const timeOptions = Array.from({ length: 25 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9
  const minutes = i % 2 === 0 ? "00" : "30"
  return `${hour.toString().padStart(2, "0")}:${minutes}`
})
// ["09:00", "09:30", "10:00", "10:30", ..., "21:00"]
```

## Variacao: Select com horarios filtrados (indisponiveis desabilitados)

```tsx
const unavailableTimes = ["12:00", "13:00"]

<SelectContent>
  {timeOptions.map((time) => (
    <SelectItem
      key={time}
      value={time}
      disabled={unavailableTimes.includes(time)}
    >
      {time}
    </SelectItem>
  ))}
</SelectContent>
```

## Schema Zod correspondente

```tsx
import { z } from "zod"

const bookingSchema = z.object({
  // ... outros campos
  time: z.string().min(1, "Selecione um horário"),
})
```

## Comparacao: Select vs Input type="time"

```tsx
// NAO usar — estilo inconsistente, sem controle visual
<input type="time" {...field} />

// USAR — componente consistente com o design system
<Select onValueChange={field.onChange} value={field.value}>
  {/* ... */}
</Select>
```

## Padrao de icone no trigger (reutilizavel)

```tsx
// Mesmo padrao para qualquer Select com icone
<SelectTrigger>
  <div className="flex items-center gap-2">
    <IconComponent className="h-4 w-4 text-muted-foreground" />
    <SelectValue placeholder="Placeholder aqui" />
  </div>
</SelectTrigger>
```