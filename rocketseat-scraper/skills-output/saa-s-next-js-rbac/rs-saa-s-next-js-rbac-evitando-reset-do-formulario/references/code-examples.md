# Code Examples: Evitando Reset do Formulário

## Exemplo completo da aula: Tela de Sign In

### Server Action (antes — com useActionState)
```typescript
export async function signInWithEmailAndPassword(
  previousState: SignInFormState,
  data: FormData
) {
  // previousState era necessario por causa do useActionState
  const { email, password } = Object.fromEntries(data)
  // ... logica de autenticacao
  return { success: false, message: 'Invalid credentials', errors: null }
}
```

### Server Action (depois — sem useActionState)
```typescript
export async function signInWithEmailAndPassword(data: FormData) {
  // Formato original: recebe apenas FormData
  const { email, password } = Object.fromEntries(data)
  // ... logica de autenticacao
  return { success: false, message: 'Invalid credentials', errors: null }
}
```

### Componente (antes — com useActionState)
```typescript
'use client'
import { useActionState } from 'react'

export function SignInForm() {
  const [formState, formAction, isPending] = useActionState(
    signInWithEmailAndPassword,
    { success: false, message: null, errors: null }
  )

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button disabled={isPending}>
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>
      {formState.message && <p>{formState.message}</p>}
    </form>
  )
}
```

### Componente (depois — useState + useTransition)
```typescript
'use client'
import { useState } from 'react'
import { useTransition } from 'react'
import { requestFormReset } from 'react-dom'

type FormState = {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function SignInForm() {
  const [formState, setFormState] = useState<FormState>({
    success: false,
    message: null,
    errors: null,
  })
  const [isPending, startTransition] = useTransition()

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const result = await signInWithEmailAndPassword(data)
      setFormState(result)

      // Reset manual apenas no sucesso (opcional)
      // if (result.success) {
      //   requestFormReset(form)
      // }
    })
  }

  const { success, message, errors } = formState

  return (
    <form onSubmit={handleSignIn}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button disabled={isPending}>
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}
```

## Tipagem do evento de formulario

```typescript
// O evento precisa ser tipado com HTMLFormElement
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  // currentTarget sabe que e um HTMLFormElement
  const form = event.currentTarget

  // FormData aceita o elemento do formulario
  const data = new FormData(form)
}
```

## Usando requestFormReset para reset manual

```typescript
import { requestFormReset } from 'react-dom'

// Dentro do handler, apos sucesso:
startTransition(async () => {
  const result = await myAction(data)
  setFormState(result)

  if (result.success) {
    // Reseta o formulario manualmente
    requestFormReset(form)
  }
})
```

## Padrao antigo vs useTransition para loading

```typescript
// ANTIGO (nao fazer mais)
const [isLoading, setIsLoading] = useState(false)

async function handleSubmit() {
  setIsLoading(true)
  await myAction(data)
  setIsLoading(false)
}

// MODERNO (useTransition)
const [isPending, startTransition] = useTransition()

function handleSubmit() {
  startTransition(async () => {
    await myAction(data)
    // isPending e gerenciado automaticamente
  })
}
```