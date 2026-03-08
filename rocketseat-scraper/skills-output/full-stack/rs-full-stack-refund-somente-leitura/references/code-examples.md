# Code Examples: Refund Somente Leitura

## 1. Registro de rotas reutilizando o componente

```tsx
// src/routes/manager-routes.tsx
import { Refund } from "../pages/refund"

const managerRoutes = [
  // ... outras rotas
  {
    path: "/refund/:id",
    element: <Refund />,
  },
]
```

```tsx
// src/routes/employee-routes.tsx
import { Refund } from "../pages/refund"

const employeeRoutes = [
  // ... outras rotas
  {
    path: "/refund",
    element: <Refund />,
  },
]
```

## 2. Componente completo com modo leitura

```tsx
// src/pages/refund.tsx
import { FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"

export function Refund() {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (params.id) {
      return navigate(-1)
    }

    // lógica de criação de solicitação
    console.log("Enviando solicitação...")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Descrição"
        disabled={!!params.id}
      />

      <Select
        label="Categoria"
        disabled={!!params.id}
      >
        <option value="transporte">Transporte</option>
        <option value="alimentacao">Alimentação</option>
      </Select>

      <Textarea
        label="Justificativa"
        disabled={!!params.id}
      />

      <Input
        type="number"
        label="Valor"
        disabled={!!params.id}
      />

      <button type="submit">
        {params.id ? "Voltar" : "Enviar"}
      </button>
    </form>
  )
}
```

## 3. Lista de refunds com navegação dinâmica no Dashboard

```tsx
// src/pages/dashboard.tsx
import { useState } from "react"
import { RefundItem, RefundItemProps } from "../components/refund-item"

export function Dashboard() {
  const [refunds] = useState<RefundItemProps[]>([
    {
      id: "123",
      description: "Uber para o escritório",
      category: "transporte",
      amount: 34,
      status: "pending",
    },
  ])

  return (
    <section>
      {refunds.map((item) => (
        <RefundItem
          key={item.id}
          href={`/refund/${item.id}`}
          {...item}
        />
      ))}
    </section>
  )
}
```

## 4. Componente RefundItem como link

```tsx
// src/components/refund-item.tsx
export interface RefundItemProps {
  id: string
  description: string
  category: string
  amount: number
  status: string
}

export function RefundItem({
  id,
  description,
  category,
  amount,
  href,
}: RefundItemProps & { href: string }) {
  return (
    <a href={href} className="my-6 block">
      <span>{description}</span>
      <span>{category}</span>
      <span>R$ {amount}</span>
    </a>
  )
}
```

## 5. Variação: extraindo `isReadOnly` para clareza

```tsx
function Refund() {
  const params = useParams<{ id: string }>()
  const isReadOnly = !!params.id

  return (
    <form>
      <Input disabled={isReadOnly} />
      <Select disabled={isReadOnly} />
      <Textarea disabled={isReadOnly} />
      <button>{isReadOnly ? "Voltar" : "Enviar"}</button>
    </form>
  )
}
```

## 6. Variação: upload condicional

```tsx
{params.id ? (
  <a href={`/uploads/${refund.fileName}`} target="_blank">
    Visualizar arquivo
  </a>
) : (
  <Upload label="Comprovante" />
)}
```

## 7. Espaçamento simétrico com Tailwind

```tsx
// Antes — só margem superior
<section className="mt-6">

// Depois — margem simétrica no eixo Y
<section className="my-6">
{/* my-6 = margin-top: 24px + margin-bottom: 24px */}
```