# Code Examples: handlePagination

## Exemplo 1 — Estado de paginação no Dashboard

```tsx
// dashboard.tsx
import { useState } from "react"
import { Pagination } from "./pagination"

export function Dashboard() {
  const [page, setPage] = useState(1)
  const [totalOfPages, setTotalOfPages] = useState(10)

  function handlePagination(action: "next" | "previews") {
    setPage((prevPage) => {
      if (action === "next" && prevPage < totalOfPages) {
        return prevPage + 1
      }

      if (action === "previews" && prevPage > 1) {
        return prevPage - 1
      }

      return prevPage
    })
  }

  return (
    <div>
      {/* conteúdo da lista */}
      <Pagination
        current={page}
        total={totalOfPages}
        onNext={() => handlePagination("next")}
        onPreviews={() => handlePagination("previews")}
      />
    </div>
  )
}
```

## Exemplo 2 — Componente Pagination com disabled nos limites

```tsx
// pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

interface PaginationProps {
  current: number
  total: number
  onNext: () => void
  onPreviews: () => void
}

export function Pagination({ current, total, onNext, onPreviews }: PaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onPreviews}
        disabled={current === 1}
      >
        <ChevronLeft className="size-8" />
      </Button>

      <span>
        {current} de {total}
      </span>

      <Button
        onClick={onNext}
        disabled={current === total}
      >
        <ChevronRight className="size-8" />
      </Button>
    </div>
  )
}
```

## Exemplo 3 — Componente Button com loading vs disabled separados

```tsx
// button.tsx — ANTES (bug)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export function Button({ isLoading, disabled, className, children, ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        "rounded p-2",
        // BUG: cursor-progress ativa para QUALQUER disabled, não só loading
        (disabled || isLoading) && "cursor-progress"
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
```

```tsx
// button.tsx — DEPOIS (corrigido)
export function Button({ isLoading, disabled, className, children, ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        "rounded p-2",
        isLoading && "cursor-progress",
        disabled && !isLoading && "cursor-not-allowed opacity-50"
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
```

## Exemplo 4 — Ajustes de Tailwind no componente

### Tamanho do ícone
```tsx
// size-10 = 40px (antes)
<ChevronLeft className="size-10" />

// size-8 = 32px (depois — mais compacto)
<ChevronLeft className="size-8" />
```

O instrutor nota: "Você não precisa decorar. Você pode usar essas dicas aqui para você saber o que é esse 8." No VS Code com Tailwind IntelliSense, ao passar o mouse sobre `size-8`, ele mostra `width: 32px; height: 32px`.

### Espaçamento entre botões
```tsx
// gap-4 (antes — espaçamento maior)
<div className="flex items-center gap-4">

// gap-2 (depois — mais compacto)
<div className="flex items-center gap-2">
```

## Exemplo 5 — Variação: Paginação integrada com API

```tsx
// Variação para quando totalOfPages vem da API
export function Dashboard() {
  const [page, setPage] = useState(1)
  const [totalOfPages, setTotalOfPages] = useState(1)
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch(`/api/items?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setItems(data.items)
        setTotalOfPages(data.totalPages)
      })
  }, [page])

  function handlePagination(action: "next" | "previews") {
    setPage((prevPage) => {
      if (action === "next" && prevPage < totalOfPages) return prevPage + 1
      if (action === "previews" && prevPage > 1) return prevPage - 1
      return prevPage
    })
  }

  return (
    <div>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <Pagination
        current={page}
        total={totalOfPages}
        onNext={() => handlePagination("next")}
        onPreviews={() => handlePagination("previews")}
      />
    </div>
  )
}
```

## Exemplo 6 — Teste mental dos limites

```
Página 1, total 10:
  handlePagination("previews")
    → prevPage(1) > 1? NÃO
    → return 1 (mantém)
  
  handlePagination("next")
    → prevPage(1) < 10? SIM
    → return 2 (avança)

Página 10, total 10:
  handlePagination("next")
    → prevPage(10) < 10? NÃO
    → return 10 (mantém)
  
  handlePagination("previews")
    → prevPage(10) > 1? SIM
    → return 9 (volta)

Página 5, total 10:
  Ambas direções funcionam normalmente
```