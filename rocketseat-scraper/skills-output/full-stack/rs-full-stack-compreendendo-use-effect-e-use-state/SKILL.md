---
name: rs-full-stack-compreendendo-use-effect-e-use-state
description: "Enforces correct useEffect and useState patterns when writing React components with side effects and state management. Use when user asks to 'filter a list', 'fetch data on mount', 'manage component state', 'add a side effect', or 'use hooks in React'. Applies rules: useEffect inside components only, dependency array controls re-execution, no async directly on useEffect callback, useState for immutable state updates. Make sure to use this skill whenever writing React hooks or managing component lifecycle. Not for Redux/Zustand global state, server components, or non-React frameworks."
---

# useEffect e useState — Hooks Fundamentais do React

> useEffect gerencia efeitos colaterais no ciclo de vida do componente; useState gerencia estado de forma imutável — ambos devem estar dentro de componentes.

## Rules

1. **useEffect sempre dentro de um componente** — porque precisa acessar os estados do componente para funcionar como efeito colateral
2. **Sem async direto no useEffect** — a arrow function do useEffect nao pode ser async; declare a funcao async dentro do corpo do useEffect e chame-a, porque useEffect espera retorno void ou cleanup function
3. **Array de dependencias vazio = executa uma vez** — sem dependencia, o useEffect roda apenas na montagem do componente
4. **Array com estado = reexecuta quando estado muda** — colocar um estado no array faz o useEffect disparar novamente a cada mudanca daquele estado
5. **useState retorna [estado, funcaoSet]** — primeira posicao e o valor, segunda e a funcao que atualiza; nunca altere o estado diretamente, porque React depende da imutabilidade para controlar renderizacao
6. **Use a funcao set para atualizar estado** — o estado e imutavel por design; `setName(newValue)` e a unica forma correta de atualizar

## How to write

### useState basico

```tsx
const [name, setName] = useState("")
// "" e o valor inicial
// name = leitura do estado
// setName = funcao para atualizar
```

### useEffect com dependencia de estado

```tsx
function ProductList() {
  const [category, setCategory] = useState("tenis")
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadProducts() {
      const filtered = await fetchProductsByCategory(category)
      setProducts(filtered)
    }
    loadProducts()
  }, [category])

  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}
```

### useEffect que roda uma vez (montagem)

```tsx
useEffect(() => {
  console.log("Componente montado")
}, [])
```

## Example

**Before (erros comuns):**
```tsx
// ERRO: async direto no useEffect
useEffect(async () => {
  const data = await fetchData()
  setData(data)
}, [])

// ERRO: mutando estado diretamente
name = "novo valor"
```

**After (com esta skill aplicada):**
```tsx
useEffect(() => {
  async function loadData() {
    const data = await fetchData()
    setData(data)
  }
  loadData()
}, [])

// Correto: usando funcao set
setName("novo valor")
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Carregar dados na montagem | useEffect com array vazio `[]` |
| Reagir a mudanca de filtro/estado | useEffect com `[estado]` no array |
| Precisa de chamada async | Declare funcao async dentro do useEffect, chame-a |
| Precisa de valor reativo no componente | useState com valor inicial adequado |
| Quer atualizar estado | Use exclusivamente a funcao set retornada pelo useState |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `useEffect(async () => {...}, [])` | `useEffect(() => { async function load() {...} load() }, [])` |
| `state = newValue` | `setState(newValue)` |
| useEffect fora de componente | useEffect dentro do corpo do componente |
| useEffect sem array de dependencias (loop infinito) | useEffect com `[]` ou `[dep]` explicito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ciclo de vida, imutabilidade e conexao entre hooks
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes