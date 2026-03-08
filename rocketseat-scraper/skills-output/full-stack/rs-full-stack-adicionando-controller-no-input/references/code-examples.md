# Code Examples: Controller no Input com React Hook Form

## Exemplo 1: Setup completo da aula (passo a passo)

### Passo 1 — Importações

```tsx
import { Controller, useForm } from 'react-hook-form'
```

O instrutor importa dois elementos: `Controller` (componente) e `useForm` (hook).

### Passo 2 — Desestruturar useForm

```tsx
const { control, handleSubmit } = useForm()
```

- `control`: passa para cada Controller para conectar o input ao formulário
- `handleSubmit`: coleta dados de todos os Controllers no submit

### Passo 3 — Criar função onSubmit

```tsx
function onSubmit(data) {
  console.log(data)
}
```

Recebe um objeto com chaves = `name` de cada Controller, valores = o que o usuário digitou.

### Passo 4 — Controller envolvendo o input

```tsx
<Controller
  control={control}
  name="name"
  render={({ field }) => (
    <input placeholder="Nome do evento" {...field} />
  )}
/>
```

Propriedades do Controller:
- `control` — conecta ao useForm
- `name` — identificador único do campo
- `render` — função que recebe `{ field }` e retorna o JSX do input

### Passo 5 — Form com handleSubmit

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* Controllers */}
  <button type="submit">Salvar</button>
</form>
```

O botão `type="submit"` dispara o `onSubmit` do form, que por sua vez chama `handleSubmit(onSubmit)`.

## Exemplo 2: Código completo final da aula

```tsx
import { Controller, useForm } from 'react-hook-form'

function EventForm() {
  const { control, handleSubmit } = useForm()

  function onSubmit(data) {
    console.log(data) // { name: "React" }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <input placeholder="Nome do evento" {...field} />
        )}
      />

      {/* Outros inputs ainda sem Controller */}
      <input placeholder="Local" />
      <input placeholder="Data" />

      <button type="submit">Salvar</button>
    </form>
  )
}
```

Resultado no console ao digitar "React" e clicar Salvar:
```json
{ "name": "React" }
```

Apenas `name` aparece porque é o único input controlado pelo Controller.

## Exemplo 3: Variação — Múltiplos Controllers

```tsx
function EventForm() {
  const { control, handleSubmit } = useForm()

  function onSubmit(data) {
    console.log(data)
    // { name: "React Conf", location: "São Paulo", date: "2024-03-15" }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <input placeholder="Nome do evento" {...field} />
        )}
      />
      <Controller
        control={control}
        name="location"
        render={({ field }) => (
          <input placeholder="Local" {...field} />
        )}
      />
      <Controller
        control={control}
        name="date"
        render={({ field }) => (
          <input type="date" {...field} />
        )}
      />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Exemplo 4: Variação — Com tipagem TypeScript

```tsx
interface EventFormData {
  name: string
  location: string
  date: string
}

function EventForm() {
  const { control, handleSubmit } = useForm<EventFormData>()

  function onSubmit(data: EventFormData) {
    console.log(data.name)     // tipado como string
    console.log(data.location) // tipado como string
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"  // ← autocomplete funciona aqui
        render={({ field }) => (
          <input placeholder="Nome do evento" {...field} />
        )}
      />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Exemplo 5: Antes vs Depois — Comparação lado a lado

### Antes (useState para cada campo)

```tsx
import { useState } from 'react'

function EventForm() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  function onSubmit() {
    console.log({ name, location })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
      />
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Local"
      />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

Problemas:
- 2 useState = 2 estados para gerenciar
- Re-render a cada keystroke em qualquer input
- Coleta manual de dados no submit

### Depois (React Hook Form)

```tsx
import { Controller, useForm } from 'react-hook-form'

function EventForm() {
  const { control, handleSubmit } = useForm()

  function onSubmit(data) {
    console.log(data) // { name: "...", location: "..." }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => <input placeholder="Nome" {...field} />}
      />
      <Controller
        control={control}
        name="location"
        render={({ field }) => <input placeholder="Local" {...field} />}
      />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

Benefícios:
- Zero useState
- Dados coletados automaticamente no submit
- Cada Controller se auto-registra via `control`

## Exemplo 6: Controller com componente customizado

```tsx
function CustomInput({ label, ...rest }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input className="custom-input" {...rest} />
    </div>
  )
}

// No formulário:
<Controller
  control={control}
  name="name"
  render={({ field }) => (
    <CustomInput label="Nome do evento" {...field} />
  )}
/>
```

O spread `{...field}` funciona com qualquer componente que aceite `value`, `onChange`, `onBlur` e `ref`.