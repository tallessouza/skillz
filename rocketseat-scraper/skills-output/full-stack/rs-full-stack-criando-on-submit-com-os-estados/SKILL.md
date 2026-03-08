---
name: rs-full-stack-criando-on-submit-com-os-estados
description: "Enforces React form submission patterns with useState when building login forms, handling onSubmit events, or managing input state. Use when user asks to 'create a login form', 'handle form submit', 'manage form state', 'disable button while loading', or 'capture input values'. Applies rules: onSubmit on form (not onClick on button), preventDefault to avoid reload, useState for each input, onChange with e.target.value, isLoading state to block duplicate submits. Make sure to use this skill whenever implementing form submission with React state. Not for React Hook Form, uncontrolled inputs, or server-side form handling."
---

# Criando onSubmit com Estados

> Formularios React usam onSubmit no form, preventDefault no evento, e useState para cada campo — nunca onClick no botao para disparar envio.

## Rules

1. **onSubmit no form, nao onClick no botao** — coloque o handler no `<form onSubmit={handleSubmit}>` e o botao como `type="submit"`, porque isso permite envio tanto por clique quanto por Enter
2. **Sempre use preventDefault** — chame `e.preventDefault()` no inicio do handler, porque sem isso o browser recarrega a pagina e perde os dados do formulario
3. **Um useState por campo** — crie `[email, setEmail]` e `[password, setPassword]` separados, porque cada input precisa de seu proprio estado controlado
4. **onChange com e.target.value** — use `onChange={(e) => setEmail(e.target.value)}` em cada input, porque e assim que React sincroniza o DOM com o estado
5. **Estado isLoading bloqueia o botao** — use `disabled={isLoading}` no botao submit, porque impede envios duplicados enquanto a requisicao esta em andamento
6. **Type o evento como React.FormEvent** — use `e: React.FormEvent<HTMLFormElement>`, porque garante autocomplete e seguranca de tipos no handler

## How to write

### Handler de submit no formulario

```tsx
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  console.log(email, password)
}

<form onSubmit={handleSubmit}>
  {/* inputs */}
  <button type="submit" disabled={isLoading}>Entrar</button>
</form>
```

### Estados controlados para inputs

```tsx
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [isLoading, setIsLoading] = useState(false)

<input
  type="email"
  required
  onChange={(e) => setEmail(e.target.value)}
/>
<input
  type="password"
  required
  onChange={(e) => setPassword(e.target.value)}
/>
```

## Example

**Before (onClick no botao, sem preventDefault):**
```tsx
function SignIn() {
  function handleClick() {
    alert("enviado")
  }

  return (
    <form>
      <input type="email" />
      <input type="password" />
      <button onClick={handleClick}>Entrar</button>
    </form>
  )
}
```

**After (onSubmit no form, estados controlados, loading):**
```tsx
import { useState } from "react"

function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        Entrar
      </button>
    </form>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario com multiplos campos | Um useState por campo, onChange em cada input |
| Botao de envio | `type="submit"` no botao, `onSubmit` no form |
| Requisicao async no submit | setIsLoading(true) antes, setIsLoading(false) no finally |
| Input obrigatorio | Adicione `required` — o browser valida antes do submit |
| Input de email | Use `type="email"` — o browser valida formato automaticamente |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `<button onClick={handleSubmit}>` | `<form onSubmit={handleSubmit}>` + `<button type="submit">` |
| Handler sem `e.preventDefault()` | Sempre `e.preventDefault()` na primeira linha |
| Botao sem `disabled` durante loading | `<button disabled={isLoading}>` |
| Um estado objeto para todo o form | Um `useState` por campo individual |
| `type="button"` no submit | `type="submit"` para permitir Enter |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre onSubmit vs onClick, preventDefault, e padroes de estado
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes