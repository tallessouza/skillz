# Code Examples: React Router — Navegação em Aplicações React

## Instalação básica

```bash
# Com npm
npm install react-router-dom

# Com yarn
yarn add react-router-dom

# Com pnpm
pnpm add react-router-dom
```

## Setup mínimo do React Router

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

## Definindo rotas básicas

```tsx
// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { About } from './pages/About'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}
```

## Navegação entre páginas (sem reload)

```tsx
// src/components/Header.tsx
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">Sobre</Link>
    </nav>
  )
}
```

## Comparação: sem React Router vs com React Router

### Sem React Router (abordagem manual — frágil)

```tsx
import { useState } from 'react'
import { Home } from './pages/Home'
import { About } from './pages/About'

export function App() {
  const [page, setPage] = useState('home')

  return (
    <>
      <button onClick={() => setPage('home')}>Home</button>
      <button onClick={() => setPage('about')}>Sobre</button>

      {page === 'home' && <Home />}
      {page === 'about' && <About />}
    </>
  )
}
// Problemas: sem URL, sem histórico, sem deep linking
```

### Com React Router (abordagem correta)

```tsx
import { Routes, Route, Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { About } from './pages/About'

export function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">Sobre</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}
// URL atualiza, histórico funciona, deep linking funciona
```