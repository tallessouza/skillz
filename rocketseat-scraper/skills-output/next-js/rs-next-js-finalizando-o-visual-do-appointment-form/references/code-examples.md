# Code Examples: Finalizando o Visual do Appointment Form

## Exemplo 1: Div wrapper para campos responsivos

```tsx
// Campos time e scheduleAt agrupados
<div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
  <FormField
    name="time"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Horário</FormLabel>
        <FormControl>
          <Input placeholder="Selecione o horário" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="scheduleAt"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Data</FormLabel>
        <FormControl>
          <Input type="date" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>
```

## Exemplo 2: Botao de submit completo

```tsx
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dentro do componente do form:
const { formState: { isSubmitting } } = form

// No JSX:
<div className="flex justify-end">
  <Button type="submit" variant="brand" disabled={isSubmitting}>
    {isSubmitting && (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    )}
    Agendar
  </Button>
</div>
```

## Exemplo 3: Default values completos

```tsx
const form = useForm({
  defaultValues: {
    name: "",
    email: "",
    phone: "",
    time: "",        // Campo que causava erro quando nao inicializado
    scheduleAt: "",
  },
})
```

## Exemplo 4: Variacao — Form com mais campos em grid

```tsx
// Para 3+ campos que fazem sentido em grid
<div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
  <FormField name="city" /* ... */ />
  <FormField name="state" /* ... */ />
  <FormField name="zipCode" /* ... */ />
</div>
```

## Exemplo 5: Variacao — Botao com texto diferente durante submit

```tsx
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Agendando...
    </>
  ) : (
    "Agendar"
  )}
</Button>
```

## Classes Tailwind usadas

| Classe | Valor | Contexto |
|--------|-------|----------|
| `space-y-4` | 16px gap vertical | Mobile: campos empilhados |
| `md:grid` | Display grid no breakpoint md | Desktop |
| `md:grid-cols-2` | 2 colunas | Desktop: campos lado a lado |
| `md:gap-4` | 16px gap no grid | Desktop |
| `md:space-y-0` | Remove gap vertical | Desktop: evita quebra |
| `flex justify-end` | Alinha a direita | Container do botao |
| `mr-2` | 8px margin right | Espaco entre spinner e texto |
| `h-4 w-4` | 16x16px | Tamanho do icone Loader2 |
| `animate-spin` | Rotacao continua | Animacao do spinner |