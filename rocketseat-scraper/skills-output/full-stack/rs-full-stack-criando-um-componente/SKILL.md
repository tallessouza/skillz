---
name: rs-full-stack-criando-um-componente
description: "Enforces React component creation conventions when building UI components, organizing project structure, or setting up component files. Use when user asks to 'create a component', 'add a button component', 'organize React files', or 'set up component structure'. Applies rules: components folder inside src, function name starts uppercase, file name can be lowercase, always export, import by folder path. Make sure to use this skill whenever creating new React components or restructuring component files. Not for state management, hooks, styling, or routing logic."
---

# Criando um Componente React

> Componentes sao funcoes exportadas com nome iniciando em maiuscula, organizadas em pasta dedicada dentro de src.

## Rules

1. **Crie uma pasta `components` dentro de `src`** — porque centralizar componentes facilita navegacao e organizacao do projeto
2. **Nome do arquivo pode ser minusculo** — `button.tsx` e valido, porque o que importa e o nome da funcao, nao do arquivo
3. **Nome da funcao do componente DEVE iniciar com maiuscula** — `Button` nao `button`, porque React usa a convencao PascalCase para distinguir componentes de tags HTML
4. **Sempre exporte o componente** — `export function Button()` porque sem export nao e possivel importar em outros arquivos
5. **Componente sempre retorna JSX** — o `return` define o que sera renderizado na tela
6. **Importe pelo caminho da pasta** — `import { Button } from "./components/button"` navegando pela estrutura de pastas

## How to write

### Estrutura de pastas

```
src/
├── components/
│   └── button.tsx
├── App.tsx
└── main.tsx
```

### Componente basico

```tsx
// src/components/button.tsx
export function Button() {
  return <button>Clique aqui</button>
}
```

### Importando e usando

```tsx
// src/App.tsx
import { Button } from "./components/button"

export function App() {
  return <Button />
}
```

## Example

**Before (logica misturada no App):**
```tsx
export function App() {
  return (
    <div>
      <button>Clique aqui</button>
      <button>Enviar</button>
    </div>
  )
}
```

**After (componente separado e reutilizavel):**
```tsx
// src/components/button.tsx
export function Button() {
  return <button>Clique aqui</button>
}

// src/App.tsx
import { Button } from "./components/button"

export function App() {
  return (
    <div>
      <Button />
      <Button />
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elemento UI reutilizavel | Extrair para componente em `src/components/` |
| Trecho de JSX usado uma unica vez e pequeno | Pode manter inline no componente pai |
| Nome do componente | PascalCase na funcao: `Button`, `UserCard`, `Header` |
| Nome do arquivo | Minusculo e valido: `button.tsx`, `user-card.tsx` |
| Componente usado em outro arquivo | Deve ter `export` na declaracao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `export function button()` | `export function Button()` — PascalCase obrigatorio |
| `function Button() { ... }` (sem export) | `export function Button() { ... }` |
| Componente dentro de `App.tsx` | Arquivo separado em `src/components/` |
| `import { Button } from "button"` | `import { Button } from "./components/button"` — caminho relativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao de componentes e convencoes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes