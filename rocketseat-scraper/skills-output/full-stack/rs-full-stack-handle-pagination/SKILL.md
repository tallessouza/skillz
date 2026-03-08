---
name: rs-full-stack-handle-pagination
description: "Enforces React pagination component patterns when implementing page navigation, disabling boundary buttons, or managing current/total page state. Use when user asks to 'add pagination', 'create page navigation', 'handle next/previous buttons', 'disable button at last page', or 'implement page controls'. Applies setState with previous value pattern, boundary checks, and disabled button UX. Make sure to use this skill whenever building any list pagination UI. Not for server-side pagination queries, infinite scroll, or cursor-based pagination."
---

# handlePagination — Navegação entre Páginas

> Controle a navegação de páginas com estado local, função única para ambas direções, e desabilite botões nos limites para feedback visual imediato.

## Rules

1. **Use setState com callback de valor anterior** — `setPage(prevPage => ...)` não `setPage(page + 1)`, porque evita race conditions quando múltiplos cliques acontecem rapidamente
2. **Uma única função para ambas direções** — receba `action: "next" | "previews"` como parâmetro, porque reduz duplicação e centraliza a lógica de limites
3. **Sempre use comparação estrita (`===`)** — compare valor E tipo, porque `"1" == 1` é `true` e causa bugs silenciosos
4. **Retorne o estado atual quando no limite** — não lance erro nem ignore, porque o usuário percebe que nada mudou e o botão desabilitado confirma
5. **Desabilite botões nos limites visuais** — `disabled={current === 1}` para voltar, `disabled={current === total}` para avançar, porque feedback visual previne cliques inúteis
6. **Separe loading de disabled** — botão desabilitado por limite não deve mostrar cursor de loading, porque são estados semânticos diferentes

## How to write

### Estado de paginação no componente pai

```tsx
const [page, setPage] = useState(1)
const [totalOfPages, setTotalOfPages] = useState(10)
```

### Função handlePagination

```tsx
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
```

### Passando callbacks como props

```tsx
<Pagination
  current={page}
  total={totalOfPages}
  onNext={() => handlePagination("next")}
  onPreviews={() => handlePagination("previews")}
/>
```

### Componente Pagination com disabled

```tsx
function Pagination({ current, total, onNext, onPreviews }: PaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onPreviews} disabled={current === 1}>
        <ChevronLeft className="size-8" />
      </Button>
      <span>{current} de {total}</span>
      <Button onClick={onNext} disabled={current === total}>
        <ChevronRight className="size-8" />
      </Button>
    </div>
  )
}
```

### Botão com loading vs disabled separados

```tsx
<button
  disabled={disabled || isLoading}
  className={clsx(
    "rounded p-2",
    isLoading && "cursor-progress",
    disabled && !isLoading && "cursor-not-allowed opacity-50"
  )}
>
  {children}
</button>
```

## Example

**Before (lógica separada, sem limites):**
```tsx
function Dashboard() {
  const [page, setPage] = useState(1)

  return (
    <div>
      <button onClick={() => setPage(page - 1)}>Voltar</button>
      <span>{page}</span>
      <button onClick={() => setPage(page + 1)}>Avançar</button>
    </div>
  )
}
```

**After (com limites, disabled, e função única):**
```tsx
function Dashboard() {
  const [page, setPage] = useState(1)
  const [totalOfPages, setTotalOfPages] = useState(10)

  function handlePagination(action: "next" | "previews") {
    setPage((prevPage) => {
      if (action === "next" && prevPage < totalOfPages) return prevPage + 1
      if (action === "previews" && prevPage > 1) return prevPage - 1
      return prevPage
    })
  }

  return (
    <Pagination
      current={page}
      total={totalOfPages}
      onNext={() => handlePagination("next")}
      onPreviews={() => handlePagination("previews")}
    />
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Total de páginas vem da API | Use `setTotalOfPages` ao receber resposta |
| Página atual controlada no pai | Passe `current` e callbacks como props |
| Botão no limite (página 1 ou última) | `disabled={true}` + cursor visual diferente |
| Botão carregando dados | `cursor-progress` separado de `disabled` |
| Tailwind: ícone dentro do botão | Use `size-8` (32px) para botões compactos |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `setPage(page + 1)` | `setPage(prev => prev + 1)` |
| `page == 1` | `page === 1` |
| `onClick={() => setPage(page + 1)}` sem limite | `handlePagination("next")` com verificação |
| Cursor progress em botão apenas desabilitado | `cursor-not-allowed` para disabled, `cursor-progress` para loading |
| Duas funções `handleNext` e `handlePrev` | Uma `handlePagination(action)` com parâmetro |
| Nenhum feedback visual no limite | `disabled` + estilo visual de bloqueio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre setState com callback, separação de loading vs disabled, e padrões de UX em paginação
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cenários de paginação