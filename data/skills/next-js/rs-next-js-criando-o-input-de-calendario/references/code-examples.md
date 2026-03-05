# Code Examples: Criando o Input de Calendario

## Instalacao dos componentes necessarios

```bash
npx shadcn@latest add calendar
npx shadcn@latest add popover
```

## Schema Zod completo do formulario

```typescript
import { startOfToday } from "date-fns"
import { z } from "zod"

export const appointmentFormSchema = z.object({
  tutor: z.string().min(1, "O tutor é obrigatório"),
  pet: z.string().min(1, "O pet é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  scheduleAt: z
    .date({ required_error: "A data é obrigatória" })
    .min(startOfToday(), { message: "A data não pode ser no passado" }),
})
```

## Default values do formulario

```typescript
const form = useForm<z.infer<typeof appointmentFormSchema>>({
  resolver: zodResolver(appointmentFormSchema),
  defaultValues: {
    tutor: "",
    pet: "",
    phone: "",
    description: "",
    scheduleAt: undefined,
  },
})
```

## Imports necessarios para o componente

```typescript
import { format } from "date-fns"
import { startOfToday } from "date-fns"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
```

## FormField completo do calendario

```tsx
<FormField
  control={form.control}
  name="scheduleAt"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Data</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {field.value ? (
                  format(field.value, "dd/MM/yyyy")
                ) : (
                  <span>Selecione uma data</span>
                )}
              </div>
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => date < startOfToday()}
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Props do Calendar explicadas

```tsx
<Calendar
  mode="single"          // Selecao unica (nao range, nao multiple)
  selected={field.value}  // Data atualmente selecionada (controlado pelo form)
  onSelect={field.onChange} // Callback que atualiza o React Hook Form
  disabled={(date) =>      // Funcao que recebe cada data e retorna boolean
    date < startOfToday()  // true = desabilitada (nao clicavel)
  }
/>
```

## Customizacao do Calendar (sobrescrita de estilos)

O instrutor menciona que apos instalar o Calendar do shadcn, ele sobrescreve os estilos no arquivo do componente (`components/ui/calendar.tsx`). Isso e o padrao shadcn: os componentes sao copiados para seu projeto e voce tem controle total para customizar.

## Variacao: Calendar para visualizacao (mencionado pelo instrutor)

```tsx
// Mesmo componente, props diferentes — para pagina de visualizacao
<Calendar
  mode="single"
  selected={appointment.scheduleAt}
  // Sem onSelect — somente leitura
  disabled // Todo o calendario desabilitado
/>
```