---
name: rs-next-js-criando-o-input-de-calendario
description: "Applies calendar input pattern with Popover, date-fns, and Zod validation in React Hook Form. Use when user asks to 'create a date picker', 'add calendar input', 'schedule form field', 'date selection component', or 'popover calendar'. Enforces: Zod date validation with min date, date-fns formatting, shadcn Popover+Calendar composition, disabled past dates. Make sure to use this skill whenever building date selection UI in Next.js or React forms. Not for time pickers, date range selectors, or standalone calendar views."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: calendar-input
  tags: [next-js, calendar, popover, date-fns, zod, react-hook-form, shadcn-ui]
---

# Input de Calendario com Popover

> Combine shadcn/ui Popover + Calendar + React Hook Form + Zod para criar inputs de data com validacao e UX profissional.

## Rules

1. **Valide datas no schema Zod** — use `z.date()` com `.min(startOfToday())` para impedir agendamentos no passado, porque validacao no schema e a ultima barreira antes do servidor
2. **Use date-fns para formatacao** — `format(date, "dd/MM/yyyy")` nao `toLocaleDateString()`, porque date-fns e consistente cross-browser e composavel
3. **Popover envolve o botao, nao o calendario** — `PopoverTrigger > Button`, `PopoverContent > Calendar`, porque o trigger define o que abre o popover
4. **Desabilite datas passadas no Calendar** — passe `disabled={(date) => date < startOfToday()}` como prop, porque a validacao visual deve espelhar a validacao do schema
5. **Mostre placeholder quando vazio** — exiba "Selecione uma data" quando `field.value` e undefined, porque feedback visual claro evita confusao
6. **Passe AsChild no PopoverTrigger** — para que o FormControl seja o elemento real do trigger, porque sem AsChild o Radix cria um wrapper extra que quebra acessibilidade

## How to write

### Schema Zod com validacao de data

```typescript
import { startOfToday } from "date-fns"
import { z } from "zod"

const appointmentFormSchema = z.object({
  // ... outros campos
  scheduleAt: z
    .date({ required_error: "A data é obrigatória" })
    .min(startOfToday(), { message: "A data não pode ser no passado" }),
})
```

### Campo de calendario no formulario

```tsx
import { format } from "date-fns"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

## Example

**Before (sem validacao, sem UX):**
```tsx
<input type="date" {...register("scheduleAt")} />
```

**After (com este skill aplicado):**
```tsx
// Schema com validacao
scheduleAt: z.date({ required_error: "A data é obrigatória" })
  .min(startOfToday(), { message: "A data não pode ser no passado" })

// UI com Popover + Calendar + formatacao date-fns
// (ver secao "How to write" acima para implementacao completa)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo de data em formulario | Popover + Calendar, nunca input type="date" nativo |
| Default value do campo | `undefined`, nao `new Date()` — usuario deve escolher |
| Formato de exibicao | `dd/MM/yyyy` para PT-BR |
| Componente reutilizavel em outra pagina | Extraia as props (mode, selected, onSelect, disabled) para facilitar reuso |
| Precisa instalar Calendar e Popover | `npx shadcn@latest add calendar popover` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `<input type="date">` em projeto shadcn | Popover + Calendar |
| Validar data so no frontend com JS puro | Zod schema com `.min(startOfToday())` |
| `new Date().toLocaleDateString()` | `format(date, "dd/MM/yyyy")` do date-fns |
| Permitir selecao de datas passadas | `disabled={(date) => date < startOfToday()}` |
| PopoverTrigger sem `asChild` com FormControl | `<PopoverTrigger asChild><FormControl>` |

## Troubleshooting

### Server Action nao executa ao submeter formulario
**Symptom:** Formulario submete mas nada acontece, sem erros no console
**Cause:** Action nao esta sendo passada corretamente ao form, ou falta "use server" no topo do arquivo de action
**Fix:** Garantir que a funcao de action tem `"use server"` no topo. Passar a action via atributo `action` do form: `<form action={minhaAction}>`

### Validacao de formulario nao mostra erros
**Symptom:** Dados invalidos sao submetidos sem feedback ao usuario
**Cause:** Validacao esta no servidor mas o retorno nao e tratado no cliente
**Fix:** Usar `useActionState` (React 19) para capturar o retorno da server action e exibir erros. Adicionar validacao client-side com Zod para feedback instantaneo

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-o-input-de-calendario/references/deep-explanation.md) — O instrutor escolhe compor dois componentes do shadcn/ui (Popover e Calendar) em vez de usar `<input
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-o-input-de-calendario/references/code-examples.md) — npx shadcn@latest add calendar
