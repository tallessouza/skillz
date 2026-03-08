# Code Examples: CSS Modules no React

## Exemplo 1: Conversao completa de CSS global para Module

### Antes — CSS Global

```
src/
├── App.tsx
└── styles.css
```

```css
/* styles.css */
.container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
```

```tsx
// App.tsx
import './styles.css'

export function App() {
  return (
    <div className="container">
      <button>Adicionar</button>
      <span>0</span>
      <button>Remover</button>
    </div>
  )
}
```

### Depois — CSS Module

```
src/
├── App.tsx
└── app.module.css
```

```css
/* app.module.css */
.container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.container > span {
  color: white;
  font-size: 3rem;
  font-weight: 700;
}
```

```tsx
// App.tsx
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

## Exemplo 2: Multiplas classes no mesmo Module

```css
/* card.module.css */
.card {
  background: #1a1a2e;
  border-radius: 8px;
  padding: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.description {
  font-size: 0.875rem;
  color: #a1a1aa;
  margin-top: 0.5rem;
}
```

```tsx
import styles from './card.module.css'

export function Card() {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Titulo</h2>
      <p className={styles.description}>Descricao do card</p>
    </div>
  )
}
```

## Exemplo 3: Combinando classes condicionalmente

```css
/* button.module.css */
.button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.primary {
  background: #8257e5;
  color: white;
}

.danger {
  background: #e5574f;
  color: white;
}
```

```tsx
import styles from './button.module.css'

interface ButtonProps {
  variant: 'primary' | 'danger'
  children: string
}

export function Button({ variant, children }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  )
}
```

## Exemplo 4: Seletor de filho direto vs descendente

### Problema — span dentro do botao recebe estilo indesejado

```css
/* ERRADO: .container span atinge TODOS os spans descendentes */
.container span {
  color: white;
  font-size: 3rem;
}
```

```tsx
<div className={styles.container}>
  <button>
    <span>Texto do botao</span>  {/* TAMBEM recebe font-size: 3rem! */}
  </button>
  <span>0</span>  {/* Este era o alvo */}
</div>
```

### Solucao — filho direto

```css
/* CORRETO: .container > span atinge APENAS filhos diretos */
.container > span {
  color: white;
  font-size: 3rem;
}
```

```tsx
<div className={styles.container}>
  <button>
    <span>Texto do botao</span>  {/* NAO afetado */}
  </button>
  <span>0</span>  {/* Unico afetado */}
</div>
```

## Exemplo 5: Layout centralizado completo com Flexbox

```css
/* layout.module.css */

/* Container que ocupa toda a viewport */
.wrapper {
  display: flex;
  flex: 1;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  background: #121214;
}

/* Grupo de elementos com espacamento uniforme */
.controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Texto central destacado */
.controls > span {
  color: white;
  font-size: 3rem;
  font-weight: 700;
}
```

```tsx
import styles from './layout.module.css'

export function Counter() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <button>Adicionar</button>
        <span>0</span>
        <button>Remover</button>
      </div>
    </div>
  )
}
```

## Exemplo 6: TypeScript — declaracao de tipos para CSS Modules

Quando o TypeScript reclama de `Cannot find module './app.module.css'`, crie um arquivo de declaracao:

```typescript
// src/styles.d.ts
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}
```

Isso informa ao TypeScript que qualquer import de `.module.css` retorna um objeto com chaves string e valores string (os nomes das classes hasheadas).