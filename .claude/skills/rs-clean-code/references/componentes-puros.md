---
name: rs-clean-code-componentes-puros
description: "Enforces pure component patterns when creating or refactoring React components. Use when user asks to 'create a component', 'extract a component', 'refactor component', 'decouple component', or 'separate into components'. Ensures components receive behavior via props instead of embedding business logic, maintaining context-independence and reusability. Make sure to use this skill whenever extracting or splitting React components. Not for state management architecture, styling, or non-React code."
---

# Componentes Puros

> Ao extrair um componente React, garanta que ele nao depende do contexto onde vive — receba comportamento via props, nunca embutido.

## Rules

1. **Componente puro recebe comportamento via props** — passe funcoes como `onCreateNewTodo` via props em vez de definir logica de negocio dentro do componente, porque isso permite reutilizar o componente em qualquer lugar da aplicacao
2. **Separar arquivo nao e desacoplar** — mover JSX e JS juntos para outro arquivo cria dependencia invisivel com o pai, porque o componente so funciona naquele contexto especifico
3. **Teste do desacoplamento: mova o componente** — se voce nao consegue pegar o componente e colocar em outro lugar da aplicacao sem quebrar, ele nao esta desacoplado, apenas separado em dois arquivos
4. **Leve apenas logica que mantem pureza** — ao extrair, mova somente a logica que nao depende de estado externo ou side effects (chamadas API, mutacoes de estado do pai)
5. **Use props tipadas para contratos claros** — defina uma interface com as funcoes que o componente precisa receber, porque isso documenta exatamente do que ele depende

## How to write

### Componente puro com comportamento via props

```typescript
interface HeaderProps {
  onCreateNewTodo: () => Promise<void>
}

function Header({ onCreateNewTodo }: HeaderProps) {
  return (
    <header>
      <button onClick={onCreateNewTodo}>Adicionar</button>
    </header>
  )
}
```

### Componente pai fornece o comportamento

```typescript
function App() {
  const [todos, setTodos] = useState<Todo[]>([])

  async function createTodo() {
    const newTodo = await api.post('/todos', { title: 'Novo todo' })
    setTodos(prev => [...prev, newTodo])
  }

  return <Header onCreateNewTodo={createTodo} />
}
```

## Example

**Before (logica de negocio embutida no componente extraido):**

```typescript
function Header() {
  const [todos, setTodos] = useContext(TodoContext)

  async function createTodo() {
    const response = await api.post('/todos')
    setTodos(prev => [...prev, response.data])
  }

  return <button onClick={createTodo}>Adicionar</button>
}
```

**After (componente puro — comportamento via props):**

```typescript
interface HeaderProps {
  onCreateNewTodo: () => void
}

function Header({ onCreateNewTodo }: HeaderProps) {
  return <button onClick={onCreateNewTodo}>Adicionar</button>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Extraindo componente com chamada API | Mova a chamada API para o pai, passe callback via props |
| Componente precisa de estado do pai | Passe o estado como prop, nao use context para acoplar |
| Funcao dentro do componente muta estado externo | Essa funcao pertence ao pai, nao ao componente extraido |
| Componente usa useEffect para fetch | Avalie se o fetch pertence ao pai e o dado vem como prop |
| Componente e puramente visual (so render) | Ja e puro — mantenha assim |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `function Header() { const data = await fetch(...) }` | `function Header({ data }: Props)` recebendo dados do pai |
| `function Card() { setParentState(...) }` | `function Card({ onAction }: Props)` callback via prop |
| Componente que importa contexto global para funcionar | Componente que recebe tudo via props |
| Extrair componente levando toda a logica junto | Extrair apenas interface, comportamento fica no pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-componentes-puros/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-componentes-puros/references/code-examples.md)
