# Code Examples: Error Boundary no Next.js (error.tsx)

## Exemplo 1: error.tsx completo da aula

```typescript
// app/error.tsx
"use client"

import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center px-16 py-16">
      <div className="max-w-md w-full text-center">
        {/* Container do icone com detalhe visual */}
        <div className="relative inline-block mb-24">
          <AlertTriangle className="text-gray-100" size={64} />
          {/* Detalhe decorativo vermelho atras do icone */}
          <div className="absolute h-16 w-16 bg-red-500 rotate-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80" />
        </div>

        <h2 className="text-xl text-white font-sans mb-8">
          Something went wrong
        </h2>

        {error.message && (
          <p className="text-gray-200 mb-8 px-4 text-sm overflow-hidden text-ellipsis max-h-24">
            {error.message}
          </p>
        )}

        <button onClick={reset} className="mt-16 bg-primary">
          Try again
        </button>
      </div>
    </div>
  )
}
```

## Exemplo 2: Componente que lanca erro (para testes)

O instrutor criou um componente temporario para testar o error boundary:

```typescript
// app/component.tsx (temporario, para teste)
"use client"

import { useEffect } from "react"

export const ErrorComponent = () => {
  useEffect(() => {
    throw new Error("Componente lancando um error")
  }, [])

  return <div>Error Component</div>
}
```

Uso na pagina:

```typescript
// app/page.tsx
import { ErrorComponent } from "./component"

export default function Home() {
  return (
    <div>
      {/* conteudo existente */}
      <ErrorComponent />
    </div>
  )
}
```

## Exemplo 3: Error boundary por segmento

```typescript
// app/dashboard/error.tsx — captura apenas erros do dashboard
"use client"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Erro no Dashboard</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}
```

## Exemplo 4: Error boundary com logging via useEffect

Conforme mencionado na documentacao do Next.js que o instrutor referenciou:

```typescript
"use client"

import { useEffect } from "react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Logar o erro para um servico de monitoramento
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Hierarquia de captura

```
app/
├── error.tsx              ← fallback global (captura tudo que nao foi capturado antes)
├── page.tsx
├── dashboard/
│   ├── error.tsx          ← captura erros APENAS dentro de /dashboard
│   ├── page.tsx
│   └── settings/
│       └── page.tsx       ← erro aqui → capturado por dashboard/error.tsx
└── blog/
    └── page.tsx           ← erro aqui → capturado por app/error.tsx (global)
```