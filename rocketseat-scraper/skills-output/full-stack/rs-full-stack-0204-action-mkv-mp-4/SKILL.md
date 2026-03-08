---
name: rs-full-stack-0204-action-mkv-mp-4
description: "Enforces React 19 form action pattern using formData instead of useState for form handling. Use when user asks to 'create a form', 'handle form submission', 'build a login page', 'capture form data', or 'submit form without state'. Applies the action prop on forms with formData.get() to read inputs by name attribute, eliminating onChange handlers and useState. Make sure to use this skill whenever building forms in React 19+, even if the user uses the old onSubmit pattern. Not for server actions, file uploads, or complex multi-step form wizards."
---

# React 19 Form Action com FormData

> Recupere dados de formulario via formData ao inves de useState, eliminando estados e onChange handlers desnecessarios.

## Rules

1. **Use `action` no lugar de `onSubmit`** — `<form action={handleAction}>` nao `<form onSubmit={handleSubmit}>`, porque action recebe formData diretamente sem precisar de event.preventDefault()
2. **Recupere valores com `formData.get("name")`** — nao com estado, porque elimina useState + onChange para cada campo
3. **Adicione `name` em cada input** — `<input name="email" />` nao `<input onChange={setEmail} />`, porque formData identifica campos pelo atributo name
4. **Use validacao nativa do HTML** — `required`, `type="email"`, `type="password"`, porque o navegador valida antes de disparar a action
5. **Aceite o reset automatico dos inputs** — apos a action executar, os campos resetam automaticamente, esse e o comportamento padrao

## How to write

### Form com action e formData

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

## Example

**Before (padrao antigo com useState + onSubmit):**
```tsx
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

**After (React 19 com action + formData):**
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

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario simples (login, cadastro, contato) | Use action + formData, sem useState |
| Precisa de validacao em tempo real (ex: senha forte) | Mantenha useState para o campo que precisa de feedback instantaneo |
| Formulario com muitos campos | action + formData escala melhor que N estados |
| Precisa preservar valores apos submit | Controle manualmente, pois action reseta os inputs |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `onChange={(e) => setState(e.target.value)}` para cada campo | `name="campo"` e `formData.get("campo")` |
| `e.preventDefault()` dentro de action | Nada — action nao recebe evento, preventDefault e automatico |
| `<form onSubmit={...}>` em React 19 para forms simples | `<form action={...}>` |
| Input sem atributo `name` quando usando action | `<input name="email" />` — obrigatorio para formData.get funcionar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre action vs onSubmit, comportamento de reset, e quando cada abordagem e melhor
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes