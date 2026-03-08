# Code Examples: React 19 Form Action com FormData

## Exemplo 1: Login completo (da aula)

### Versao antiga (com estado):
```tsx
import { useState, FormEvent } from "react"

function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    console.log({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="E-mail"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

### Versao nova (com action):
```tsx
function SignIn() {
  function onSignIn(formData: FormData) {
    const email = formData.get("email")
    const password = formData.get("password")
    console.log({ email, password })
  }

  return (
    <form action={onSignIn}>
      <input name="email" type="email" required placeholder="E-mail" />
      <input name="password" type="password" required placeholder="Senha" />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

**O que mudou:**
- Removidos 2 useState
- Removidos 2 onChange handlers
- Removido preventDefault
- Adicionado atributo `name` em cada input
- Trocado `onSubmit` por `action`

## Exemplo 2: Formulario de cadastro com mais campos

```tsx
function SignUp() {
  function onSignUp(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      alert("Senhas nao conferem")
      return
    }

    console.log({ name, email, password })
  }

  return (
    <form action={onSignUp}>
      <input name="name" type="text" required placeholder="Nome" />
      <input name="email" type="email" required placeholder="E-mail" />
      <input name="password" type="password" required placeholder="Senha" />
      <input
        name="confirmPassword"
        type="password"
        required
        placeholder="Confirmar senha"
      />
      <button type="submit">Criar conta</button>
    </form>
  )
}
```

## Exemplo 3: Convertendo todos os campos de uma vez

```tsx
function ContactForm() {
  function onContact(formData: FormData) {
    // Converte FormData para objeto de uma vez
    const data = Object.fromEntries(formData)
    console.log(data)
    // { name: "João", email: "joao@email.com", message: "Olá!" }
  }

  return (
    <form action={onContact}>
      <input name="name" type="text" required placeholder="Nome" />
      <input name="email" type="email" required placeholder="E-mail" />
      <textarea name="message" required placeholder="Mensagem" />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

**Dica:** `Object.fromEntries(formData)` converte todos os campos para um objeto simples — util quando tem muitos campos.

## Exemplo 4: Armadilha do name errado (mostrada ao vivo)

```tsx
// BUG: formData.get("nome") retorna null porque o input tem name="email"
function BugExample() {
  function onSubmit(formData: FormData) {
    const email = formData.get("nome") // null! name do input e "email"
    console.log(email) // null
  }

  return (
    <form action={onSubmit}>
      <input name="email" type="email" required />
      <button type="submit">Enviar</button>
    </form>
  )
}

// CORRETO: usar o mesmo nome
function FixedExample() {
  function onSubmit(formData: FormData) {
    const email = formData.get("email") // funciona!
    console.log(email)
  }

  return (
    <form action={onSubmit}>
      <input name="email" type="email" required />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

## Exemplo 5: Tipagem segura com TypeScript

```tsx
interface SignInData {
  email: string
  password: string
}

function SignIn() {
  function onSignIn(formData: FormData) {
    const data: SignInData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    // Agora 'data' e tipado
    authenticateUser(data)
  }

  return (
    <form action={onSignIn}>
      <input name="email" type="email" required placeholder="E-mail" />
      <input name="password" type="password" required placeholder="Senha" />
      <button type="submit">Entrar</button>
    </form>
  )
}
```