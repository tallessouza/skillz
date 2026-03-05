# Code Examples: Search Input Sincronizado com URL

## Exemplo 1: Teste completo de busca

```typescript
describe("busca", () => {
  it("deveria navegar com URL codificado ao digitar e limpar", async () => {
    const { user } = setup()

    const searchInput = screen.getByPlaceholderText("Buscar prompt")

    // Usuario digita "a b" (com espaco)
    await user.type(searchInput, "a b")

    // Pega a ultima chamada do pushMock
    const lastCall = pushMock.mock.calls.at(-1)
    // Espaco vira %20 na URL codificada
    expect(lastCall?.[0]).toBe("?q=a%20b")

    // Usuario limpa o input
    await user.clear(searchInput)

    const lastClearCall = pushMock.mock.calls.at(-1)
    // Quando limpo, volta para raiz sem query params
    expect(lastClearCall?.[0]).toBe("/")
  })
})
```

## Exemplo 2: Componente com estado controlado + startTransition

```typescript
"use client"

import { useState, startTransition } from "react"
import { useRouter } from "next/navigation"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value

    // Atualiza o estado do input (urgente — React prioriza)
    setQuery(newQuery)

    // Marca a navegacao como nao-urgente
    startTransition(() => {
      const url = newQuery
        ? `?q=${encodeURIComponent(newQuery)}`
        : "/"
      router.push(url, { scroll: false })
    })
  }

  return (
    <input
      placeholder="Buscar prompt"
      value={query}
      onChange={handleQueryChange}
    />
  )
}
```

## Exemplo 3: Evolucao do codigo — antes e depois do startTransition

### Versao 1: Sem startTransition (funciona mas com gargalos)

```typescript
function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
  const newQuery = event.target.value
  setQuery(newQuery)

  // Problema: React trata isso como urgente
  const url = newQuery ? `?q=${encodeURIComponent(newQuery)}` : "/"
  router.push(url, { scroll: false })
}
```

O instrutor mostra que essa versao causa comportamento erratico: "Olha so que loucura que ele ta ali."

### Versao 2: Com startTransition (correta)

```typescript
function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
  const newQuery = event.target.value
  setQuery(newQuery)

  startTransition(() => {
    const url = newQuery ? `?q=${encodeURIComponent(newQuery)}` : "/"
    router.push(url, { scroll: false })
  })
}
```

Apos essa mudanca: "Agora sim a gente tem a espaço b, entao ta certinho."

## Exemplo 4: Pattern de validacao com mock.calls.at(-1)

```typescript
// Por que at(-1)?
// Ao digitar "a b", o mock e chamado 3 vezes:
// Chamada 1: "a"     → pushMock("?q=a")
// Chamada 2: "a "    → pushMock("?q=a%20")
// Chamada 3: "a b"   → pushMock("?q=a%20b")
//
// So a ultima chamada reflete o estado final

const lastCall = pushMock.mock.calls.at(-1)
expect(lastCall?.[0]).toBe("?q=a%20b")
```

## Exemplo 5: Teste com .only para isolar durante desenvolvimento

```typescript
// O instrutor usa .only para focar no teste em desenvolvimento
it.only("deveria navegar com URL codificado ao digitar e limpar", async () => {
  // ...teste
})
// Remover .only apos o teste passar
```