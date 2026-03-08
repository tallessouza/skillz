# Code Examples: Select e Default Values no React Hook Form

## Exemplo completo do formulário da aula

```tsx
import { useForm, Controller } from "react-hook-form"

interface FormData {
  name: string
  date: string
  subject: string
}

function MyForm() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: "",
      date: "",
      subject: "",
    }
  })

  function onSubmit(data: FormData) {
    console.log(data)
    // { name: "React", date: "2024-01-18", subject: "react" }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <input type="text" {...field} />
        )}
      />

      <Controller
        control={control}
        name="date"
        render={({ field }) => (
          <input type="date" {...field} />
        )}
      />

      <Controller
        control={control}
        name="subject"
        render={({ field }) => (
          <select {...field}>
            <option value="">Selecione um assunto</option>
            <option value="react">React</option>
            <option value="javascript">JavaScript</option>
          </select>
        )}
      />

      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Com defaultValues pré-preenchidos (formulário de edição)

```tsx
const { control, handleSubmit } = useForm<FormData>({
  defaultValues: {
    name: "Rodrigo",
    date: "2024-01-18",
    subject: "react",  // Select já inicia com "React" selecionado
  }
})
```

Ao recarregar a página com esse código, o campo name mostra "Rodrigo" e o select já aparece com "React" selecionado.

## Sem defaultValues (também funciona)

```tsx
const { control, handleSubmit } = useForm<FormData>()
// Campos iniciam vazios, sem warning
// Submit captura valores normalmente
```

## O bug: defaultValue nativo + Controller

```tsx
// BUG: dois sistemas controlando o valor inicial
<Controller
  control={control}
  name="subject"
  render={({ field }) => (
    <select {...field} defaultValue="react">
      {/* Warning no console + comportamento imprevisível */}
      <option value="react">React</option>
      <option value="javascript">JavaScript</option>
    </select>
  )}
/>
```

**Fix:** remova `defaultValue` do `<select>` e use `defaultValues` no `useForm`:

```tsx
const { control } = useForm<FormData>({
  defaultValues: { subject: "react" }
})

<Controller
  control={control}
  name="subject"
  render={({ field }) => (
    <select {...field}>
      <option value="react">React</option>
      <option value="javascript">JavaScript</option>
    </select>
  )}
/>
```

## Value vs texto de exibição

```tsx
<select {...field}>
  {/* value="react" é o que vai pro estado */}
  {/* "React" é o que o usuário vê */}
  <option value="react">React</option>
  <option value="javascript">JavaScript</option>
</select>
```

No submit, `data.subject` será `"react"` (o value), não `"React"` (o texto).

## Select com options dinâmicos

```tsx
const subjects = [
  { value: "react", label: "React" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
]

<Controller
  control={control}
  name="subject"
  render={({ field }) => (
    <select {...field}>
      <option value="">Selecione</option>
      {subjects.map((subject) => (
        <option key={subject.value} value={subject.value}>
          {subject.label}
        </option>
      ))}
    </select>
  )}
/>
```