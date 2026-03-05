# Code Examples: Roteamento em Apps Electron

## 1. Instalacao

```bash
# Instalar na raiz do projeto (nao dentro de src/renderer)
npm install electron-router-dom react-router-dom
```

## 2. Main Process completo

```typescript
// src/main/index.ts
import { app, BrowserWindow } from 'electron'
import path from 'path'
import { createFileRoute, createURLRoute } from 'electron-router-dom'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1120,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const id = 'main'

  const devServerURL = createURLRoute(id, 'http://localhost:5173')
  const fileRoute = createFileRoute(
    id,
    path.join(__dirname, '..', 'renderer', 'index.html')
  )

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }
}

app.whenReady().then(createWindow)
```

## 3. Routes do Renderer

```typescript
// src/renderer/src/routes.tsx
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

## 4. Pagina com navegacao (Link)

```typescript
// src/renderer/src/pages/Blank.tsx
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

```typescript
// src/renderer/src/pages/Document.tsx
import { Link } from 'react-router-dom'

export function Document() {
  return (
    <main>
      <h1>Documento</h1>
      <Link to="/">Acessar blank</Link>
    </main>
  )
}
```

## 5. App usando Routes

```typescript
// src/renderer/src/App.tsx
import { Routes } from './routes'

export function App() {
  return <Routes />
}
```

## 6. Exemplo com multiplas janelas

```typescript
// Main process - criando segunda janela
function createSettingsWindow() {
  const settingsWindow = new BrowserWindow({ width: 600, height: 400 })

  const id = 'settings'

  const devServerURL = createURLRoute(id, 'http://localhost:5173')
  const fileRoute = createFileRoute(
    id,
    path.join(__dirname, '..', 'renderer', 'index.html')
  )

  if (process.env.NODE_ENV === 'development') {
    settingsWindow.loadURL(devServerURL)
  } else {
    settingsWindow.loadFile(...fileRoute)
  }
}

// Renderer - rotas para ambas janelas
export function Routes() {
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
          <Route path="/about" element={<About />} />
        </>
      }
    />
  )
}
```