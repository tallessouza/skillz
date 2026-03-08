---
name: rs-full-stack-adicionando-controller-no-input
description: "Enforces React Hook Form Controller pattern when building controlled form inputs without useState. Use when user asks to 'create a form', 'handle form input', 'use react hook form', 'add controller to input', or 'manage form state'. Applies useForm hook with control and handleSubmit destructuring, Controller component with control/name/render/field spread pattern. Make sure to use this skill whenever building React forms or replacing useState-based input management. Not for uncontrolled forms, native HTML form handling, or server-side form processing."
---

# React Hook Form — Controller no Input

> Controle inputs de formulário com React Hook Form usando Controller, eliminando a necessidade de useState para cada campo.

## Rules

1. **Importe controller e useForm** — `import { Controller, useForm } from 'react-hook-form'`, porque são os dois elementos essenciais: o hook gerencia o formulário, o componente controla cada input
2. **Desestruture control e handleSubmit do useForm** — `const { control, handleSubmit } = useForm()`, porque control conecta inputs ao formulário e handleSubmit coleta os dados no submit
3. **Envolva cada input com Controller** — nunca use onChange/value manual com estados, porque o Controller gerencia o ciclo de vida do input automaticamente
4. **Sempre defina name no Controller** — cada Controller precisa de um `name` único que identifica o campo no objeto de dados retornado
5. **Espalhe field no input via spread** — `{...field}` dentro do render repassa todas as propriedades do Controller (onChange, onBlur, value, ref) para o input
6. **Passe handleSubmit no onSubmit do form** — `onSubmit={handleSubmit(suaFuncao)}`, porque handleSubmit coleta os dados de todos os inputs controlados e repassa para sua função

## How to write

### Setup do useForm

```tsx
import { Controller, useForm } from 'react-hook-form'

function MyForm() {
  const { control, handleSubmit } = useForm()

  function onSubmit(data) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Controllers aqui */}
    </form>
  )
}
```

### Controller com input

```tsx
<Controller
  control={control}
  name="name"
  render={({ field }) => (
    <input placeholder="Nome do evento" {...field} />
  )}
/>
```

### Múltiplos Controllers

```tsx
<Controller
  control={control}
  name="name"
  render={({ field }) => <input placeholder="Nome" {...field} />}
/>
<Controller
  control={control}
  name="email"
  render={({ field }) => <input placeholder="Email" {...field} />}
/>
```

## Example

**Before (useState para cada campo):**
```tsx
import { useState } from 'react'

function MyForm() {
  const [name, setName] = useState('')

  function onSubmit() {
    console.log({ name })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
      />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

**After (React Hook Form com Controller):**
```tsx
import { Controller, useForm } from 'react-hook-form'

function MyForm() {
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
          <input placeholder="Nome" {...field} />
        )}
      />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário com 1+ inputs controlados | Use Controller para cada input |
| Precisa dos dados no submit | Desestruture `handleSubmit` do useForm |
| Input customizado (componente próprio) | Envolva com Controller e espalhe `field` |
| Botão type="submit" dentro do form | Use `onSubmit={handleSubmit(fn)}` no form |
| Precisa identificar campo no objeto final | Defina `name` único no Controller |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `const [name, setName] = useState('')` + `onChange` manual | `Controller` com `name="name"` e `{...field}` |
| `<input value={state} onChange={setState}>` para cada campo | `<Controller render={({ field }) => <input {...field} />} />` |
| Função onSubmit que lê estados individuais | `handleSubmit(onSubmit)` que recebe `data` com todos os campos |
| Esquecer `{...field}` no input do render | Sempre espalhar field: `<input {...field} />` |
| Controller sem `name` | Sempre definir `name` único para cada Controller |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que eliminar useState, como o Controller funciona internamente, e o fluxo de dados control→field→input
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula expandidos com variações e cenários adicionais