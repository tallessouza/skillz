# Code Examples: React Hook Form — Gerenciamento de Formulários

## 1. Instalação

```bash
# Versão específica usada no curso
npm i react-hook-form@7.53.2

# Ou a versão mais recente
npm i react-hook-form
```

Dica: mantenha o servidor de desenvolvimento rodando em um terminal e use outro terminal para instalar pacotes.

## 2. Comparação: useState vs React Hook Form

### Com useState (abordagem tradicional)

```typescript
import { useState, FormEvent } from 'react'

function RegistrationForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const formData = { name, email, password, phone, address }
    console.log(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} />
      <input value={phone} onChange={e => setPhone(e.target.value)} />
      <input value={address} onChange={e => setAddress(e.target.value)} />
      <button type="submit">Cadastrar</button>
    </form>
  )
}
```

Problemas:
- 5 estados separados, 5 setters
- `handleSubmit` manual com `preventDefault`
- Montagem manual do objeto de dados
- Re-render a cada tecla em qualquer campo

### Com React Hook Form

```typescript
import { useForm } from 'react-hook-form'

interface RegistrationData {
  name: string
  email: string
  password: string
  phone: string
  address: string
}

function RegistrationForm() {
  const { register, handleSubmit } = useForm<RegistrationData>()

  function onSubmit(data: RegistrationData) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Nome" />
      <input {...register('email')} placeholder="E-mail" />
      <input {...register('password')} type="password" placeholder="Senha" />
      <input {...register('phone')} placeholder="Telefone" />
      <input {...register('address')} placeholder="Endereço" />
      <button type="submit">Cadastrar</button>
    </form>
  )
}
```

Vantagens:
- Zero estados manuais
- Tipagem automática via generics
- `handleSubmit` gerencia `preventDefault` internamente
- Dados coletados automaticamente como objeto tipado
- Sem re-renders desnecessários (uncontrolled inputs)

## 3. Setup básico mínimo

```typescript
import { useForm } from 'react-hook-form'

function MyForm() {
  const { register, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('field1')} />
      <input {...register('field2')} />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

Este é o setup mínimo: importar `useForm`, desestruturar `register` e `handleSubmit`, espalhar `register` nos inputs, e envolver o callback com `handleSubmit`.