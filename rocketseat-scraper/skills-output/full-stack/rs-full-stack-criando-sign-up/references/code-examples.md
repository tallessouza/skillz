# Code Examples: Criando SignUp a partir de SignIn

## Exemplo 1: Estrutura completa do SignUp

```tsx
import { useState } from "react"
import { Link } from "react-router-dom"

import { Input } from "../../components/input"
import { Button } from "../../components/button"

export function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    console.log({ name, email, password, passwordConfirm })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>

      <Input
        label="name"
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        label="email"
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="password"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        label="passwordConfirm"
        type="password"
        placeholder="Confirmação da senha"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />

      <Button type="submit">Cadastrar</Button>

      <Link to="/">Já tenho uma conta</Link>
    </form>
  )
}
```

## Exemplo 2: Registro de rotas no AuthLayout

```tsx
// auth-layout/index.tsx (ou auth-house/index.tsx)
import { Routes, Route } from "react-router-dom"

import { SignIn } from "./sign-in"
import { SignUp } from "./sign-up"

export function AuthLayout() {
  return (
    <div className="auth-container">
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </div>
  )
}
```

## Exemplo 3: SignIn original para comparacao

```tsx
import { useState } from "react"
import { Link } from "react-router-dom"

import { Input } from "../../components/input"
import { Button } from "../../components/button"

export function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    console.log({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>

      <Input
        label="email"
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="password"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit">Entrar</Button>

      <Link to="/sign-up">Criar conta</Link>
    </form>
  )
}
```

## Exemplo 4: Diff entre SignIn e SignUp

As diferencas sao minimas e bem definidas:

```diff
- export function SignIn() {
+ export function SignUp() {
+   const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
+   const [passwordConfirm, setPasswordConfirm] = useState("")

    // ... form structure ...

-     <h1>Sign In</h1>
+     <h1>Sign Up</h1>

+     <Input
+       label="name"
+       placeholder="Seu nome"
+       value={name}
+       onChange={(e) => setName(e.target.value)}
+     />

      {/* email e password permanecem iguais */}

+     <Input
+       label="passwordConfirm"
+       type="password"
+       placeholder="Confirmação da senha"
+       value={passwordConfirm}
+       onChange={(e) => setPasswordConfirm(e.target.value)}
+     />

-     <Button type="submit">Entrar</Button>
+     <Button type="submit">Cadastrar</Button>

-     <Link to="/sign-up">Criar conta</Link>
+     <Link to="/">Já tenho uma conta</Link>
```

## Exemplo 5: Variacao com Tailwind CSS

```tsx
export function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    console.log({ name, email, password, passwordConfirm })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <h1 className="text-2xl font-bold text-gray-900">Sign Up</h1>

      <Input label="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="email" type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="password" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Input label="passwordConfirm" type="password" placeholder="Confirmação da senha" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />

      <Button type="submit" className="bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition-colors">
        Cadastrar
      </Button>

      <Link to="/" className="text-sm text-blue-600 hover:underline text-center">
        Já tenho uma conta
      </Link>
    </form>
  )
}
```