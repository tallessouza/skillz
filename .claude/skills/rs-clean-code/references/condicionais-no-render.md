---
name: rs-clean-code-condicionais-no-render
description: "Enforces extracting conditional logic out of JSX render blocks in React components. Use when user asks to 'create a component', 'write JSX', 'add conditional rendering', 'show/hide elements', or any React render task. Moves JavaScript operations above the return statement into named boolean variables. Make sure to use this skill whenever writing React components with conditionals. Not for non-React code, CSS conditional styles, or server-side rendering logic."
---

# Condicionais no Render

> Mova operacoes JavaScript para acima do return, mantendo o JSX o mais declarativo possivel.

## Rules

1. **Nunca coloque logica condicional complexa dentro do JSX** — extraia para variaveis nomeadas acima do `return`, porque JSX deve ser uma camada de renderizacao declarativa, nao um lugar para operacoes JavaScript
2. **Nomeie booleanos pela condicao semantica** — `isToDoListEmpty` nao `todos.length === 0` inline, porque o nome comunica a intencao e facilita leitura do JSX
3. **Mantenha o HTML o menos dependente de JavaScript possivel** — quanto menos logica no JSX, mais facil de ler, manter e escalar o componente

## How to write

### Extrair condicional para variavel

```tsx
// Acima do return: logica JavaScript
const isToDoListEmpty = todos.length === 0

// No JSX: apenas a variavel booleana
return (
  <div>
    <ul>{/* ... */}</ul>
    {isToDoListEmpty && <p>Nenhum todo cadastrado</p>}
  </div>
)
```

## Example

**Before (logica no JSX):**
```tsx
return (
  <div>
    <ul>{/* ... */}</ul>
    {todos.length === 0 && <p>Nenhum todo cadastrado</p>}
    {user.role === 'admin' && user.isActive && <AdminPanel />}
    {items.filter(i => i.visible).length > 0 && <ItemCount />}
  </div>
)
```

**After (logica extraida):**
```tsx
const isToDoListEmpty = todos.length === 0
const isActiveAdmin = user.role === 'admin' && user.isActive
const hasVisibleItems = items.filter(i => i.visible).length > 0

return (
  <div>
    <ul>{/* ... */}</ul>
    {isToDoListEmpty && <p>Nenhum todo cadastrado</p>}
    {isActiveAdmin && <AdminPanel />}
    {hasVisibleItems && <ItemCount />}
  </div>
)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Condicional simples com uma unica variavel booleana | OK usar direto no JSX: `{isOpen && <Modal />}` |
| Qualquer comparacao, acesso a propriedade ou operacao | Extrair para variavel nomeada acima do return |
| Ternario com componentes grandes | Extrair para variavel ou componente separado |
| Multiplas condicoes combinadas com `&&` ou `\|\|` | Sempre extrair para variavel com nome semantico |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `{todos.length === 0 && <Empty />}` | `{isToDoListEmpty && <Empty />}` |
| `{user.role === 'admin' && <Admin />}` | `{isAdmin && <Admin />}` |
| `{data.filter(x => x.active).length > 0 && ...}` | `{hasActiveItems && ...}` |
| `{a && b && c ? <X /> : <Y />}` | `const shouldShowX = a && b && c` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-condicionais-no-render/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-condicionais-no-render/references/code-examples.md)
