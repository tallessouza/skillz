# Code Examples: Textarea com React Hook Form Controller

## Exemplo completo do formulário da aula

```typescript
import { useForm, Controller } from "react-hook-form"

type FormData = {
  name: string
  date: string
  subject: string
  description: string
}

export function EventForm() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: "",
      date: "",
      subject: "",
      description: "",
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Exemplo de saída:
    // {
    //   name: "TypeScript",
    //   date: "2024-03-15",
    //   subject: "React",
    //   description: "Evento focado em contribuir com TypeScript no React"
    // }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <input {...field} placeholder="Nome do evento" />
        )}
      />

      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <input {...field} type="date" />
        )}
      />

      <Controller
        name="subject"
        control={control}
        render={({ field }) => (
          <select {...field}>
            <option value="">Selecione</option>
            <option value="react">React</option>
            <option value="typescript">TypeScript</option>
          </select>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            placeholder="Descrição do evento"
            rows={4}
          />
        )}
      />

      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Variação: textarea com validação

```typescript
<Controller
  name="description"
  control={control}
  rules={{
    required: "Descrição é obrigatória",
    minLength: {
      value: 10,
      message: "Descrição deve ter pelo menos 10 caracteres",
    },
  }}
  render={({ field, fieldState: { error } }) => (
    <>
      <textarea
        {...field}
        placeholder="Descrição do evento"
        rows={4}
      />
      {error && <span className="error">{error.message}</span>}
    </>
  )}
/>
```

## Variação: textarea com Zod resolver

```typescript
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  subject: z.string().min(1, "Assunto é obrigatório"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
})

type FormData = z.infer<typeof formSchema>

const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    date: "",
    subject: "",
    description: "",
  },
})
```

## Variação: textarea com register (alternativa mais simples)

Quando o textarea é um elemento nativo sem customização, `register` é mais conciso que Controller:

```typescript
const { register, handleSubmit } = useForm<FormData>({
  defaultValues: { description: "" },
})

<textarea
  {...register("description")}
  placeholder="Descrição"
  rows={4}
/>
```

O Controller é preferível quando se usa componentes de UI library (Material UI, Radix, etc.) que não expõem `ref` diretamente.

## Padrão de tipagem: adicionando campo ao tipo

```typescript
// ANTES — sem description, TypeScript reclama no Controller
type FormData = {
  name: string
  date: string
  subject: string
}

// DEPOIS — description adicionado, TypeScript satisfeito
type FormData = {
  name: string
  date: string
  subject: string
  description: string
}
```