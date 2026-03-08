# Code Examples: Componente de Loading

## Exemplo 1: Componente base de Loading

```tsx
// src/components/loading.tsx
export function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <span className="text-gray-200 font-bold text-sm">
        Carregando
      </span>
    </div>
  )
}
```

## Exemplo 2: Uso na rota de autenticacao

```tsx
import { Loading } from "@/components/loading"

export function SignIn() {
  const isLoading = true

  if (isLoading) {
    return <Loading />
  }

  return (
    <form>
      {/* campos de email e senha */}
      <input type="email" placeholder="E-mail" />
      <input type="password" placeholder="Senha" />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

## Exemplo 3: Com estado real usando useState

```tsx
import { useState } from "react"
import { Loading } from "@/components/loading"

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      await api.post("/sessions", { email, password })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* campos */}
      <button type="submit">Entrar</button>
    </form>
  )
}
```

## Exemplo 4: Loading parcial (dentro de secao)

Variacao para quando o loading nao precisa ocupar a tela inteira:

```tsx
export function SectionLoading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <span className="text-gray-200 font-bold text-sm">
        Carregando
      </span>
    </div>
  )
}
```

Uso dentro de um card ou painel com dimensoes definidas:

```tsx
<div className="w-[400px] h-[300px]">
  {isLoading ? <SectionLoading /> : <Content />}
</div>
```

## Exemplo 5: Ajuste de layout da aula

O instrutor ajustou o layout geral para funcionar melhor com o loading:

```tsx
// Layout antes
<main className="min-w-[462px]">
  <div>{children}</div>
</main>

// Layout depois
<main className="w-full max-w-md">
  <div className="p-8">{children}</div>
</main>
```

A mudanca de `min-w` para `max-w-md` com `w-full` permite que o layout seja responsivo — em telas menores o conteudo encolhe, em vez de forcar scroll horizontal.

## Exemplo 6: Loading com mensagem customizada

Variacao que aceita mensagem via props:

```tsx
interface LoadingProps {
  message?: string
}

export function Loading({ message = "Carregando" }: LoadingProps) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <span className="text-gray-200 font-bold text-sm">
        {message}
      </span>
    </div>
  )
}
```

Uso:

```tsx
if (isLoading) {
  return <Loading message="Autenticando..." />
}
```