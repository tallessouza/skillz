# Code Examples: useActionState

## Exemplo 1: Setup mínimo

```typescript
import { useActionState } from "react"

function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, null)

  async function signIn(prevState: unknown, formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("Estado anterior:", prevState)
    console.log("Email:", email)
    console.log("Password:", password)

    return { email, password }
  }

  return (
    <form action={formAction}>
      <input name="email" />
      <input name="password" type="password" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Carregando..." : "Entrar"}
      </button>
    </form>
  )
}
```

## Exemplo 2: Com Promise simulando requisição

```typescript
async function signIn(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("ok")
    }, 1000)
  })

  return { email, password }
}
```

Enquanto a Promise não resolve (1 segundo), `isPending` é `true` e o botão fica desabilitado.

## Exemplo 3: Com estado inicial tipado

```typescript
interface SignInState {
  email: string
  password: string
  error?: string
}

const initialState: SignInState = {
  email: "",
  password: "",
}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState)

  async function signIn(
    prevState: SignInState,
    formData: FormData
  ): Promise<SignInState> {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await api.post("/sessions", { email, password })
      return { email, password }
    } catch {
      return { email, password, error: "Credenciais inválidas" }
    }
  }

  return (
    <form action={formAction}>
      {state.error && <p className="error">{state.error}</p>}
      <input name="email" defaultValue={state.email} />
      <input name="password" type="password" defaultValue={state.password} />
      <button disabled={isPending}>
        {isPending ? "Carregando..." : "Entrar"}
      </button>
    </form>
  )
}
```

## Exemplo 4: Mantendo valores após submit

```typescript
const [state, formAction, isPending] = useActionState(signIn, null)

// No JSX, use operador de coalescência para evitar erro com null:
<input name="email" defaultValue={state?.email ?? ""} />
<input name="password" defaultValue={state?.password ?? ""} />
```

Se o state é `null` (inicial), o input fica vazio. Após a primeira submissão, os valores são preservados.

## Exemplo 5: Acessando prevState para lógica de retry

```typescript
interface FormState {
  email: string
  attempts: number
  error?: string
}

async function signIn(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get("email") as string
  const attempts = (prevState?.attempts ?? 0) + 1

  if (attempts >= 3) {
    return { email, attempts, error: "Muitas tentativas. Tente novamente mais tarde." }
  }

  try {
    await api.post("/sessions", { email })
    return { email, attempts }
  } catch {
    return { email, attempts, error: `Falha na tentativa ${attempts}` }
  }
}
```

## Exemplo 6: Comparação lado a lado — antes e depois

### Antes (React 18 com useState)

```typescript
function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      await api.post("/sessions", {
        email: formData.get("email"),
        password: formData.get("password"),
      })
    } catch (err) {
      setError("Credenciais inválidas")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input name="password" type="password" />
      <button disabled={isLoading}>
        {isLoading ? "Carregando..." : "Entrar"}
      </button>
    </form>
  )
}
```

### Depois (React 19 com useActionState)

```typescript
function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, {
    email: "",
    password: "",
  })

  async function signIn(prevState: FormState, formData: FormData): Promise<FormState> {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await api.post("/sessions", { email, password })
      return { email, password }
    } catch {
      return { email, password, error: "Credenciais inválidas" }
    }
  }

  return (
    <form action={formAction}>
      {state.error && <p>{state.error}</p>}
      <input name="email" defaultValue={state.email} />
      <input name="password" type="password" defaultValue={state.password} />
      <button disabled={isPending}>
        {isPending ? "Carregando..." : "Entrar"}
      </button>
    </form>
  )
}
```

**Resultado:** 3 useState → 0 useState. Menos estado manual, menos bugs potenciais.

## Exemplo 7: Componente de botão com isPending

```typescript
// O componente Button recebe disabled e aplica estilos de loading
<Button type="submit" disabled={isPending}>
  {isPending ? "Processando..." : "Enviar"}
</Button>

// Dentro do Button component:
function Button({ disabled, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{ cursor: disabled ? "wait" : "pointer" }}
    >
      {children}
    </button>
  )
}
```