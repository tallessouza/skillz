---
name: rs-full-stack-importando-css-1
description: "Enforces correct CSS import and className usage patterns in React components. Use when user asks to 'style a component', 'add CSS', 'import styles', 'apply a class in React', or 'create a stylesheet'. Covers CSS file import syntax without named imports, className instead of class, and basic viewport styling. Make sure to use this skill whenever writing JSX that references CSS classes. Not for CSS Modules, Tailwind, styled-components, or CSS-in-JS solutions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-styling
  tags: [react, css, import, className, styling]
---

# Importando CSS no React

> Importe arquivos CSS diretamente e use `className` em vez de `class` para aplicar estilos em componentes React.

## Rules

1. **Importe CSS sem named import** — use `import './styles.css'` e não `import styles from './styles.css'`, porque o CSS global não exporta um objeto (CSS Modules é outro padrão)
2. **Use `className` em vez de `class`** — `class` é palavra reservada do JavaScript (`class MinhaClasse {}`), por isso o React usa `className` como atributo JSX
3. **Inclua a extensão `.css` no import** — componentes `.tsx`/`.jsx` não precisam de extensão no import, mas arquivos CSS precisam da extensão explícita
4. **Coloque arquivos CSS na pasta `src/`** — no mesmo nível ou próximo dos componentes que os utilizam, para imports com `./` relativo
5. **Use `100vh` para altura de tela cheia** — `height: 100%` depende do pai ter altura definida, `100vh` usa a viewport como referência direta

## How to write

### Import de CSS no componente

```tsx
// Import direto — sem "from", sem nome
import './styles.css'

export function App() {
  return (
    <div className="container">
      <h1>Minha aplicação</h1>
    </div>
  )
}
```

### Arquivo CSS com classe global

```css
/* src/styles.css */
.container {
  background-color: red;
  width: 100%;
  height: 100vh;
}
```

## Example

**Before (erro comum de quem vem do HTML):**
```tsx
// Erro 1: named import desnecessário para CSS global
import styles from './styles.css'

export function App() {
  // Erro 2: "class" em vez de "className"
  return <div class="container">Hello</div>
}
```

**After (com esta skill aplicada):**
```tsx
import './styles.css'

export function App() {
  return <div className="container">Hello</div>
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| CSS global para toda a aplicação | `import './styles.css'` direto, sem named import |
| Precisa de escopo por componente | Use CSS Modules (`import styles from './Component.module.css'`) — outro padrão |
| Elemento precisa ocupar tela inteira | `height: 100vh` no CSS, não `height: 100%` |
| Aplicar classe em elemento JSX | Sempre `className`, nunca `class` |
| Import de componente `.tsx` | Sem extensão: `import { App } from './App'` |
| Import de arquivo `.css` | Com extensão: `import './styles.css'` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `import styles from './styles.css'` (CSS global) | `import './styles.css'` |
| `<div class="container">` | `<div className="container">` |
| `import './styles'` (sem extensão) | `import './styles.css'` |
| `height: 100%` (para tela cheia sem pai definido) | `height: 100vh` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Estilo nao aplica no componente | Usando `class` em vez de `className` no JSX | Troque `class=` por `className=` em todos os elementos JSX |
| Erro "Cannot find module './styles'" | Import sem extensao `.css` | Adicione a extensao: `import './styles.css'` |
| CSS global afeta componentes inesperados | CSS importado sem escopo aplica globalmente | Use CSS Modules (`Component.module.css`) para escopo local |
| `height: 100%` nao funciona para tela cheia | Elemento pai nao tem altura definida | Use `height: 100vh` que referencia a viewport diretamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre className vs class, sistema de imports do bundler e viewport units
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações