# Code Examples: Estilização CSS no React — Fundamentos

## Exemplo 1: Importando CSS global

```css
/* src/styles/global.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #121214;
  color: #e1e1e6;
}
```

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

## Exemplo 2: CSS por componente

```css
/* src/components/Header/styles.css */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #202024;
}

.header h1 {
  font-size: 1.5rem;
  color: #00b37e;
}
```

```jsx
// src/components/Header/index.jsx
import './styles.css'

export function Header() {
  return (
    <header className="header">
      <h1>Minha App</h1>
    </header>
  )
}
```

## Exemplo 3: Estilos inline com objetos JavaScript

```jsx
export function Card({ title, description }) {
  const cardStyle = {
    backgroundColor: '#29292e',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  }

  const titleStyle = {
    fontSize: '1.25rem',
    color: '#e1e1e6',
    marginBottom: '0.5rem',
  }

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <p style={{ color: '#a8a8b3' }}>{description}</p>
    </div>
  )
}
```

## Exemplo 4: className dinâmico

```jsx
export function Button({ variant = 'primary', children }) {
  return (
    <button className={`button button-${variant}`}>
      {children}
    </button>
  )
}
```

```css
/* styles.css */
.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button-primary {
  background-color: #00875f;
  color: #fff;
}

.button-primary:hover {
  background-color: #00b37e;
}

.button-secondary {
  background-color: #323238;
  color: #e1e1e6;
}

.button-secondary:hover {
  background-color: #29292e;
}
```

## Exemplo 5: Estrutura de pastas para estilos

```
src/
├── styles/
│   └── global.css          # Reset, variáveis, tipografia base
├── components/
│   ├── Header/
│   │   ├── index.jsx
│   │   └── styles.css       # Estilos específicos do Header
│   ├── Card/
│   │   ├── index.jsx
│   │   └── styles.css       # Estilos específicos do Card
│   └── Button/
│       ├── index.jsx
│       └── styles.css       # Estilos específicos do Button
├── App.jsx
└── main.jsx
```

## Padrão: className vs class

```jsx
// CORRETO — JSX usa className
<div className="container">
  <p className="text-highlight">Conteúdo</p>
</div>

// ERRADO — class é palavra reservada em JavaScript
<div class="container">
  <p class="text-highlight">Conteúdo</p>
</div>
```

## Padrão: Estilos inline usam camelCase

```jsx
// CORRETO — propriedades CSS em camelCase
<div style={{ backgroundColor: '#202024', fontSize: '1rem' }}>

// ERRADO — propriedades CSS com hífen não funcionam como chave de objeto
<div style={{ 'background-color': '#202024', 'font-size': '1rem' }}>
```