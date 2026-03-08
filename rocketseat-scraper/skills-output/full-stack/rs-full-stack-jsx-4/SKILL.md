---
name: rs-full-stack-jsx-4
description: "Enforces JSX and React component creation best practices when writing React components, exporting functions, or structuring component files. Use when user asks to 'create a component', 'write JSX', 'export a component', 'setup React file', or 'render HTML in React'. Applies rules: components are functions with PascalCase names, use named exports over default exports, JSX returns declarative UI, omit file extensions in imports. Make sure to use this skill whenever creating new React components or structuring component exports. Not for styling, state management, hooks, or backend logic."
---

# JSX e Criação de Componentes React

> Todo componente React é uma função com nome PascalCase que retorna JSX declarativo, exportada de forma nomeada.

## Rules

1. **Componente é uma função** — crie componentes como funções que retornam JSX, porque React usa composição de funções como modelo mental principal
2. **PascalCase obrigatório** — `App`, `UserProfile`, `CartItem`, nunca `app` ou `userProfile`, porque React diferencia componentes de elementos HTML pelo case
3. **Use exportação nomeada** — `export function App()` não `export default function App()`, porque named exports forçam o uso do nome correto e evitam renomeações acidentais
4. **Omita extensão nos imports** — `import { App } from './App'` não `'./App.tsx'`, porque o bundler resolve automaticamente e o código fica mais limpo
5. **Retorno declarativo** — o return do componente declara O QUE renderizar, não COMO renderizar, porque JSX é uma descrição declarativa da UI

## How to write

### Componente básico com exportação nomeada

```tsx
// app.tsx — componente exportado por nome
export function App() {
  return <h1>Hello World!</h1>
}
```

### Importação correta (sem extensão, named import)

```tsx
// main.tsx — importa pelo nome exato do componente
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

### Uso do componente no JSX

```tsx
// Componente usado como tag auto-fechante
<App />

// Ou com children
<App>
  <ChildComponent />
</App>
```

## Example

**Before (export default — permite renomeação acidental):**

```tsx
// app.tsx
export default function App() {
  return <h1>Hello World!</h1>
}

// main.tsx — qualquer nome é aceito, perde rastreabilidade
import Batata from './App.tsx'
<Batata />
```

**After (named export — força nome correto):**

```tsx
// app.tsx
export function App() {
  return <h1>Hello World!</h1>
}

// main.tsx — obrigado a usar o nome real
import { App } from './App'
<App />
```

## Heuristics

| Situação | Faça |
|----------|------|
| Novo arquivo de componente | Crie função PascalCase com `export function` |
| Importando componente | Use destructuring `{ Nome }`, sem extensão |
| Componente sem filhos | Use tag auto-fechante `<App />` |
| Componente com filhos | Use tag aberta/fechada `<App>...</App>` |
| Hot reload não reflete | Verifique se salvou o arquivo e se `npm run dev` está rodando |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `export default function App()` | `export function App()` |
| `import App from './App'` | `import { App } from './App'` |
| `import { App } from './App.tsx'` | `import { App } from './App'` |
| `function app()` (minúsculo) | `function App()` (PascalCase) |
| `import Batata from './App'` | `import { App } from './App'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre JSX, exportações e modelo declarativo do React
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações