# Code Examples: fetchRefunds — Busca Paginada com Axios

## Exemplo 1: Setup completo do componente

```typescript
import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { api } from "@/services/api"

const PER_PAGE = 5

export function Dashboard() {
  const [name, setName] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [refunds, setRefunds] = useState([])

  async function fetchRefunds() {
    try {
      const response = await api.get(
        `/refunds?name=${name.trim()}&page=${page}&per_page=${PER_PAGE}`
      )

      setRefunds(response.data.refunds)
      setTotalPages(response.data.pagination.totalPages)
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message)
      } else {
        alert("Não foi possível carregar as solicitações.")
      }
    }
  }

  useEffect(() => {
    fetchRefunds()
  }, [])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    fetchRefunds()
  }

  return (
    <div>
      <h1>Solicitações</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pesquisar por nome"
        />
        <button type="submit">Pesquisar</button>
      </form>

      {refunds.map((refund) => (
        <RefundItem key={refund.id} data={refund} />
      ))}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
```

## Exemplo 2: Imports separados — API e AxiosError

```typescript
// Importação da instância configurada do Axios
import { api } from "@/services/api"

// Importação do tipo de erro separadamente
import { AxiosError } from "axios"
```

O `api` é uma instância do Axios com `baseURL` configurada. O `AxiosError` vem diretamente do pacote `axios` para uso com `instanceof`.

## Exemplo 3: Construção da URL com query params

### Errado (causa erro de validação)
```typescript
// Usando $ ao invés de &
const response = await api.get(
  `/refunds?name=${name.trim()}$page=${page}$per_page=${PER_PAGE}`
)
// A API recebe: name="João$page=1$per_page=5", page=undefined, per_page=undefined
// Resultado: { issues: [{ path: "page", message: "Expected number, received nan" }] }
```

### Correto
```typescript
const response = await api.get(
  `/refunds?name=${name.trim()}&page=${page}&per_page=${PER_PAGE}`
)
// A API recebe: name="João", page=1, per_page=5
```

## Exemplo 4: Estrutura de resposta da API

```json
{
  "refunds": [
    {
      "id": "abc123",
      "description": "Participação do evento",
      "amount": 15000,
      "status": "pending",
      "userName": "João Silva",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 5,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

## Exemplo 5: Tratamento de erro completo

```typescript
try {
  const response = await api.get(
    `/refunds?name=${name.trim()}&page=${page}&per_page=${PER_PAGE}`
  )
  console.log(response.data)
} catch (error) {
  // Camada 1: erro da API com mensagem descritiva
  if (error instanceof AxiosError) {
    // error.response?.data pode conter:
    // { message: "Token inválido" }
    // { message: "Usuário não autorizado" }
    // { issues: [{ path: "page", message: "Expected number" }] }
    alert(error.response?.data?.message)
  } else {
    // Camada 2: erro genérico (rede, timeout, etc)
    alert("Não foi possível carregar as solicitações.")
  }
}
```

## Exemplo 6: useEffect para carga inicial

```typescript
// Chama fetchRefunds uma vez quando o componente monta
useEffect(() => {
  fetchRefunds()
}, [])
```

A mesma função é reutilizada no `onSubmit` do formulário:

```typescript
<form onSubmit={(e) => {
  e.preventDefault()
  fetchRefunds()
}}>
```

## Exemplo 7: Variação — usando params do Axios ao invés de template literal

```typescript
// Alternativa: passar params como objeto (Axios serializa automaticamente)
const response = await api.get("/refunds", {
  params: {
    name: name.trim(),
    page,
    per_page: PER_PAGE,
  },
})
```

Esta abordagem evita o risco de errar separadores (`$` vs `&`) porque o Axios constrói a query string automaticamente. É uma alternativa válida ao template literal usado na aula.

## Exemplo 8: Controller da API (backend)

O controller que recebe esta requisição:

```typescript
// routes/refund.routes.ts
router.get("/refunds", ensureAuthenticated, refundController.index)

// controllers/refundController.ts
async index(request: Request, response: Response) {
  const { name, page, per_page } = request.query

  const pageNumber = Number(page)
  const perPage = Number(per_page)
  const skip = (pageNumber - 1) * perPage

  const refunds = await prisma.refund.findMany({
    where: {
      user: {
        name: { contains: String(name), mode: "insensitive" }
      }
    },
    skip,
    take: perPage,
    orderBy: { createdAt: "desc" }
  })

  const totalItems = await prisma.refund.count({
    where: {
      user: {
        name: { contains: String(name), mode: "insensitive" }
      }
    }
  })

  const totalPages = Math.ceil(totalItems / perPage)

  return response.json({
    refunds,
    pagination: { page: pageNumber, perPage, totalPages, totalItems }
  })
}
```