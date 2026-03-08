# Code Examples: Overview de Sign Up

## Exemplo completo do formulário de cadastro

### Schema de validação com Zod

```typescript
import { z } from "zod"

const signUpSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  passwordConfirm: z.string().min(6, "Confirme a senha"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não conferem",
  path: ["passwordConfirm"],
})
```

### Estados do formulário

```typescript
const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [passwordConfirm, setPasswordConfirm] = useState("")
const [isLoading, setIsLoading] = useState(false)
```

### Handler de submit completo

```typescript
import { ZodError } from "zod"
import axios from "axios"

async function handleSubmit(e: FormEvent) {
  e.preventDefault()
  setIsLoading(true)

  try {
    const data = signUpSchema.parse({
      name,
      email,
      password,
      passwordConfirm,
    })

    await api.post("/users", data)
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return alert(error.issues[0].message)
    }

    if (axios.isAxiosError(error)) {
      return alert(error.response?.data?.message)
    }

    return alert("Não foi possível cadastrar.")
  } finally {
    setIsLoading(false)
  }

  if (window.confirm("Cadastro realizado com sucesso!")) {
    navigate(-1)
  }
}
```

### Formulário JSX

```tsx
<form onSubmit={handleSubmit}>
  <Input
    placeholder="Nome"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <Input
    placeholder="E-mail"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <Input
    placeholder="Senha"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <Input
    placeholder="Confirmar senha"
    type="password"
    value={passwordConfirm}
    onChange={(e) => setPasswordConfirm(e.target.value)}
  />
  <Button title="Criar conta" isLoading={isLoading} />
</form>
```

## Variação: Com toast em vez de alert

```typescript
import { toast } from "sonner"

async function handleSubmit(e: FormEvent) {
  e.preventDefault()
  setIsLoading(true)

  try {
    const data = signUpSchema.parse({ name, email, password, passwordConfirm })
    await api.post("/users", data)
  } catch (error) {
    if (error instanceof ZodError) {
      return toast.error(error.issues[0].message)
    }

    if (axios.isAxiosError(error)) {
      return toast.error(error.response?.data?.message)
    }

    return toast.error("Não foi possível cadastrar.")
  } finally {
    setIsLoading(false)
  }

  toast.success("Cadastro realizado com sucesso!")
  navigate(-1)
}
```

## Variação: Com React Hook Form em vez de estados manuais

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: zodResolver(signUpSchema),
})

async function onSubmit(data: z.infer<typeof signUpSchema>) {
  // Zod já validou via resolver — só trata erros da API
  try {
    await api.post("/users", data)
    toast.success("Cadastro realizado!")
    navigate(-1)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return toast.error(error.response?.data?.message)
    }
    toast.error("Não foi possível cadastrar.")
  }
}
```

## Variação: Múltiplos erros do Zod

```typescript
if (error instanceof ZodError) {
  const messages = error.issues.map((issue) => issue.message)
  return alert(messages.join("\n"))
}
```

## Padrão de botão com loading

```tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  isLoading?: boolean
}

function Button({ title, isLoading = false, ...rest }: ButtonProps) {
  return (
    <button disabled={isLoading} {...rest}>
      {isLoading ? "Carregando..." : title}
    </button>
  )
}
```