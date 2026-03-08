# Code Examples: Exibindo Erros de Validação

## Exemplo completo do formulário da aula

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  date: z.string().min(1, "Data obrigatória"),
  subject: z.string().min(1, "Seleciona um assunto"),
  description: z.string().min(10, "Descrição precisa ter pelo menos 10 dígitos"),
})

type FormData = z.infer<typeof schema>

export function EventForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function handleSave(data: FormData) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <div>
        <input type="text" {...register("name")} placeholder="Nome do evento" />
        {errors.name?.message && (
          <span className="error">{errors.name.message}</span>
        )}
      </div>

      <div>
        <input type="date" {...register("date")} />
        {errors.date?.message && (
          <span className="error">{errors.date.message}</span>
        )}
      </div>

      <div>
        <select {...register("subject")}>
          <option value="">Selecione um assunto</option>
          <option value="react">React</option>
          <option value="node">Node.js</option>
        </select>
        {errors.subject?.message && (
          <span className="error">{errors.subject.message}</span>
        )}
      </div>

      <div>
        <textarea {...register("description")} placeholder="Descrição" />
        {errors.description?.message && (
          <span className="error">{errors.description.message}</span>
        )}
      </div>

      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Variação: usando Controller ao invés de register

```tsx
import { Controller, useForm } from "react-hook-form"

export function EventFormWithController() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => <input {...field} placeholder="Nome" />}
      />
      {errors.name?.message && (
        <span className="error">{errors.name.message}</span>
      )}
    </form>
  )
}
```

## Variação: estilizando o input com erro

```tsx
<input
  {...register("name")}
  className={errors.name ? "input-error" : "input-default"}
/>
{errors.name?.message && (
  <span className="error">{errors.name.message}</span>
)}
```

## Variação: componente reutilizável de campo com erro

```tsx
interface FieldErrorProps {
  message?: string
}

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null
  return <span className="error">{message}</span>
}

// Uso:
<input {...register("name")} />
<FieldError message={errors.name?.message} />
```

## Dados exibidos após submit bem-sucedido (demonstração da aula)

```json
{
  "name": "React on Fire",
  "date": "2024-01-18",
  "subject": "react",
  "description": "Evento focado na comunidade React"
}
```