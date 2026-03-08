# Code Examples: Página de Confirmação com Guard de Rota

## Exemplo 1: Página de confirmação básica

```tsx
// pages/confirm.tsx
export function Confirm() {
  return <h1>Confirm</h1>
}
```

## Exemplo 2: Registro da rota no layout

```tsx
// routes.tsx
import { Confirm } from "./pages/confirm"
import { Refund } from "./pages/refund"

// Dentro do grupo de rotas do employee
<Route path="/" element={<EmployeeLayout />}>
  <Route path="refund" element={<Refund />} />
  <Route path="confirm" element={<Confirm />} />
</Route>
```

## Exemplo 3: Navegação com estado após submit

```tsx
// pages/refund.tsx
import { useNavigate } from "react-router-dom"

export function Refund() {
  const navigate = useNavigate()

  function onSubmit(data: RefundFormData) {
    console.log(data)
    navigate("/confirm", { state: { fromSubmit: true } })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* campos do formulário */}
      <button type="submit">Enviar</button>
    </form>
  )
}
```

## Exemplo 4: Guard completo na página de confirmação

```tsx
// pages/confirm.tsx
import { Navigate, useLocation } from "react-router-dom"

export function Confirm() {
  const location = useLocation()

  if (!location.state?.fromSubmit) {
    return <Navigate to="/" />
  }

  return <h1>Solicitação enviada</h1>
}
```

## Exemplo 5: Variação — passando dados junto com o guard

```tsx
// No formulário
navigate("/confirm", {
  state: {
    fromSubmit: true,
    refundId: "REF-12345",
    submittedAt: new Date().toISOString(),
  },
})

// Na página de confirmação
export function Confirm() {
  const location = useLocation()

  if (!location.state?.fromSubmit) {
    return <Navigate to="/" />
  }

  const { refundId, submittedAt } = location.state

  return (
    <div>
      <h1>Solicitação enviada</h1>
      <p>Protocolo: {refundId}</p>
      <p>Data: {new Date(submittedAt).toLocaleDateString("pt-BR")}</p>
    </div>
  )
}
```

## Exemplo 6: Variação — múltiplas origens permitidas

```tsx
export function Confirm() {
  const location = useLocation()

  const isFromSubmit = location.state?.fromSubmit
  const isFromPayment = location.state?.fromPayment

  if (!isFromSubmit && !isFromPayment) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <h1>
        {isFromPayment ? "Pagamento confirmado" : "Solicitação enviada"}
      </h1>
    </div>
  )
}
```

## Exemplo 7: Variação — redirect para página anterior com replace

```tsx
// Usando replace: true para não adicionar ao histórico
navigate("/confirm", {
  state: { fromSubmit: true },
  replace: true,
})

// Resultado: ao clicar "voltar" no browser, o usuário NÃO volta para o formulário
// (útil para evitar resubmissão acidental)
```

## Exemplo 8: Guard com useEffect (anti-pattern mostrado para contraste)

```tsx
// ANTI-PATTERN — não use useEffect para guard
export function Confirm() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.state?.fromSubmit) {
      navigate("/")
    }
  }, [location, navigate])

  // Problema: o componente renderiza brevemente antes do redirect
  return <h1>Solicitação enviada</h1>
}

// CORRETO — use early return com Navigate
export function Confirm() {
  const location = useLocation()

  if (!location.state?.fromSubmit) {
    return <Navigate to="/" />
  }

  return <h1>Solicitação enviada</h1>
}
```