---
name: rs-full-stack-use-effect-na-pratica
description: "Enforces correct useEffect usage patterns when writing React components with side effects. Use when user asks to 'fetch data on mount', 'add useEffect', 'run code after render', 'listen for state changes', or 'handle component lifecycle'. Applies rules: place useEffect near return, always declare dependency array, empty array for mount-only effects. Make sure to use this skill whenever adding side effects to React components. Not for state management, event handlers, or non-React lifecycle code."
---

# UseEffect na Prática

> Posicione useEffect perto do return e sempre declare explicitamente o array de dependências.

## Rules

1. **Importe useEffect do React** — `import { useEffect } from 'react'`, porque é um Hook nativo e deve ser importado explicitamente
2. **Posicione useEffect perto do return** — coloque após toda a lógica de estado e variáveis, antes do return, porque useEffect é disparado após a renderização e essa posição reflete a ordem de execução mental
3. **Sempre declare o array de dependências** — segundo parâmetro obrigatório, porque omitir causa re-execução a cada render (bug silencioso)
4. **Array vazio = execução no mount** — `useEffect(() => { ... }, [])` executa apenas quando o componente é renderizado pela primeira vez, porque não há dependências para disparar re-execução
5. **Dependências mudam = useEffect re-executa** — se uma variável está no array, o efeito roda toda vez que ela muda, porque o React compara valores entre renders

## How to write

### Efeito básico (mount only)

```jsx
import { useEffect } from 'react'

function MyComponent() {
  const [data, setData] = useState(null)

  // Toda lógica de estado vem antes
  // useEffect fica perto do return
  useEffect(() => {
    console.log('Componente renderizado')
  }, []) // array vazio = só no mount

  return <div>{data}</div>
}
```

### Efeito com dependência

```jsx
useEffect(() => {
  console.log('searchTerm mudou:', searchTerm)
}, [searchTerm]) // re-executa quando searchTerm muda
```

## Example

**Before (sem array de dependências — bug):**

```jsx
function Greeting() {
  useEffect(() => {
    console.log('Oi')
  }) // SEM array = executa em TODA re-renderização

  return <h1>Olá</h1>
}
```

**After (com this skill applied):**

```jsx
function Greeting() {
  useEffect(() => {
    console.log('Oi')
  }, []) // array vazio = executa só no mount

  return <h1>Olá</h1>
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Fetch de dados na montagem | `useEffect(() => { fetch(...) }, [])` |
| Reagir a mudança de estado | Coloque a variável no array de dependências |
| Log/analytics no mount | `useEffect` com array vazio |
| Precisa de cleanup (listener, timer) | Retorne função de cleanup dentro do useEffect |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `useEffect(() => { ... })` (sem array) | `useEffect(() => { ... }, [])` ou `[dep]` |
| useEffect no topo do componente, antes dos estados | useEffect perto do return, após lógica de estado |
| Lógica de evento dentro de useEffect | Use event handler direto (`onClick`, `onSubmit`) |
| useEffect para derivar dados de estado | Calcule diretamente no corpo do componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando useEffect dispara e modelo mental de renderização
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações