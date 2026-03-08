---
name: rs-full-stack-introducao-a-hooks
description: "Enforces React Hooks fundamentals when working with useState, useEffect, or creating custom hooks in React components. Use when user asks to 'add state to a component', 'create a hook', 'use useEffect', 'manage component state', or 'handle side effects in React'. Applies rules: useState for reactive state, useEffect for side effects, custom hooks for reusable stateful logic. Make sure to use this skill whenever writing React functional components that need state or lifecycle behavior. Not for class components, Redux/Zustand global state, or server-side rendering."
---

# Introdução a Hooks no React

> Hooks são a interface fundamental para adicionar estado e efeitos colaterais a componentes funcionais do React.

## Key concept

Hooks são funções especiais do React que permitem "conectar" funcionalidades do React (estado, ciclo de vida, contexto) a componentes funcionais. Os dois hooks mais utilizados são `useState` (estado reativo) e `useEffect` (efeitos colaterais). Além dos hooks nativos, é possível criar custom hooks para encapsular lógica stateful reutilizável.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Componente precisa de valor que muda ao longo do tempo | `useState` — estado reativo local |
| Componente precisa reagir a mudanças externas (API, timer, DOM) | `useEffect` — efeitos colaterais |
| Mesma lógica stateful repetida em múltiplos componentes | Custom hook — extrair e reutilizar |
| Estado compartilhado entre componentes distantes | Context API ou state manager externo (não hooks locais) |

## How to think about it

### useState — Estado reativo

O `useState` transforma uma variável comum em estado reativo. Quando o estado muda, o React re-renderiza o componente automaticamente.

```typescript
const [count, setCount] = useState(0)
```

Sem `useState`, mudar uma variável não causa re-render — a UI fica dessincronizada dos dados.

### useEffect — Efeitos colaterais

O `useEffect` executa código em resposta a mudanças no componente. É o ponto de conexão entre o React e o mundo externo (APIs, timers, event listeners).

```typescript
useEffect(() => {
  fetchUsers()
}, [])
```

### Custom Hooks — Lógica reutilizável

Quando a mesma combinação de `useState` + `useEffect` se repete, extraia para um custom hook. A convenção é prefixar com `use`.

```typescript
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
```

## Common misconceptions

| O que pensam | Realidade |
|-------------|-----------|
| Hooks substituem classes completamente | Hooks oferecem as mesmas capacidades de forma mais composável, mas classes ainda funcionam |
| `useEffect` é o novo `componentDidMount` | `useEffect` tem modelo mental diferente — sincroniza com dependências, não com ciclo de vida |
| Custom hooks são complexos de criar | Um custom hook é apenas uma função que usa outros hooks — mesmas regras |
| Precisa de muitos hooks para começar | `useState` e `useEffect` cobrem a grande maioria dos casos |

## When to apply

- Qualquer componente funcional que precise de estado local
- Componentes que fazem chamadas a APIs ou interagem com o DOM
- Lógica stateful que se repete em mais de um componente (custom hooks)
- Sempre que trabalhar com React moderno (funcional, não classes)

## Limitations

- Hooks só funcionam dentro de componentes funcionais ou outros hooks
- Não podem ser chamados condicionalmente (devem estar no top-level do componente)
- Estado local via hooks não substitui gerenciamento global (Redux, Zustand) para estado compartilhado entre árvores distantes
- `useEffect` não é ideal para lógica de renderização — use derivação de estado quando possível

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Modelo mental completo de hooks, analogias e regras de uso
- [code-examples.md](references/code-examples.md) — Exemplos práticos de useState, useEffect e custom hooks