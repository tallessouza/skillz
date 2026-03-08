---
name: rs-full-stack-use-state-na-pratica
description: "Enforces correct useState patterns when writing React components with interactive state. Use when user asks to 'create a counter', 'add state to component', 'handle clicks', 'update UI on interaction', or 'manage component state'. Applies rules: destructure as [state, setState], always use set prefix, never use regular variables for UI-reflected data, extract handlers into named functions. Make sure to use this skill whenever creating interactive React components that update the UI. Not for global state management, useEffect, useReducer, or server-side state."
---

# useState na Prática

> Use useState sempre que um valor precisa disparar re-renderização ao mudar — variáveis comuns não atualizam a interface.

## Rules

1. **Importe useState do React no topo** — `import { useState } from "react"`, porque hooks são funções do React e devem ser importados antes de usar
2. **Desestruture como array** — `const [count, setCount] = useState(0)`, porque useState retorna `[estado, funcaoAtualizadora]`
3. **Prefixo set na função atualizadora** — `setCount`, `setName`, `setItems`, porque diferencia visualmente o estado da função que o modifica
4. **Use chaves no JSX para exibir estado** — `{count}` não `count`, porque sem chaves o React interpreta como texto literal
5. **Extraia handlers em funções nomeadas** — `handleAdd`, `handleRemove`, porque permite reutilizar e elimina arrow functions inline repetidas
6. **Nunca use variável comum para dados exibidos na tela** — variáveis `let` não disparam re-renderização, porque o React só re-renderiza quando setState é chamado

## How to write

### Declarando estado com valor inicial

```tsx
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)
  // ...
}
```

### Handlers separados para incremento/decremento

```tsx
function handleAdd() {
  setCount(count + 1)
}

function handleRemove() {
  setCount(count - 1)
}
```

### Conectando handlers aos botões

```tsx
<button onClick={handleAdd}>Adicionar</button>
<button onClick={handleRemove}>Remover</button>
<span>{count}</span>
```

## Example

**Before (variável comum — UI não atualiza):**

```tsx
function Counter() {
  let count = 0

  function handleAdd() {
    count = count + 1 // muda o valor mas NÃO re-renderiza
  }

  return (
    <div>
      <span>{count}</span>
      <button onClick={handleAdd}>Adicionar</button>
    </div>
  )
}
```

**After (useState — UI atualiza em tempo real):**

```tsx
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  function handleAdd() {
    setCount(count + 1) // dispara re-renderização
  }

  function handleRemove() {
    setCount(count - 1)
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
| Valor aparece na tela e muda com interação | Use `useState` |
| Valor temporário usado só na lógica interna | Use `const` ou `let` |
| Handler usado em um único botão | Função nomeada (`handleAdd`) é preferível a arrow inline |
| Handler com lógica de uma linha | Arrow inline no onClick é aceitável |
| Múltiplos botões alteram o mesmo estado | Crie handlers separados (`handleAdd`, `handleRemove`) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `let count = 0` (para exibir na tela) | `const [count, setCount] = useState(0)` |
| `count = count + 1` (mutação direta) | `setCount(count + 1)` |
| `const [count, count2] = useState(0)` | `const [count, setCount] = useState(0)` |
| `<span>count</span>` (texto literal) | `<span>{count}</span>` (expressão JSX) |
| `onClick={setCount(count + 1)}` (executa imediato) | `onClick={() => setCount(count + 1)}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que variáveis não re-renderizam e como o React detecta mudanças de estado
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula expandidos com variações