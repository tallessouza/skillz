# Code Examples: Adicionando o Calendar

## Estrutura completa do DatePicker com Calendar

```tsx
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isOpen, setOpen] = useState(false)
  const [date, setDate] = useState<Date>(new Date())

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      
      // Atualiza URL com a data selecionada
      const params = new URLSearchParams(searchParams.toString())
      params.set("date", format(selectedDate, "yyyy-MM-dd"))
      router.push(`?${params.toString()}`)
    }
    
    // Fecha o popover apos selecao
    setOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button>
          <CalendarIcon className="size-4" />
          {format(date, "dd 'de' MMMM", { locale: ptBR })}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 border-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          autoFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  )
}
```

## Handler de selecao — detalhamento

```tsx
// O handler recebe Date | undefined porque o usuario pode "deselecionar"
const handleDateSelect = (selectedDate: Date | undefined) => {
  // Só atualiza se uma data foi de fato selecionada
  if (selectedDate) {
    setDate(selectedDate)
    
    // Monta novos searchParams preservando os existentes
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", format(selectedDate, "yyyy-MM-dd"))
    router.push(`?${params.toString()}`)
  }
  
  // Sempre fecha o popover (mesmo se clicou fora)
  setOpen(false)
}
```

## Calendar props explicadas

```tsx
<Calendar
  mode="single"        // Selecao de uma unica data (vs "range" ou "multiple")
  selected={date}      // Controlled: data vem do estado externo
  onSelect={handler}   // Controlled: handler atualiza estado + URL
  autoFocus            // Foca automaticamente ao abrir o popover
  locale={ptBR}        // Nomes dos meses/dias em portugues
/>
```

## PopoverContent — ajustes visuais

```tsx
// ANTES: com borda e padding padrao (desalinhado)
<PopoverContent>
  <Calendar ... />
</PopoverContent>

// DEPOIS: sem borda, sem padding, largura automatica
<PopoverContent className="w-auto p-0 border-0">
  <Calendar ... />
</PopoverContent>
```

## Formatacao de data para exibicao

```tsx
// Formato brasileiro usado no trigger do DatePicker
format(date, "dd 'de' MMMM", { locale: ptBR })
// Resultado: "16 de Janeiro"

// Formato para URL (ISO-like, parseavel)
format(selectedDate, "yyyy-MM-dd")
// Resultado: "2024-01-16"
```

## Controle duplo de estado (Popover + Calendar)

```tsx
// Dois estados independentes mas coordenados:
const [isOpen, setOpen] = useState(false)   // Popover aberto/fechado
const [date, setDate] = useState<Date>(new Date())  // Data selecionada

// O handler coordena ambos:
// 1. Atualiza date (Calendar)
// 2. Fecha popover (setOpen false)
// 3. Atualiza URL (router.push)
```