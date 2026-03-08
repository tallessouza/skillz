# Code Examples: CSS Modules no React

## Exemplo 1: Componente Button completo (do transcript)

### Estrutura de arquivos

```
src/
├── App.tsx
├── global.css
└── components/
    └── Button/
        ├── index.tsx
        └── styles.module.css
```

### styles.module.css

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

### index.tsx

```tsx
import styles from './styles.module.css'

export function Button() {
  return (
    <button className={styles.container}>
      <span>Rodrigo</span>
    </button>
  )
}
```

### Importacao no App.tsx

```tsx
import { Button } from './components/Button'

export function App() {
  return (
    <div>
      <Button />
    </div>
  )
}
```

## Exemplo 2: Multiplos componentes sem conflito

### Card/styles.module.css

```css
/* Esta classe .container NAO conflita com a do Button */
.container {
  background-color: #29292e;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.container h2 {
  color: #e1e1e6;
  font-size: 1.25rem;
}

.container p {
  color: #8d8d99;
  margin-top: 0.5rem;
}
```

### Card/index.tsx

```tsx
import styles from './styles.module.css'

interface CardProps {
  title: string
  description: string
}

export function Card({ title, description }: CardProps) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
```

## Exemplo 3: Multiplas classes no mesmo modulo

### Input/styles.module.css

```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  color: #c4c4cc;
  font-size: 0.875rem;
}

.input {
  background-color: #121214;
  border: 1px solid #323238;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  color: #e1e1e6;
}

.input:focus {
  border-color: #00B37E;
  outline: none;
}
```

### Input/index.tsx

```tsx
import styles from './styles.module.css'

interface InputProps {
  label: string
  placeholder?: string
}

export function Input({ label, placeholder }: InputProps) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} placeholder={placeholder} />
    </div>
  )
}
```

## Exemplo 4: Combinando classes condicionalmente

```tsx
import styles from './styles.module.css'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: string
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return (
    <button
      className={`${styles.container} ${
        variant === 'secondary' ? styles.secondary : ''
      }`}
    >
      <span>{children}</span>
    </button>
  )
}
```

```css
.container {
  background-color: #00B37E;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.secondary {
  background-color: transparent;
  border: 2px solid #00B37E;
}

.container span {
  color: white;
  font-weight: 700;
  font-size: 1rem;
}
```

## Exemplo 5: CSS global vs CSS Module lado a lado

### global.css (importado uma vez no App)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #121214;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

### App.tsx

```tsx
import './global.css'
import { Button } from './components/Button'
import { Card } from './components/Card'

export function App() {
  return (
    <div>
      <Card title="Projeto" description="Meu primeiro projeto React" />
      <Button />
    </div>
  )
}
```