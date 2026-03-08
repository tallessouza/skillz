---
name: rs-full-stack-use-effect-em-outros-contextos
description: "Enforces correct placement of useEffect across components and custom hooks in React applications. Use when user asks to 'create a custom hook', 'add side effects', 'use useEffect in a component', 'build a reusable hook', or 'manage effects in multiple places'. Ensures each context (component, hook, app) owns its own useEffect independently. Make sure to use this skill whenever structuring side effects across React abstractions. Not for state management, event handlers, or server-side logic."
---

# useEffect em Múltiplos Contextos

> Cada componente e cada custom hook pode ter seu próprio useEffect — efeitos colaterais pertencem ao contexto que os necessita, não a um lugar centralizado.

## Regra central

1. **useEffect pertence ao contexto que precisa dele** — coloque o useEffect dentro do componente ou hook que efetivamente depende daquele efeito, porque isso mantém responsabilidades isoladas e facilita manutenção
2. **Custom hooks podem conter useEffect** — um hook personalizado não é apenas state + lógica; ele pode encapsular efeitos colaterais próprios, porque hooks são composições completas de comportamento React
3. **Múltiplos useEffect são normais** — ter um useEffect no App, outro num custom hook e outro num componente filho é esperado, porque cada contexto gerencia seus próprios efeitos independentemente

## Como escrever

### useEffect dentro de custom hook

```typescript
import { useState, useEffect } from "react"

function useMessage() {
  const [message, setMessage] = useState("Oi")

  // O hook encapsula seu próprio efeito colateral
  useEffect(() => {
    console.log("useEffect do useMessage")
  }, [])

  return { message, setMessage }
}
```

### useEffect dentro de componente

```typescript
import { useEffect } from "react"

function Button({ label }: { label: string }) {
  // Cada instância do componente executa seu próprio useEffect
  useEffect(() => {
    console.log("useEffect do componente Button")
  }, [])

  return <button>{label}</button>
}
```

### Múltiplos contextos coexistindo

```typescript
function App() {
  const { message } = useMessage() // tem useEffect interno

  useEffect(() => {
    console.log("useEffect do App")
  }, [])

  return (
    <div>
      <p>{message}</p>
      <Button label="Ação 1" /> {/* tem useEffect interno */}
      <Button label="Ação 2" /> {/* outra instância, outro useEffect */}
    </div>
  )
}
```

## Exemplo

**Before (efeitos centralizados no App):**
```typescript
function App() {
  const { message } = useMessage()

  // Todos os efeitos empilhados no componente pai
  useEffect(() => {
    console.log("log do message hook")
    console.log("log do botão")
    console.log("log do app")
  }, [])

  return <div><Button /><p>{message}</p></div>
}
```

**After (cada contexto com seu efeito):**
```typescript
// useMessage.ts — hook encapsula seu efeito
function useMessage() {
  const [message, setMessage] = useState("Oi")
  useEffect(() => {
    console.log("useEffect do useMessage")
  }, [])
  return { message, setMessage }
}

// Button.tsx — componente encapsula seu efeito
function Button() {
  useEffect(() => {
    console.log("useEffect do Button")
  }, [])
  return <button>Click</button>
}

// App.tsx — apenas seu próprio efeito
function App() {
  const { message } = useMessage()
  useEffect(() => {
    console.log("useEffect do App")
  }, [])
  return <div><Button /><p>{message}</p></div>
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Custom hook precisa buscar dados ou registrar listener | Coloque useEffect dentro do hook |
| Componente precisa de efeito no mount | Coloque useEffect dentro do componente |
| Dois componentes Button renderizados | Cada instância executa seu próprio useEffect |
| Efeito só faz sentido para um contexto específico | Mova o useEffect para esse contexto, não deixe no pai |
| Limpeza de código após experimentação | Remova useEffects de teste e suas importações |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| Centralizar todos os efeitos no App | Distribuir efeitos para o contexto que os necessita |
| Duplicar lógica de efeito entre pai e hook | Encapsular o efeito dentro do hook |
| Esquecer de limpar useEffect e imports após teste | Remover código de experimentação antes de commitar |
| Achar que hook só pode ter useState | Hooks podem combinar useState, useEffect e qualquer outro hook |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre distribuição de efeitos e modelo mental de contextos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações