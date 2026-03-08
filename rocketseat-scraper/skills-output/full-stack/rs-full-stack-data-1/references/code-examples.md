# Code Examples: Input de Data em Formulários React

## Exemplo completo do formulário com nome e data

```tsx
import { useForm, Controller } from "react-hook-form"
import { Input } from "./components/Input"

type FormData = {
  name: string
  date: string
}

export function MyForm() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: "",
      date: "",
    },
  })

  function onSubmit(data: FormData) {
    console.log(data) // { name: "TypeScript", date: "2024-01-13" }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input placeholder="Nome" {...field} />
        )}
      />

      <Controller
        control={control}
        name="date"
        render={({ field }) => (
          <Input type="date" {...field} />
        )}
      />

      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Variação: Controller com validação

```tsx
<Controller
  control={control}
  name="date"
  rules={{
    required: "Data é obrigatória",
    validate: (value) => {
      const selectedDate = new Date(value)
      const today = new Date()
      return selectedDate <= today || "Data não pode ser no futuro"
    },
  }}
  render={({ field, fieldState }) => (
    <>
      <Input type="date" {...field} />
      {fieldState.error && <span>{fieldState.error.message}</span>}
    </>
  )}
/>
```

## Variação: Múltiplos campos de data

```tsx
type EventFormData = {
  title: string
  startDate: string
  endDate: string
}

const { control, handleSubmit } = useForm<EventFormData>({
  defaultValues: {
    title: "",
    startDate: "",
    endDate: "",
  },
})

// Cada campo de data usa seu próprio Controller
<Controller
  control={control}
  name="startDate"
  render={({ field }) => <Input type="date" label="Início" {...field} />}
/>

<Controller
  control={control}
  name="endDate"
  render={({ field }) => <Input type="date" label="Fim" {...field} />}
/>
```

## Variação: Convertendo para Date no submit

```tsx
function onSubmit(data: FormData) {
  const payload = {
    name: data.name,
    date: new Date(data.date), // Conversão string → Date apenas aqui
  }

  api.post("/events", payload)
}
```

## Variação: Input customizado com props adicionais

```tsx
<Controller
  control={control}
  name="date"
  render={({ field }) => (
    <Input
      type="date"
      label="Data do evento"
      min="2024-01-01"
      max="2024-12-31"
      {...field}  // Spread por último para não sobrescrever type/label
    />
  )}
/>
```

## Componente Input compatível com Controller

```tsx
import { forwardRef, InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...rest }, ref) => {
    return (
      <div>
        {label && <label>{label}</label>}
        <input ref={ref} {...rest} />
      </div>
    )
  }
)
```

> **Nota:** O `forwardRef` é necessário para que o Controller consiga passar a `ref` para o input nativo, permitindo foco automático e validação.