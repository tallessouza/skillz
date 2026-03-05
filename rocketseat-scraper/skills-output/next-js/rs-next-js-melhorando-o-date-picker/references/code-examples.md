# Code Examples: DatePicker Dinamico com URL State

## Exemplo completo do componente

```typescript
"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { format, isValid, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

export function DatePickerSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get("date")

  const getInitialDate = useCallback(() => {
    if (!dateParam) return undefined

    const [year, month, day] = dateParam.split("-").map(Number)
    const parsedDate = new Date(year, month - 1, day)

    return isValid(parsedDate) ? parsedDate : new Date()
  }, [dateParam])

  const [date, setDate] = useState<Date | undefined>(getInitialDate)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // Sincronizar URL com estado local
  useEffect(() => {
    const newDate = getInitialDate()
    if (newDate && date?.getTime() !== newDate.getTime()) {
      setDate(newDate)
    }
  }, [getInitialDate, date])

  // Atualizar URL quando data muda
  function updateURLWithDate(selectedDate: Date | undefined) {
    if (!selectedDate) return
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("date", format(selectedDate, "yyyy-MM-dd"))
    router.push(`${pathname}?${newParams.toString()}`)
  }

  // Navegar entre dias
  function handleNavigateDay(days: number) {
    const newDate = addDays(date ?? new Date(), days)
    setDate(newDate)
    updateURLWithDate(newDate)
  }

  return (
    <div>
      <button onClick={() => handleNavigateDay(-1)}>←</button>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button>
            {date ? (
              format(date, "PPP", { locale: ptBR })
            ) : (
              <span>Selecione uma data</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate)
              updateURLWithDate(selectedDate)
              setIsPopoverOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>

      <button onClick={() => handleNavigateDay(1)}>→</button>
    </div>
  )
}
```

## Construcao do URLSearchParams

```typescript
// Preservar params existentes ao atualizar
const newParams = new URLSearchParams(searchParams.toString())
newParams.set("date", format(selectedDate, "yyyy-MM-dd"))

// Resultado: ?date=2025-09-08
// Se ja tinha outros params: ?category=dog&date=2025-09-08
router.push(`${pathname}?${newParams.toString()}`)
```

## Formatos de data do date-fns

```typescript
// Para URL (parseavel, padrao ISO-like)
format(date, "yyyy-MM-dd")       // "2025-09-08"

// Para exibicao amigavel em portugues
format(date, "PPP", { locale: ptBR })  // "8 de setembro de 2025"

// Outros formatos uteis
format(date, "dd/MM/yyyy")       // "08/09/2025"
format(date, "EEEE, d MMMM", { locale: ptBR })  // "segunda-feira, 8 setembro"
```

## Parseamento seguro de data da URL

```typescript
// URL: ?date=2025-09-08
const dateParam = searchParams.get("date")  // "2025-09-08"

// Split retorna strings
const parts = dateParam.split("-")  // ["2025", "09", "08"]

// .map(Number) converte para numeros
const [year, month, day] = parts.map(Number)  // [2025, 9, 8]

// CUIDADO: month - 1 porque JavaScript usa meses base-0
const parsedDate = new Date(year, month - 1, day)

// Sempre validar antes de usar
if (isValid(parsedDate)) {
  // Data valida, pode usar
} else {
  // Fallback para data atual
  return new Date()
}
```

## Server component que consome a URL automaticamente

```typescript
// page.tsx (server component) - rebusca quando URL muda
export default async function Home({ searchParams }: { searchParams: { date?: string } }) {
  const date = searchParams.date ?? format(new Date(), "yyyy-MM-dd")

  const appointments = await prisma.appointment.findMany({
    where: { date },
  })

  return (
    <>
      <DatePickerSearch />
      <AppointmentList appointments={appointments} />
    </>
  )
}
```