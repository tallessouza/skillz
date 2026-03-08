# Code Examples: Tipagem de Formulários com React Hook Form

## Exemplo 1: Formulário básico com um campo (da aula)

### Sem tipagem (problema)

```typescript
import { useForm } from 'react-hook-form'

function MyForm() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: '', // sem autocomplete
    },
  })

  function onSubmit(data) {
    // data é any — nenhum erro detectado
    console.log(data.names) // typo não detectado!
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

### Com tipagem (solução)

```typescript
import { useForm } from 'react-hook-form'

type FormData = {
  name: string
}

function MyForm() {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
    },
  })

  function onSubmit(data: FormData) {
    console.log(data.name) // autocomplete + validação
    // data.names → TS Error: Did you mean 'name'?
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

## Exemplo 2: Formulário com múltiplos campos

```typescript
type SignUpFormData = {
  name: string
  email: string
  password: string
  age: number
}

function SignUpForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      age: 0,
    },
  })

  function onSubmit(data: SignUpFormData) {
    // Todos os campos com autocomplete
    console.log(data.name, data.email, data.password, data.age)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} type="email" />
      <input {...register('password')} type="password" />
      <input {...register('age', { valueAsNumber: true })} type="number" />
      <button type="submit">Cadastrar</button>
    </form>
  )
}
```

## Exemplo 3: Type inline vs nomeado

### Inline (evitar em formulários reais)

```typescript
// Funciona, mas o tipo não é reutilizável
const { register } = useForm<{ name: string; email: string }>()
```

### Nomeado (preferir sempre)

```typescript
// Reutilizável em validação, API calls, props, etc.
type ContactFormData = {
  name: string
  email: string
  message: string
}

const { register } = useForm<ContactFormData>()
```

## Exemplo 4: Demonstração do erro de typo

```typescript
type FormData = {
  name: string
}

const { register } = useForm<FormData>({
  defaultValues: {
    // ✅ Correto — autocomplete sugere 'name'
    name: '',

    // ❌ Erro — TypeScript avisa imediatamente:
    // "Object literal may only specify known properties,
    //  and 'names' does not exist in type 'FormData'.
    //  Did you mean to write 'name'?"
    // names: '',
  },
})
```

## Exemplo 5: Tipo compartilhado entre form e API

```typescript
// types/user.ts
type CreateUserData = {
  name: string
  email: string
}

// components/CreateUserForm.tsx
import { useForm } from 'react-hook-form'
import type { CreateUserData } from '../types/user'

function CreateUserForm() {
  const { register, handleSubmit } = useForm<CreateUserData>({
    defaultValues: {
      name: '',
      email: '',
    },
  })

  async function onSubmit(data: CreateUserData) {
    // O mesmo tipo usado no form e na chamada de API
    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />
      <button type="submit">Criar</button>
    </form>
  )
}
```