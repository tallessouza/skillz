---
name: rs-electron-configurando-roteamento
description: "Applies Electron multi-window routing setup using electron-router-dom and React Router DOM. Use when user asks to 'add routing to Electron app', 'configure routes in Electron', 'create multiple windows with navigation', or 'setup React Router in Electron'. Covers main process file/URL root creation, renderer route configuration with window IDs, and Link navigation. Make sure to use this skill whenever building Electron apps with React that need page navigation. Not for web-only React routing, Next.js routing, or Electron IPC communication."
---

# Roteamento em Apps Electron com React Router DOM

> Configure instancias de roteamento separadas por janela usando electron-router-dom, porque apps Electron podem ter multiplas janelas com rotas independentes.

## Rules

1. **Use electron-router-dom, nao React Router DOM direto** — porque Electron pode ter multiplas janelas, cada uma precisa de sua propria instancia de roteamento
2. **Cada janela recebe um ID unico** — `main`, `settings`, etc. O ID no main process deve corresponder ao ID no renderer
3. **Configure file root e URL root no main process** — `createURLRoot` para dev server, `createFileRoute` para build
4. **Agrupe rotas por janela no renderer** — use `<Route id="main">` para rotas da janela principal, `<Route id="settings">` para janela de ajustes
5. **Use Link do react-router-dom para navegacao** — funciona normalmente dentro de cada instancia de roteamento

## How to write

### Main Process (main/index.ts)

```typescript
import { createFileRoute, createURLRoute } from 'electron-router-dom'

function createWindow() {
  const mainWindow = new BrowserWindow({ /* ... */ })

  const id = 'main'

  const devServerURL = createURLRoute(id, 'http://localhost:5173')
  const fileRoute = createFileRoute(id, path.join(__dirname, '..', 'renderer', 'index.html'))

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }
}
```

### Renderer Routes (src/routes.tsx)

```typescript
import { Router, Route } from 'electron-router-dom'
import { Blank } from './pages/Blank'
import { Document } from './pages/Document'

export function Routes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<Blank />} />
          <Route path="/document" element={<Document />} />
        </>
      }
    />
  )
}
```

### Navegacao com Link

```typescript
import { Link } from 'react-router-dom'

export function Blank() {
  return (
    <main>
      <p>Selecione ou crie um documento</p>
      <Link to="/document">Acessar documento</Link>
    </main>
  )
}
```

## Example

**Before (React Router DOM direto — nao suporta multiplas janelas):**
```typescript
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
```

**After (com electron-router-dom — suporta multiplas janelas):**
```typescript
import { Router, Route } from 'electron-router-dom'

function App() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<Blank />} />
          <Route path="/document" element={<Document />} />
        </>
      }
      settings={
        <>
          <Route path="/" element={<Preferences />} />
        </>
      }
    />
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App Electron com uma unica janela | Use electron-router-dom com ID `main` |
| Multiplas janelas (ex: settings) | Crie novo ID no main process e adicione prop correspondente no Router |
| Navegacao entre paginas | Use `Link` do react-router-dom normalmente |
| Dev vs production | Use `createURLRoute` para dev, `createFileRoute` para build |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `<BrowserRouter>` direto em Electron | `<Router main={...}>` do electron-router-dom |
| IDs diferentes entre main e renderer | Mesmo ID (`main`) nos dois processos |
| Instalar apenas react-router-dom | Instalar ambos: `electron-router-dom` e `react-router-dom` |
| Hardcodar URL no loadURL sem createURLRoute | Usar `createURLRoute(id, url)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
