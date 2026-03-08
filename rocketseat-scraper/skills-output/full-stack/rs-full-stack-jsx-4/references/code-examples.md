# Code Examples: JSX e Criação de Componentes React

## Exemplo 1: Componente mínimo

```tsx
// app.tsx
export function App() {
  return <h1>Hello World!</h1>
}
```

O componente mais simples possível: uma função que retorna um único elemento JSX.

## Exemplo 2: Main montando o componente

```tsx
// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- `createRoot` cria a raiz do React no elemento `#root` do HTML
- `StrictMode` ativa verificações extras em desenvolvimento
- `<App />` renderiza o componente principal

## Exemplo 3: Default export vs Named export

### Default export (evitar):

```tsx
// app.tsx
export default function App() {
  return <h1>Hello World!</h1>
}

// main.tsx — aceita qualquer nome
import App from './App'        // funciona
import Batata from './App'     // também funciona — PROBLEMA
import Xyz from './App'        // também funciona — PROBLEMA
```

### Named export (preferir):

```tsx
// app.tsx
export function App() {
  return <h1>Hello World!</h1>
}

// main.tsx — exige nome correto
import { App } from './App'      // funciona
import { Batata } from './App'   // ERRO — Batata não existe em App
```

## Exemplo 4: Import sem extensão

```tsx
// ERRADO — extensão desnecessária
import { App } from './App.tsx'

// CORRETO — bundler resolve automaticamente
import { App } from './App'
```

## Exemplo 5: Variações de componentes simples

```tsx
// Componente com parágrafo
export function Welcome() {
  return <p>Bem-vindo ao sistema!</p>
}

// Componente com múltiplos elementos (precisa de wrapper)
export function Header() {
  return (
    <header>
      <h1>Minha Aplicação</h1>
      <nav>Menu aqui</nav>
    </header>
  )
}

// Componente com fragment (sem wrapper extra no DOM)
export function Info() {
  return (
    <>
      <h2>Título</h2>
      <p>Descrição</p>
    </>
  )
}
```

## Exemplo 6: Usando componentes dentro de outros

```tsx
export function Header() {
  return <h1>Meu App</h1>
}

export function App() {
  return (
    <div>
      <Header />
      <p>Conteúdo principal</p>
    </div>
  )
}
```

## Exemplo 7: Hot reload em ação

```tsx
// Passo 1: Salva com "Hello World"
export function App() {
  return <h1>Hello World!</h1>
}
// → Navegador mostra "Hello World!"

// Passo 2: Altera para "Hello React" e salva
export function App() {
  return <h1>Hello React!</h1>
}
// → Navegador atualiza instantaneamente para "Hello React!"
// Sem recarregar a página, sem perder estado
```

## Comando para rodar

```bash
npm run dev
# Vite serve em http://localhost:5173
# Hot reload ativo — alterações refletem instantaneamente
```