# Code Examples: Criando o DatePicker

## Estrutura de pastas

```
components/
  DatePicker/
    index.tsx        # Componente principal exportado
    DatePicker.tsx   # Implementacao interna (opcional)
```

## Componente completo (estado da aula)

```tsx
// components/DatePicker/index.tsx
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  className?: string
}

export const DatePicker = ({ className }: DatePickerProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Botao navegacao para tras */}
      <Button variant="outline">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Popover com calendario */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[180px]"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-content-brand" />
              <span>Selecione uma data</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {/* Calendar component sera adicionado na proxima aula */}
        </PopoverContent>
      </Popover>

      {/* Botao navegacao para frente */}
      <Button variant="outline">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

## Uso na Home com responsividade

```tsx
// app/page.tsx
import { DatePicker } from "@/components/DatePicker"

export default function Home() {
  return (
    <main>
      {/* Header com DatePicker no desktop */}
      <div className="flex items-center gap-4">
        <div>
          <h1>Agendamentos</h1>
          <p>Gerencie os agendamentos do pet shop</p>
        </div>
        {/* Aparece apenas em telas maiores */}
        <DatePicker className="hidden md:flex" />
      </div>

      {/* DatePicker no mobile (abaixo do header) */}
      <DatePicker className="mt-3 mb-8 flex md:hidden" />

      {/* Resto do conteudo da pagina */}
    </main>
  )
}
```

## Futuro: componente ArrowButton reutilizavel

```tsx
// Componente que sera extraido para evitar duplicacao
interface ArrowButtonProps {
  direction: "left" | "right"
  onClick: () => void
}

const ArrowButton = ({ direction, onClick }: ArrowButtonProps) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight
  return (
    <Button variant="outline" onClick={onClick}>
      <Icon className="h-4 w-4" />
    </Button>
  )
}
```

## Padrao de estilizacao dos icones

```tsx
// Icone principal (acao primaria) — cor da marca
<Calendar className="h-4 w-4 text-content-brand" />

// Icone indicador (acao secundaria) — opacity reduzida
<ChevronDown className="h-4 w-4 opacity-50" />

// Icone de navegacao (botao standalone) — cor padrao
<ChevronLeft className="h-4 w-4" />
```