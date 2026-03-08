# Code Examples: Criando onSubmit com Estados

## Exemplo 1: Abordagem incorreta — onClick no botao

```tsx
// ❌ NAO FACA ISSO — Enter nao funciona, validacoes nativas ignoradas
function SignIn() {
  function handleSubmit() {
    alert("enviado")
  }

  return (
    <form>
      <input type="email" required />
      <input type="password" required />
      <button onClick={handleSubmit}>Entrar</button>
    </form>
  )
}
```

Problema: usuario digita email e senha, aperta Enter, nada acontece. So funciona clicando no botao.

## Exemplo 2: onSubmit sem preventDefault

```tsx
// ❌ Funciona mas perde dados — pagina recarrega apos submit
function SignIn() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // sem preventDefault!
    alert("enviado")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" required />
      <input type="password" required />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

Problema: apos clicar OK no alert, pagina recarrega e campos ficam vazios.

## Exemplo 3: Solucao completa da aula

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

## Exemplo 4: Variacao com envio async

```tsx
import { useState } from "react"

function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsLoading(true)

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const session = await response.json()
      console.log(session)
    } catch (error) {
      console.error("Falha no login:", error)
    } finally {
      setIsLoading(false)
    }
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
        {isLoading ? "Carregando..." : "Entrar"}
      </button>
    </form>
  )
}
```

## Exemplo 5: Demonstracao do isLoading bloqueando submit

O instrutor mostra na aula que ao setar `isLoading` como `true`:

```tsx
const [isLoading, setIsLoading] = useState(true) // forcar true para testar
```

O botao fica desabilitado visualmente e clicar nele nao dispara o `onSubmit`. Ao voltar para `false`, o botao funciona normalmente. Isso prova que `disabled={isLoading}` realmente bloqueia o envio.

## Exemplo 6: Validacao nativa do browser

Ao usar atributos HTML semanticos:

```tsx
<input type="email" required />
```

O browser valida automaticamente:
- Campo vazio → "Preencha este campo"
- Email sem @ → "Inclua um '@' no endereco de email"
- Email incompleto → "Insira uma parte apos '@'"

Tudo sem JavaScript adicional, gracas ao `type="submit"` que passa pelo mecanismo nativo de validacao do form.