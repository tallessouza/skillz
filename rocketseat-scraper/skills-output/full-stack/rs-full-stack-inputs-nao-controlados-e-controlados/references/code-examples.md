# Code Examples: Inputs Controlados e Não Controlados

## Exemplo 1: Input não controlado (da aula)

O instrutor mostrou que ao clicar "salvar", o estado limpa mas o input mantém o texto:

```tsx
import { useState } from "react"

function App() {
  const [name, setName] = useState("")

  function handleSave() {
    console.log("Nome salvo:", name)
    setName("")  // Estado limpa, mas input NÃO limpa
  }

  return (
    <div>
      <input onChange={(e) => setName(e.target.value)} />
      <p>Nome: {name}</p>
      <button onClick={handleSave}>Salvar</button>
    </div>
  )
}
```

**Resultado:** Ao clicar "salvar", o `<p>` mostra vazio mas o `<input>` continua com o texto digitado.

## Exemplo 2: Input controlado (da aula)

Adicionando `value={name}` resolve o problema:

```tsx
import { useState } from "react"

function App() {
  const [name, setName] = useState("")

  function handleSave() {
    console.log("Nome salvo:", name)
    setName("")  // Estado limpa E input limpa
  }

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Nome: {name}</p>
      <button onClick={handleSave}>Salvar</button>
    </div>
  )
}
```

**Resultado:** Ao clicar "salvar", tanto o `<p>` quanto o `<input>` limpam.

## Exemplo 3: Valor inicial via estado (da aula)

O instrutor mostrou que definir valor inicial no `useState` reflete imediatamente no input:

```tsx
const [name, setName] = useState("Rodrigo")

// O input já renderiza com "Rodrigo" preenchido
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

## Exemplo 4: Formulário completo com múltiplos campos controlados

```tsx
import { useState } from "react"

function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  function handleSubmit() {
    console.log({ name, email })
    setName("")
    setEmail("")
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

## Exemplo 5: Validação em tempo real (só possível com controlado)

```tsx
const [email, setEmail] = useState("")
const isValidEmail = email.includes("@")

<input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  style={{ borderColor: email && !isValidEmail ? "red" : "gray" }}
/>
<button disabled={!isValidEmail}>Enviar</button>
```

## Exemplo 6: Formatação automática (máscara de telefone)

```tsx
const [phone, setPhone] = useState("")

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

<input
  value={phone}
  onChange={(e) => setPhone(formatPhone(e.target.value))}
  placeholder="(00) 00000-0000"
/>
```

Isso só funciona com input controlado — o `value` reescreve o conteúdo formatado a cada digitação.