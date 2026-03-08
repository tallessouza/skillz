# Code Examples: Formulários em React

## Exemplo 1: Input controlado com useState

```tsx
import { useState, FormEvent } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!email || !password) {
      alert('Preencha todos os campos')
      return
    }

    console.log({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="E-mail"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

**Quando usar:** quando precisa de feedback em tempo real (ex: mostrar força da senha enquanto digita).

## Exemplo 2: Input não controlado com useRef

```tsx
import { useRef, FormEvent } from 'react'

function SearchForm() {
  const searchRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const query = searchRef.current?.value

    if (!query) {
      alert('Digite algo para buscar')
      return
    }

    console.log({ query })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={searchRef} type="text" placeholder="Buscar..." />
      <button type="submit">Buscar</button>
    </form>
  )
}
```

**Quando usar:** formulários simples onde o valor só importa no submit.

## Exemplo 3: FormData sem estado

```tsx
import { FormEvent } from 'react'

function RegistrationForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const role = formData.get('role') as string

    // Validação de campos obrigatórios
    if (!name || !email) {
      alert('Nome e e-mail são obrigatórios')
      return
    }

    // Validação de tipo
    if (!email.includes('@')) {
      alert('E-mail inválido')
      return
    }

    console.log({ name, email, role })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" placeholder="Nome" required />
      <input name="email" type="email" placeholder="E-mail" required />
      <select name="role" defaultValue="dev">
        <option value="dev">Desenvolvedor</option>
        <option value="designer">Designer</option>
        <option value="pm">Product Manager</option>
      </select>
      <button type="submit">Cadastrar</button>
    </form>
  )
}
```

**Quando usar:** múltiplos campos, sem necessidade de reatividade, dados capturados apenas no submit. Zero `useState`, zero re-renders durante digitação.

## Exemplo 4: Validação por tipo de dado

```tsx
interface FormErrors {
  [field: string]: string
}

function validateForm(formData: FormData): FormErrors {
  const errors: FormErrors = {}
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const age = formData.get('age') as string

  if (!name || name.length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres'
  }

  if (!email || !email.includes('@')) {
    errors.email = 'E-mail inválido'
  }

  if (!age || isNaN(Number(age)) || Number(age) < 18) {
    errors.age = 'Idade deve ser um número maior ou igual a 18'
  }

  return errors
}
```

**Insight:** valide presença E tipo de dado. "Fazendo a validação de cada tipo de dado que você precisa no seu formulário."

## Comparação lado a lado

| Aspecto | Controlado | Não controlado | FormData |
|---------|-----------|----------------|----------|
| Estado React | `useState` por campo | Nenhum | Nenhum |
| Re-renders | A cada keystroke | Nenhum | Nenhum |
| Acesso ao valor | `state` (sempre disponível) | `ref.current.value` | No submit |
| Validação em tempo real | Sim | Não | Não |
| Complexidade | Alta (muitos campos) | Média | Baixa |
| Atributo chave | `value` + `onChange` | `ref` | `name` |