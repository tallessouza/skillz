---
name: rs-full-stack-criando-seu-proprio-hook-2024
description: "Enforces custom React hook creation patterns when encapsulating reusable logic, extracting state and methods into hooks, or organizing hook files. Use when user asks to 'create a hook', 'extract logic into a hook', 'make a custom hook', 'encapsulate state', or 'reuse component logic'. Applies rules: use prefix naming, .ts extension for non-rendering hooks, object params for extensibility, hooks/ folder organization, proper export/import. Make sure to use this skill whenever creating or refactoring custom hooks. Not for built-in hooks usage (useState, useEffect), component rendering, or CSS styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-hooks
  tags: [react, custom-hooks, typescript, reusability, encapsulation]
---

# Criando Custom Hooks em React

> Custom hooks encapsulam logica reutilizavel em funcoes prefixadas com `use`, retornando objetos com metodos e estados compartilhaveis.

## Rules

1. **Prefixe sempre com `use`** — `useMessage`, `useAuth`, `useCart`, porque o React identifica hooks pelo prefixo e aplica as regras de hooks automaticamente
2. **Use `.ts`, nunca `.tsx`** — hooks encapsulam logica, nao renderizam componentes; `.tsx` e para arquivos que retornam JSX
3. **Organize em `src/hooks/`** — cada hook em arquivo separado (`useMessage.ts`), porque manter hooks no componente polui o arquivo e impede reuso
4. **Retorne objetos, nao valores soltos** — `return { show, hide, data }`, porque permite desestruturacao seletiva e extensao sem breaking changes
5. **Receba props como objeto tipado** — `function useMessage({ name, age }: Props)`, porque ordem dos parametros nao importa em objetos, evitando erros silenciosos
6. **Separe props do hook vs props do metodo** — propriedades compartilhadas com todo o escopo do hook vao no parametro do hook; propriedades especificas de um metodo vao no parametro do metodo

## How to write

### Estrutura basica do hook

```typescript
// src/hooks/useMessage.ts
type Props = {
  name: string
  age: number
}

export function useMessage({ name, age }: Props) {
  function show(message: string) {
    console.log(name, age, message)
  }

  return { show }
}
```

### Uso no componente

```typescript
// Desestruture direto para acesso limpo
const { show } = useMessage({ name: "Rodrigo", age: 18 })

// Uso no evento
<button onClick={() => show("Mensagem personalizada")}>
  Adicionar
</button>
```

## Example

**Before (logica acoplada no componente):**
```typescript
// App.tsx — hook definido dentro do componente
function App() {
  function useMessage() {
    function show() {
      console.log("mensagem fixa")
    }
    return { show }
  }

  const message = useMessage()

  return <button onClick={() => message.show()}>Adicionar</button>
}
```

**After (hook extraido, tipado, extensivel):**
```typescript
// src/hooks/useMessage.ts
type Props = {
  name: string
}

export function useMessage({ name }: Props) {
  function show(message: string) {
    console.log(name, message)
  }

  return { show }
}

// App.tsx
import { useMessage } from "./hooks/useMessage"

function App() {
  const { show } = useMessage({ name: "Rodrigo" })

  return (
    <button onClick={() => show("Mensagem personalizada")}>
      Adicionar
    </button>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Logica usada em 1 componente apenas | Pode manter no componente, extraia se crescer |
| Logica usada em 2+ componentes | Extraia para `src/hooks/useNome.ts` |
| Hook precisa de estado interno | Use `useState`/`useReducer` dentro do hook |
| Hook precisa compartilhar dados com todos os metodos | Passe como prop do hook (objeto tipado) |
| Dado e especifico de um metodo | Passe como parametro do metodo |
| Hook retorna apenas 1 valor | Ainda retorne objeto `{ value }` para extensibilidade futura |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `function useX(name: string, age: number)` | `function useX({ name, age }: Props)` — objeto nao depende de ordem |
| `useMessage.tsx` (hook sem JSX) | `useMessage.ts` — `.tsx` so para componentes que renderizam |
| Hook definido dentro do componente | Hook em `src/hooks/useNome.ts` com export |
| `return [show, hide]` (array sem nomes) | `return { show, hide }` — objeto com nomes explicitos |
| `const msg = useMessage()` seguido de `msg.show()` | `const { show } = useMessage()` — desestruture direto |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `React Hook "useX" is called outside of a function component` | Hook chamado fora de componente ou outro hook | Chame hooks apenas dentro de componentes React ou outros hooks |
| Hook nao atualiza o componente | Retornando valor primitivo em vez de estado reativo | Use `useState` dentro do hook para dados reativos |
| Arquivo `.tsx` sem JSX gera warning | Extensao errada para hook sem renderizacao | Renomeie para `.ts` — use `.tsx` apenas para componentes |
| `useMessage is not a function` | Falta `export` na definicao do hook | Adicione `export function useMessage(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre encapsulamento, contexto do hook e extensibilidade com objetos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes