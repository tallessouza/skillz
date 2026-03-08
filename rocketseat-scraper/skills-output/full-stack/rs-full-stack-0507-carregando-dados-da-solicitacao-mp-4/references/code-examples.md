# Code Examples: Carregando Dados da Solicitação

## Exemplo completo do componente

```typescript
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AxiosError } from "axios"
import { api } from "../services/api"
import { formatCurrency } from "../utils/formatCurrency"

type RefundAPIResponse = {
  id: string
  name: string
  category: string
  amount: number
  fileName: string
}

export function RefundDetails() {
  const params = useParams<{ id: string }>()

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [fileURL, setFileURL] = useState<string | null>(null)

  async function fetchRefund(id: string) {
    try {
      const { data } = await api.get<RefundAPIResponse>(`/refunds/${id}`)

      setName(data.name)
      setCategory(data.category)
      setAmount(formatCurrency(data.amount))
      setFileURL(data.fileName)
    } catch (error) {
      if (error instanceof AxiosError) {
        return alert(error.response?.data.message)
      }
      alert("Não foi possível carregar")
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchRefund(params.id)
    }
  }, [params.id])

  async function onSubmit() {
    // lógica de submit separada...
  }

  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={!!params.id}
        readOnly={!!params.id}
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={!!params.id}
        readOnly={!!params.id}
      />

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={!!params.id}
        readOnly={!!params.id}
      />

      {params.id && fileURL && (
        <button type="button">Abrir comprovante</button>
      )}

      {!params.id && (
        <button type="submit">Enviar</button>
      )}
    </form>
  )
}
```

## Função formatCurrency utilizada

```typescript
// src/utils/formatCurrency.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
```

## Variação: tipos separados para lista vs item

```typescript
// types/refund.ts

// Usado em GET /refunds (listagem com paginação)
export type RefundsAPIResponse = {
  refunds: Array<{
    id: string
    name: string
    category: string
    amount: number
    createdAt: string
  }>
  total: number
  page: number
  perPage: number
}

// Usado em GET /refunds/:id (detalhe individual)
export type RefundAPIResponse = {
  id: string
  name: string
  category: string
  amount: number
  fileName: string
  user: {
    name: string
    email: string
  }
}
```

## Variação: tratamento de erro com toast em vez de alert

```typescript
import { toast } from "react-toastify"

async function fetchRefund(id: string) {
  try {
    const { data } = await api.get<RefundAPIResponse>(`/refunds/${id}`)
    setName(data.name)
    setCategory(data.category)
    setAmount(formatCurrency(data.amount))
    setFileURL(data.fileName)
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message || "Erro ao carregar")
      return
    }
    toast.error("Não foi possível carregar")
  }
}
```

## Variação: useEffect com cleanup para evitar state update em componente desmontado

```typescript
useEffect(() => {
  let isMounted = true

  async function load() {
    if (!params.id) return

    try {
      const { data } = await api.get<RefundAPIResponse>(`/refunds/${params.id}`)
      if (isMounted) {
        setName(data.name)
        setCategory(data.category)
        setAmount(formatCurrency(data.amount))
        setFileURL(data.fileName)
      }
    } catch (error) {
      if (!isMounted) return
      if (error instanceof AxiosError) {
        return alert(error.response?.data.message)
      }
      alert("Não foi possível carregar")
    }
  }

  load()

  return () => {
    isMounted = false
  }
}, [params.id])
```

## Variação: loading state durante o fetch

```typescript
const [isLoading, setIsLoading] = useState(false)

async function fetchRefund(id: string) {
  try {
    setIsLoading(true)
    const { data } = await api.get<RefundAPIResponse>(`/refunds/${id}`)

    setName(data.name)
    setCategory(data.category)
    setAmount(formatCurrency(data.amount))
    setFileURL(data.fileName)
  } catch (error) {
    if (error instanceof AxiosError) {
      return alert(error.response?.data.message)
    }
    alert("Não foi possível carregar")
  } finally {
    setIsLoading(false)
  }
}

// No JSX:
{isLoading ? (
  <p>Carregando...</p>
) : (
  <form>{/* inputs */}</form>
)}
```

## Padrão: reutilização da mesma página para criar e visualizar

```tsx
// routes.tsx
<Route path="/refunds/new" element={<RefundForm />} />
<Route path="/refunds/:id" element={<RefundForm />} />

// RefundForm.tsx
const params = useParams<{ id: string }>()
const isViewMode = !!params.id

// Condiciona todo o comportamento:
// - Se isViewMode: fetch dados, disable inputs, mostra comprovante
// - Se !isViewMode: inputs editáveis, mostra botão submit
```