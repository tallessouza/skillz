# Code Examples: Consulta — Form Submit sem Refresh

## Exemplo 1: Padrao basico da aula

```tsx
import { useEffect, useState } from "react"

export function RefundList() {
  const [search, setSearch] = useState("")
  const [refunds, setRefunds] = useState([])

  async function fetchRefunds() {
    const response = await fetch(`/api/refunds?search=${search}`)
    const data = await response.json()
    setRefunds(data)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetchRefunds()
  }

  useEffect(() => {
    fetchRefunds()
  }, [])

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar..."
      />
      <button type="submit">Pesquisar</button>

      <ul>
        {refunds.map((refund) => (
          <li key={refund.id}>{refund.name}</li>
        ))}
      </ul>
    </form>
  )
}
```

## Exemplo 2: Com loading state

```tsx
function onSubmit(e: React.FormEvent) {
  e.preventDefault()
  fetchRefunds()
}

async function fetchRefunds() {
  setIsLoading(true)
  try {
    const response = await fetch(`/api/refunds?search=${search}`)
    const data = await response.json()
    setRefunds(data)
  } finally {
    setIsLoading(false)
  }
}
```

## Exemplo 3: Limpar pesquisa e rebuscar

```tsx
function handleClear() {
  setSearch("")
  // Busca sem filtro — chama fetchRefunds diretamente, sem evento
  fetchRefunds()
}

function onSubmit(e: React.FormEvent) {
  e.preventDefault()
  fetchRefunds()
}
```

## Exemplo 4: Anti-pattern — preventDefault dentro do fetch

```tsx
// ERRADO: mistura responsabilidades
async function fetchRefunds(e?: React.FormEvent) {
  e?.preventDefault() // funciona, mas viola separacao de responsabilidades
  const response = await fetch(`/api/refunds?search=${search}`)
  const data = await response.json()
  setRefunds(data)
}

// useEffect chama sem evento
useEffect(() => {
  fetchRefunds() // e sera undefined — funciona, mas e confuso
}, [])

// form passa o evento
<form onSubmit={fetchRefunds}>
```

## Exemplo 5: Variacao com debounce (extensao do padrao)

```tsx
// Se quiser buscar enquanto digita (sem precisar de Enter/clique)
useEffect(() => {
  const timer = setTimeout(() => {
    fetchRefunds()
  }, 500)

  return () => clearTimeout(timer)
}, [search])

// Mantem onSubmit para busca imediata com Enter
function onSubmit(e: React.FormEvent) {
  e.preventDefault()
  fetchRefunds()
}
```

## Exemplo 6: Multiplos filtros no formulario

```tsx
function RefundList() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")

  async function fetchRefunds() {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (status !== "all") params.set("status", status)

    const response = await fetch(`/api/refunds?${params}`)
    const data = await response.json()
    setRefunds(data)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetchRefunds()
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">Todos</option>
        <option value="pending">Pendente</option>
        <option value="approved">Aprovado</option>
      </select>
      <button type="submit">Filtrar</button>
    </form>
  )
}
```