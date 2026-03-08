# Code Examples: Formulários em React

## 1. Input Controlado — Básico

```tsx
import { useState, FormEvent } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    console.log({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="E-mail"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

**Quando usar:** Formulários simples com poucos campos.

---

## 2. Input Não Controlado — Com useRef

```tsx
import { useRef, FormEvent } from 'react'

function SearchForm() {
  const searchRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const searchTerm = searchRef.current?.value
    console.log({ searchTerm })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={searchRef} type="text" placeholder="Buscar..." />
      <button type="submit">Buscar</button>
    </form>
  )
}
```

**Quando usar:** Quando o valor só importa no momento do submit.

---

## 3. React Hook Form — Sem validação

```tsx
import { useForm } from 'react-hook-form'

interface ProfileFormData {
  name: string
  email: string
  bio: string
  website: string
}

function ProfileForm() {
  const { register, handleSubmit } = useForm<ProfileFormData>()

  function onSubmit(data: ProfileFormData) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Nome" />
      <input {...register('email')} placeholder="E-mail" />
      <textarea {...register('bio')} placeholder="Bio" />
      <input {...register('website')} placeholder="Website" />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

**Vantagem:** 4 campos sem nenhum `useState`. Zero re-renders durante digitação.

---

## 4. React Hook Form + Zod — Com validação completa

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    await api.post('/users', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('name')} placeholder="Nome" />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <input {...register('email')} placeholder="E-mail" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <input {...register('password')} type="password" placeholder="Senha" />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <input
          {...register('confirmPassword')}
          type="password"
          placeholder="Confirmar senha"
        />
        {errors.confirmPassword && (
          <span>{errors.confirmPassword.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  )
}
```

**Destaques:**
- `z.infer` gera o tipo TypeScript automaticamente do schema
- `refine` permite validações cross-field (senha = confirmação)
- `formState.errors` mostra mensagens específicas por campo
- `isSubmitting` desabilita o botão durante o envio

---

## 5. Comparação lado a lado — Mesmo formulário

### Com useState (6 re-renders por campo)

```tsx
function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('normal')

  // 6 estados, 6 onChange handlers, re-render a cada keystroke
  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={phone} onChange={e => setPhone(e.target.value)} />
      <input value={subject} onChange={e => setSubject(e.target.value)} />
      <textarea value={message} onChange={e => setMessage(e.target.value)} />
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="low">Baixa</option>
        <option value="normal">Normal</option>
        <option value="high">Alta</option>
      </select>
    </form>
  )
}
```

### Com React Hook Form (0 re-renders durante digitação)

```tsx
function ContactForm() {
  const { register, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />
      <input {...register('phone')} />
      <input {...register('subject')} />
      <textarea {...register('message')} />
      <select {...register('priority')}>
        <option value="low">Baixa</option>
        <option value="normal">Normal</option>
        <option value="high">Alta</option>
      </select>
    </form>
  )
}
```

**Diferença:** 6 `useState` + 6 `onChange` → 0 estados, 0 handlers. Código 60% menor e sem re-renders.

---

## 6. React Hook Form com watch (campo reativo específico)

```tsx
function OrderForm() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: { quantity: 1, priceInCents: 0 },
  })

  const quantity = watch('quantity')
  const priceInCents = watch('priceInCents')
  const totalInCents = quantity * priceInCents

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('product')} />
      <input {...register('quantity', { valueAsNumber: true })} type="number" />
      <input {...register('priceInCents', { valueAsNumber: true })} type="number" />
      <p>Total: R$ {(totalInCents / 100).toFixed(2)}</p>
      <button type="submit">Finalizar</button>
    </form>
  )
}
```

**Quando usar:** Quando precisa de reatividade em campos específicos sem controlar todo o formulário.