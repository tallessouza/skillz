---
name: rs-full-stack-efeito-colateral
description: "Enforces correct useEffect dependency management when writing React components with side effects. Use when user asks to 'add useEffect', 'watch state changes', 'react to state updates', 'handle side effects', or 'run code when value changes'. Applies rules: always declare dependencies explicitly, guard side effects with conditionals, prevent invalid state transitions inside handlers. Make sure to use this skill whenever implementing useEffect with state dependencies or preventing negative counters. Not for data fetching, cleanup effects, or server-side rendering."
---

# Efeito Colateral com useEffect

> Declare explicitamente as dependências do useEffect para que efeitos colaterais executem apenas quando o estado relevante muda.

## Rules

1. **Sempre declare dependências explícitas** — coloque cada estado usado dentro do useEffect no array de dependências, porque dependências vazias `[]` significam "execute só na montagem", não "execute quando o estado mudar"
2. **Proteja efeitos com condicionais** — antes de executar lógica dentro do useEffect, valide o estado com `if (count > 0)`, porque efeitos executam em toda mudança, inclusive valores indesejados
3. **Previna estados inválidos no handler, não no efeito** — bloqueie transições inválidas (como valores negativos) na função que altera o estado (`handleRemove`), porque o useEffect é para reagir, não para prevenir
4. **Não use useEffect para lógica que pertence ao handler** — validação de limites (ex: não permitir negativo) vai no `handleRemove`, porque useEffect é efeito colateral da mudança, não guarda de entrada

## How to write

### useEffect com dependência de estado

```tsx
const [count, setCount] = useState(0)

useEffect(() => {
  if (count > 0) {
    console.log(`O valor mudou para ${count}`)
  }
}, [count])
```

### Handler com validação de limite

```tsx
function handleRemove() {
  if (count > 0) {
    setCount(prevState => prevState - 1)
  }
}

function handleAdd() {
  setCount(prevState => prevState + 1)
}
```

## Example

**Before (sem proteção e sem dependência correta):**

```tsx
function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("O valor mudou")
  }, []) // dependência vazia — nunca reage a count

  function handleRemove() {
    setCount(prevState => prevState - 1) // permite negativos
  }

  return (
    <div>
      <span>{count}</span>
      <button onClick={handleAdd}>Adicionar</button>
      <button onClick={handleRemove}>Remover</button>
    </div>
  )
}
```

**After (com this skill applied):**

```tsx
function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count > 0) {
      console.log(`O valor mudou para ${count}`)
    }
  }, [count]) // reage a toda mudança de count

  function handleAdd() {
    setCount(prevState => prevState + 1)
  }

  function handleRemove() {
    if (count > 0) {
      setCount(prevState => prevState - 1) // protege contra negativos
    }
  }

  return (
    <div>
      <span>{count}</span>
      <button onClick={handleAdd}>Adicionar</button>
      <button onClick={handleRemove}>Remover</button>
    </div>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Estado muda e precisa logar/notificar | useEffect com estado na dependência |
| Estado não pode ter valor inválido | Valide no handler antes do `setState` |
| Efeito só importa para valores > 0 | `if (value > 0)` dentro do useEffect |
| Múltiplos estados afetam o efeito | Liste todos no array de dependências |
| Mensagens repetidas no console | Normal — useEffect executa a cada mudança da dependência |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `useEffect(() => {...}, [])` quando depende de `count` | `useEffect(() => {...}, [count])` |
| `setCount(prev => prev - 1)` sem verificar limite | `if (count > 0) setCount(prev => prev - 1)` |
| Validação de limites dentro do useEffect | Validação de limites dentro do handler |
| `useEffect` sem array de dependências | Sempre declare `[dep1, dep2]` explicitamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre efeitos colaterais, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações