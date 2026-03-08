---
name: rs-full-stack-css-modules-2024
description: "Enforces CSS Modules patterns when styling React components with scoped CSS. Use when user asks to 'style a component', 'add CSS to React', 'create component styles', 'organize component files', or 'avoid CSS conflicts'. Applies rules: use .module.css extension, folder-per-component structure, import styles as object, access classes via styles.className. Make sure to use this skill whenever creating or styling React components. Not for global styles, Tailwind CSS, CSS-in-JS libraries, or styled-components."
---

# CSS Modules no React

> Cada componente React tem seu CSS escopado via CSS Modules, garantindo que estilos nao vazem para outros componentes.

## Rules

1. **Use a extensao `.module.css`** — nomeie arquivos de estilo como `styles.module.css`, porque o bundler precisa do `.module` para gerar classes escopadas automaticamente
2. **Organize em pasta por componente** — crie uma pasta com o nome do componente contendo `index.tsx` e `styles.module.css`, porque isso agrupa estrutura e estilo sem duplicar nomes
3. **Importe styles como objeto** — `import styles from './styles.module.css'`, porque isso permite acesso tipado e escopado as classes
4. **Aplique classes via `className={styles.nome}`** — use chaves com referencia ao objeto, nao strings literais, porque strings literais nao ativam o escopo do CSS Module
5. **Use seletores descendentes dentro do modulo** — `.container span {}` em vez de criar classes extras para cada elemento filho, porque o escopo ja garante isolamento

## How to write

### Estrutura de pasta do componente

```
Button/
├── index.tsx          # Estrutura do componente
└── styles.module.css  # Estilos escopados
```

### Arquivo de estilos (styles.module.css)

```css
.container {
  background-color: #202024;
  border: 2px solid #00B37E;
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
}

.container span {
  color: white;
  font-weight: 700;
  font-size: 1rem;
}
```

### Componente com CSS Module

```tsx
import styles from './styles.module.css'

export function Button() {
  return (
    <button className={styles.container}>
      <span>Click me</span>
    </button>
  )
}
```

### Importacao do componente

```tsx
// Nao precisa de /index — o bundler resolve automaticamente
import { Button } from './Button'
```

## Example

**Before (CSS global, sem escopo):**

```tsx
// styles.css (global — afeta toda a aplicacao)
.button { background: blue; }

// Button.tsx
import './styles.css'
export function Button() {
  return <button className="button">Click</button>
}
```

**After (CSS Module, escopado):**

```tsx
// Button/styles.module.css
.container { background: #202024; border: 2px solid #00B37E; }

// Button/index.tsx
import styles from './styles.module.css'
export function Button() {
  return <button className={styles.container}>Click</button>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estilo global (reset, fontes, variaveis) | Use `global.css` importado no App |
| Estilo de um componente especifico | Use `styles.module.css` na pasta do componente |
| Elemento filho simples dentro do componente | Use seletor descendente (`.container span`) |
| Componente com muitas variantes | Crie classes adicionais no mesmo module (`.containerActive`) |
| Importando componente de pasta | Use `import { X } from './X'` sem `/index` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `className="container"` (string literal) | `className={styles.container}` |
| `import './styles.css'` (import sem objeto) | `import styles from './styles.module.css'` |
| `Button.tsx` + `Button.css` soltos na raiz | `Button/index.tsx` + `Button/styles.module.css` |
| Criar classe para cada elemento filho | Usar seletor descendente `.container span` |
| Arquivo `styles.css` sem `.module` | Arquivo `styles.module.css` com `.module` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre CSS escopado, analogias e motivacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes