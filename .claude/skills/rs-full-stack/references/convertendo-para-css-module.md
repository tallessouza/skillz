---
name: rs-full-stack-convertendo-para-css-module
description: "Enforces CSS Modules conventions when styling React components with scoped CSS. Use when user asks to 'style a component', 'convert CSS to modules', 'add scoped styles', 'create CSS module', or 'organize component styles'. Applies rules: .module.css naming, named import with styles object, dot notation for class access, direct child selectors for nested elements. Make sure to use this skill whenever creating or converting component styles in React projects. Not for Tailwind CSS, styled-components, or global stylesheet configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-styling
  tags: [react, css-modules, scoped-css, styling, vite, webpack]
---

# CSS Modules no React

> Converta arquivos CSS para CSS Modules usando a convencao `.module.css` e acesse classes via objeto `styles` importado.

## Rules

1. **Nomeie arquivos com `.module.css`** — `app.module.css` nao `styles.css`, porque o bundler (Vite/Webpack) so ativa scoping automatico com essa convencao
2. **Importe como objeto nomeado** — `import styles from './app.module.css'` nao `import './styles.css'`, porque permite acesso tipado e scoped das classes
3. **Acesse classes com dot notation** — `className={styles.container}` nao `className="container"`, porque strings literais nao sao resolvidas pelo modulo
4. **Use seletor de filho direto `>`** — `.container > span` nao `.container span`, porque evita vazamento de estilo para elementos aninhados mais profundos (como spans dentro de botoes)
5. **Centralize com Flexbox no container** — `display: flex` + `justify-content: center` + `align-items: center` + `flex: 1`, porque e o padrao mais previsivel para centralizar layouts em React

## How to write

### Renomear e importar CSS Module

```tsx
// Arquivo: app.module.css (nao styles.css)
// Importacao no componente:
import styles from './app.module.css'

export function App() {
  return (
    <div className={styles.container}>
      <button>Adicionar</button>
      <span>0</span>
      <button>Remover</button>
    </div>
  )
}
```

### Estilizar container centralizado com gap

```css
/* app.module.css */
.container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

/* Filho direto — nao afeta spans dentro de botoes */
.container > span {
  color: white;
  font-size: 3rem;
  font-weight: 700;
}
```

## Example

**Before (CSS global com classe string):**

```tsx
import './styles.css'

export function App() {
  return (
    <div className="container">
      <span>0</span>
    </div>
  )
}
```

**After (CSS Module com objeto styles):**

```tsx
import styles from './app.module.css'

export function App() {
  return (
    <div className={styles.container}>
      <span>0</span>
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente com estilos proprios | Criar `{componente}.module.css` no mesmo diretorio |
| Classe aplicada em JSX | Usar `styles.nomeDaClasse` entre chaves |
| Estilo em elementos filhos | Usar seletor `>` para filho direto dentro do `.module.css` |
| Espacamento entre elementos irmaos | Usar `gap` no container flex, nao margin nos filhos |
| Centralizar conteudo na tela inteira | Combinar `flex: 1` + `justify-content: center` + `align-items: center` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import './styles.css'` (global) | `import styles from './app.module.css'` |
| `className="container"` | `className={styles.container}` |
| `.container span` (descendente) | `.container > span` (filho direto) |
| `margin-left` em cada botao | `gap: 1.5rem` no container flex |
| `styles.css` (nome generico) | `app.module.css` (nome do componente) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Estilos nao aplicam no componente | Arquivo nao usa convencao `.module.css` | Renomeie para `componente.module.css` |
| `styles.container` retorna undefined | Classe nao existe no arquivo CSS module | Verifique o nome da classe no `.module.css` (case-sensitive) |
| Estilo vaza para componentes filhos | Usando seletor descendente em vez de filho direto | Troque `.container span` por `.container > span` |
| TypeScript reclama de import do CSS module | Faltam type declarations para CSS modules | Crie `src/types/css.d.ts` com `declare module '*.module.css'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre scoping, bundler behavior e filho direto
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes