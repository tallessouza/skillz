---
name: rs-clean-code-funcoes-eventos-react
description: "Enforces handle/on naming convention for React functions and event props. Use when user asks to 'create a component', 'add event handler', 'write onClick', 'implement callback prop', or any React component with user interactions. Applies rules: prefix internal event functions with 'handle', prefix callback props with 'on', matching HTML event naming patterns. Make sure to use this skill whenever generating React components with events or callbacks. Not for utility functions, API calls, or non-React code."
---

# Funcoes e Eventos no React

> Prefixe funcoes internas de evento com `handle` e props de callback com `on`, separando claramente acoes locais de comunicacao com componentes pai.

## Rules

1. **Funcoes internas disparadas por eventos do usuario usam `handle`** — `handleClick`, `handleSubmit`, `handleCreateNewTodo`, porque diferencia visualmente funcoes de evento de funcoes auxiliares (calculos, chamadas API, formatacao)
2. **Props que recebem callbacks de eventos usam `on`** — `onCreateItem`, `onDelete`, `onSubmit`, porque segue o padrao nativo do HTML (`onClick`, `onMouseOver`, `onFocus`, `onBlur`) e comunica que e um evento sendo propagado ao componente pai
3. **Funcoes auxiliares NAO usam handle nem on** — funcoes de calculo, formatacao, chamada API ficam sem prefixo, porque nao sao disparadas diretamente por eventos do usuario
4. **Mantenha consistencia no time** — o padrao escolhido deve ser o mesmo em todos os componentes do projeto, porque inconsistencia gera confusao sobre a natureza de cada funcao

## How to write

### Funcao interna de evento (handle)

```tsx
function TodoForm() {
  function handleCreateNewTodo() {
    // logica disparada pelo evento do usuario
  }

  return <form onSubmit={handleCreateNewTodo}>...</form>
}
```

### Prop de callback (on)

```tsx
interface HeaderProps {
  onCreateNewTodo: (title: string) => void
}

function Header({ onCreateNewTodo }: HeaderProps) {
  function handleSubmit() {
    onCreateNewTodo(title)
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### Componente pai conectando ambos

```tsx
function App() {
  function handleCreateNewTodo(title: string) {
    // handle no pai — e ele quem reage ao evento
  }

  return <Header onCreateNewTodo={handleCreateNewTodo} />
}
```

## Example

**Before:**
```tsx
function Header({ createTodo }: { createTodo: () => void }) {
  function submit() {
    createTodo()
  }
  return <button onClick={submit}>Add</button>
}

function App() {
  function addTodo() { /* ... */ }
  return <Header createTodo={addTodo} />
}
```

**After (with this skill applied):**
```tsx
function Header({ onCreateTodo }: { onCreateTodo: () => void }) {
  function handleClick() {
    onCreateTodo()
  }
  return <button onClick={handleClick}>Add</button>
}

function App() {
  function handleCreateTodo() { /* ... */ }
  return <Header onCreateTodo={handleCreateTodo} />
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Funcao criada dentro do componente, chamada por onClick/onSubmit/onChange | Prefixe com `handle` |
| Prop que recebe funcao callback de evento | Prefixe com `on` |
| Funcao auxiliar (formatar data, calcular total) | Sem prefixo — nome descritivo direto |
| Componente pai recebe evento do filho e reage | `handle` no pai, `on` na prop do filho |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `onClick={submit}` (funcao interna sem handle) | `onClick={handleSubmit}` |
| `createTodo` como prop de callback | `onCreateTodo` como prop de callback |
| `onCalculateTotal` (nao e evento do usuario) | `calculateTotal` (funcao auxiliar) |
| `handleFetchUsers` (nao e disparada por evento) | `fetchUsers` (chamada API) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-funcoes-e-eventos-no-react/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-funcoes-e-eventos-no-react/references/code-examples.md)
